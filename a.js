const fs = require('fs');
let file = fs.readFileSync('input.txt', 'utf-8', console.error).split('\n');
for (i=0; file.length > i; i++) {
  let index = file[i].search(': ') + 2;
  file[i] = file[i].substring(index);
}

fs.writeFile('output.txt', file.join("\n"), console.error)
