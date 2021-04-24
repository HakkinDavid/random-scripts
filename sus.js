const fs = require('fs');
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const Sound = require('node-aplay');
let isAMOGUSREFERENCEed = fs.existsSync('./amogus.wav');
console.log("Input your text to find the imposter.\n");
let sus;
let find = /ඞ{1}/g;
let imposter;
rl.on('line', (input) => {
  sus = input;
  imposter = find.exec(sus);
  let susARRAY = [];
  let i = 0;

  while (imposter) {
    let whereSus = imposter.index + 1;
    susARRAY.push({imposter:imposter,whereSus:whereSus})
    imposter = find.exec(sus);
    i++
  }
  if (isAMOGUSREFERENCEed) {
    let f = 0;
    let amogus = setInterval(function(){
      if (f == i) {
        clearInterval(amogus);
        return
      }
      console.log("When the imposter (" + susARRAY[f].imposter + ") is sus at character " + susARRAY[f].whereSus + ". AH! AMOGUS!");
      let sussound = new Sound('./amogus.wav');
      sussound.play();
      f++
      if (f != i) {
        setTimeout(function(){
          sussound.pause();
        }, 1000, sussound);
      }
    }, 500);
  }
})
