import fs from 'fs';
let file = fs.readFileSync('urls.txt', 'utf-8', console.error).replace(/https:\/\/youtu.be\//gi,"");

fs.writeFile('urls2.txt', file, console.error)
