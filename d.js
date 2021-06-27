const robot = require("robotjs");
const fs = require('fs');
const clipboardy = require('clipboardy');
let file = fs.readFileSync('urls.txt', 'utf-8', console.error).replace(/youtu.be\//gi, "youtube.com/watch?v=").split('\n');
robot.setMouseDelay(200);
for (i=0; file.length > i; i++) {
  robot.moveMouse(92, 75);
  robot.mouseClick();
  robot.keyTap("a", "control"); robot.keyTap("delete");
  clipboardy.writeSync(file[i]);
  robot.keyTap("v", "control");
  if (robot.getMousePos().y !== 75) return;
  robot.moveMouse(1882, 78);
  robot.mouseClick();
  if (robot.getMousePos().y !== 78) return;
  robot.moveMouse(971, 523);
  if (robot.getPixelColor(971, 523) == '0dd5d8') { robot.mouseClick(); }
}
