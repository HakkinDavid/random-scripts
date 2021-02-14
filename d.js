const robot = require("robotjs");
const fs = require('fs');
const clipboardy = require('clipboardy');
const readkey = require('readkey');
const keyCommands = [
  { fn: (str, key) => key.name === 'esc', command: () => process.exit() },
];
readkey(keyCommands);
let file = fs.readFileSync('urls.txt', 'utf-8', console.error).replace(/youtu.be\//gi, "youtube.com/watch?v=").split('\n');
robot.setMouseDelay(200);
for (i=0; file.length > i; i++) {
  robot.moveMouse(92, 75);
  robot.mouseClick();
  clipboardy.writeSync(file[i]);
  robot.keyTap("v", "control");
  robot.moveMouse(1882, 78);
  robot.mouseClick();
}
