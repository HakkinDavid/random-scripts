import fs from 'fs';
import colors from 'colors';

let fetchFolder = './files';

fs.readdirSync(fetchFolder).forEach(file => {
    if (!file.includes('.mp3')) return;
    let newfile = file
    .replace(/\[[0-9]{0,3}K\]__\[.*\]\.[A-Za-z0-9]+$/g, '')
    .replace(/[^A-Za-z0-9_\.\,\!\¡\?\¿\-\sÁÉÍÓÚÑÜáéíóúñü]/g, '')
    .replace(/  /gi, ' ')
    .replace(/\.mp3/gi, '')
    + '.mp3';
    if (file === newfile) { console.log(("No changes in " + file).gray); return; }
    fs.rename(fetchFolder + '/' + file, fetchFolder + '/' + newfile, () => { console.log(("(===) " + newfile).green); });
});