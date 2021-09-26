const robot = require("robotjs");
const fs = require('fs');
const clipboardy = require('clipboardy');
let urlsList = fs.readFileSync('urls.txt', 'utf-8', console.error).replace(/youtu.be\//gi, "youtube.com/watch?v=").split('\n');
let metadataBase = JSON.parse(fs.readFileSync('linksMetaDataBase.txt', console.error));
robot.setMouseDelay(200);

const ytdl = require('ytdl-core');
const colors = require('colors');
const stringSimilarity = require("string-similarity");

const homedir = require('os').homedir();

let fetchFolder = homedir + '/Downloads';

let f = 0;
let files = [];

fs.readdirSync(fetchFolder).forEach(file => {
  if (!file.includes('.mp3')) return;
  file = file.replace(/\[[0-9]{0,3}K\]__\[.*\]\.mp3/g, '');
  files.push(file);
  console.log(("(===) " + file).green);
});

async function checkInfo(videos) {
  for (i=0; videos.length > i; i++) {
    console.log('\n');
    let url = videos[i];
    let probsError = false;
    let info;
    if (typeof metadataBase[url] === 'undefined') {
      info = await ytdl.getInfo(url).catch((err) => {
        console.log("Fatal fetching error occured. Skipped: " + url);
        console.log(err);
        probsError = true;
        f++
      });
      if (probsError) {
        continue;
      }
      metadataBase[url] = info;
      console.log("Fetched ".cyan + "YouTube".red + (" for " + url).cyan);
    }
    else {
      info = metadataBase[url];
      console.log(("Retrieved data from static database for " + url).cyan);
    }
    let name = info.videoDetails.title;
    name = name.replace(/\\|\/|\:|\*|\?|\"|\<|\>|\|/g, '');
    let percent = 0;
    if (files.length > 0) {
      let matched = stringSimilarity.findBestMatch(name, files);
      percent = matched.bestMatch.rating*100;
      let prcntStr = "(" + percent + "%) " + name + "\n\u200b[" + files[matched.bestMatchIndex] + "]";
      if (percent >= 80) {
        console.log((prcntStr).blue);
      }
      else {
        console.log((prcntStr).magenta);
      }
    }
    if (files.length === 0 || percent < 80) {
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
    }
    else {
      f++
    }
  }
}

checkInfo(urlsList).catch(console.error);
setInterval(() => {
  fs.writeFileSync('linksMetaDataBase.txt', JSON.stringify(metadataBase, null, 4), ()=>{});
  if (f === urlsList.length) {
    console.log("Finished");
    process.exit();
  }
}, 5000);

process.on("SIGINT", async () => {
  // do not exit right away
  console.log('exit' + 'ante'.gray);
  process.exit();
});