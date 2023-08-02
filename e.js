import robot from 'robotjs';
let pos = robot.getMousePos();
console.log('color #' + robot.getPixelColor(pos.x, pos.y) + ' at x:' + pos.x + ' y:' + pos.y);