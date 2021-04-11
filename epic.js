const fs = require('fs');
let file = fs.readFileSync('myepicaccount.txt', 'utf-8', console.error)
file = file.replace(/[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}	/gi,"");
file = file.replace(/0\.00	Completado/gi,"");
file = file.replace(/	|\$|USD/gi,"");
fs.writeFile('epic.txt', file, console.error)
