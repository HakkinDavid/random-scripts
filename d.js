const robot = require("robotjs");
const fs = require('fs');
const { stringifyStream, parseChunked } = require('@discoveryjs/json-ext');
const clipboardy = require('clipboardy');

let urlsList = fs.readFileSync('urls.txt', 'utf-8', console.error).replace(/youtu.be\//gi, "youtube.com/watch?v=").split('\n');
let metadataBase;
robot.setMouseDelay(200);

const ytdl = require('ytdl-core');
const colors = require('colors');
const stringSimilarity = require("string-similarity");

const homedir = require('os').homedir();

let fetchFolder = homedir + '/Downloads';

let inExit = false;

let completed = [];
let files = [];
let withError = [];
let missing = [];

fs.readdirSync(fetchFolder).forEach(file => {
  if (!file.includes('.mp3')) return;
  file = file.replace(/\[[0-9]{0,3}K\]__\[.*\]\.[A-Za-z0-9]+$/g, '').replace(/\\|\/|\:|\*|\?|\"|\<|\>|\|/g, '');
  files.push(file);
  console.log(("(===) " + file).green);
});

async function checkInfo(videos) {
  try {
    metadataBase = await parseChunked(fs.createReadStream('linksMetaDataBase.json'));
  }
  catch {
    console.error("Unexpected parsing, attempting to retrieve backup.");
    metadataBase = await parseChunked(fs.createReadStream('linksMetaDataBaseBACKUP.json'));
  }
  for (i=0; videos.length > i; i++) {
    if (inExit) {
      return;
    }
    console.log('\n');
    let url = videos[i];
    let probsError = false;
    let info;
    if (typeof metadataBase[url] === 'undefined') {
      info = await ytdl.getInfo(url).catch((e) => {
        console.log("Fatal fetching error occured. Skipped: " + url);
        console.log(e);
        probsError = true;
        withError[url] = {
          error: e.statusCode
        }
      });
      if (probsError) {
        continue;
      }
      console.log("Fetched ".cyan + "YouTube".red + (" for " + url).cyan);
      metadataBase[url] = {
        videoDetails: info.videoDetails
      };
    }
    else {
      info = metadataBase[url];
      console.log(("Retrieved data from static database for " + url).cyan);
    }
    if (metadataBase[url].error === 410) {
      console.log("(0%) --- Problematic URL skipped due to previous 410 code".brightRed);
      continue;
    }
    let name = info.videoDetails.title;
    name = name.replace(/\\|\/|\:|\*|\?|\"|\<|\>|\|/g, '');
    let percent = 0;
    if (files.length > 0) {
      let matched = stringSimilarity.findBestMatch(name, files);
      percent = matched.bestMatch.rating*100;
      let prcntStr = "(" + percent + "%) " + name + "\n\u200b[" + files[matched.bestMatchIndex] + "]";
      if (percent >= 100) {
        console.log((prcntStr).blue);
      }
      else {
        console.log((prcntStr).magenta);
      }
    }
    if (files.length === 0 || percent < 100) {
      robot.moveMouse(92, 75);
      robot.mouseClick();
      robot.keyTap("a", "control"); robot.keyTap("delete");
      clipboardy.writeSync(urlsList[i]);
      robot.keyTap("v", "control");
      if (robot.getMousePos().y !== 75) return;
      robot.moveMouse(1882, 78);
      robot.mouseClick();
      if (robot.getMousePos().y !== 78) return;
      robot.moveMouse(971, 523);
      if (robot.getPixelColor(971, 523) == '0dd5d8') { robot.mouseClick(); }
      completed.push(url);
    }
    else {
      completed.push(url);
    }
  }
}

checkInfo(urlsList).catch(console.error);
let backup = setInterval(async () => {
  if (inExit) {
    clearInterval(backup);
    return
  }
  await stringifyStream(metadataBase, null, 4).pipe(fs.createWriteStream('linksMetaDataBase.json'))
    .on('error', (e) => {
      console.error(e);
    })
    .on('finish', () => {
      console.log("Written database periodic backup. Current URLs metadata stored: " + Object.keys(metadataBase).length);
      if ((completed.length + withError.length) === urlsList.length) {
        process.emit("SIGINT");
      }
    });
}, 60000);

process.on("SIGINT", async () => {
  // do not exit right away
  console.log("\n");
  console.log("Our paths have parted ways.".brightGreen)
  inExit = true;
  for (i=0; urlsList.length > i; i++) {
    let index = completed.indexOf(urlsList[i]);
    if (index === -1) {
      if (withError[urlsList[i]]) {
        console.log(("Error [" + withError[urlsList[i]].error + "] at " + urlsList[i]).red);
        metadataBase[urlsList[i]] = withError[urlsList[i]];
      }
      else if (metadataBase[urlsList[i]] && metadataBase[urlsList[i]].error === 410) {
        console.log(("Known [410] at " + urlsList[i]).brightRed);
      }
      else {
        console.log(("Missing status for " + urlsList[i]).brightRed);
        missing.push(urlsList[i]);
      }
    }
  }
  console.log(("Completed " + completed.length).blue + (" (out of " + urlsList.length +")").cyan + "," + (" skipped " + Object.keys(withError).length + " with errors").red + " and there are " + (missing.length + " missing").brightRed + ".");
  console.log("Backing up data before exiting.".yellow);
  await stringifyStream(metadataBase, null, 4).pipe(fs.createWriteStream('linksMetaDataBaseBACKUP.json'))
    .on('error', (e) => {
      console.error(e);
      process.emit("SIGINT");
    })
    .on('finish', async () => {
      await stringifyStream(metadataBase, null, 4).pipe(fs.createWriteStream('linksMetaDataBase.json'))
        .on('error', (e) => {
          console.error(e);
        })
        .on('finish', () => {
          console.log("I'll see you soon.".magenta);
          try {
            process.exit();
          }
          catch {
            console.log("What.".red);
          }
        });
    });
});