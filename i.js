import fs from 'fs';
import colors from 'colors';

let fetchFolder = './files';

fs.readdirSync(fetchFolder).forEach(file => {
    if (!file.endsWith('.mp3')) return;
    let newfile = file
    .replace(/\[{0,1}[0-9]{0,3}K[0-9]{0,1}\]{0,1}__\[{0,1}.*\]{0,1}\.mp3$/g, '')
    .replace(/[^A-Za-z0-9_\,\-\sÁÉÍÓÚÑÜáéíóúñü\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f\u0430-\u044f]/gi, '')
    .replace(/  /gi, ' ')
    .replace(/mp3/gi, '')
    .replace(/ +$/, '')
    .replace(/^ +/, '')
    + '.mp3';
    if (file === newfile) { console.log(("No changes in " + file).gray); return; }
    if (newfile.replace(/\.mp3/gi, '').length < 2) { console.log(("No changes in " + file + " because new name is suspiciously short (" + newfile + ")").red); return; }
    fs.rename(fetchFolder + '/' + file, fetchFolder + '/' + newfile, () => { console.log(("(===) " + newfile).green); });
});