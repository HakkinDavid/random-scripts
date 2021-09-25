const fs = require('fs');

let urls = fs.readFileSync('youtubeplaylist.txt').toString().split('\n');

let newURLs = [];
let duplicates = [];

for (i=0; urls.length > i; i++) {
    if (newURLs.indexOf(urls[i]) === -1) {
        newURLs.push(urls[i]);
    }
    else {
        duplicates.push(urls[i]);
    }
}

console.log("Duplicates in list: " + duplicates.length);
console.log(duplicates);

console.log('Writing ' + newURLs.length + ' URLs out of received ' + urls.length + ' (removed ' + (urls.length-newURLs.length) + ')');

fs.writeFileSync('nonduplicatesytplaylist.txt', newURLs.join('\n'), console.error);