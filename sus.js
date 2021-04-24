const fs = require('fs');
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const Sound = require('node-aplay');
let isAMOGUSREFERENCEed = fs.existsSync('./amogus.wav');
let sussound;
if (isAMOGUSREFERENCEed) {
  sussound = new Sound('./amogus.wav');
}
console.log("Input your crewmates list to find the imposter.\n");
let sus;
let find = /[^ඞ]{1}/gi;
let imposter;
rl.on('line', (input) => {
  sus = input;
  imposter = find.exec(sus);

  while (imposter) {
    let whereSus = sus.indexOf(imposter) + 1;
    console.log("When the imposter (" + imposter + ") is sus at character " + whereSus + ". AH! AMOGUS!");
    if (isAMOGUSREFERENCEed) {
      sussound.play();
    }
    imposter = find.exec(sus);
  }
})
