const fs = require('fs');
const ytpl = require('ytpl');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let links = [];
let actualList = [];

console.log('Please input your YT playlists links');

rl.on(
    'line', (link) => {
        if (link === '') {
            rl.emit('close');
        }
        links.push(link);
    }
);

rl.on('close', async () => {
    for (i=0; i < links.length; i++) {
        let myList;
        try {
            myList = await ytpl(links[i]);            
        }
        catch (error) {
            console.log('error in ' + links[i]);
            continue
        }
        for (j=0; j < myList.items.length; j++) {
            actualList.push(myList.items[j].shortUrl);
            console.log(myList.items[j].shortUrl);
        }
    }
    if (actualList.length > 0) {
        await fs.writeFile('youtubeplaylist.txt', actualList.join('\n'), console.error);
        process.exit();
    }
    else {
        console.log('error, no links');
        process.exit();
    }
});