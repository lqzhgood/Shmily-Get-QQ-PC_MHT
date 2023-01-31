const fs = require('fs-extra');
const path = require('path');
const exec = require('child_process').execSync;

function mhtToHtml() {
    fs.removeSync(path.join(__dirname, '../mht/output'));
    fs.removeSync(path.join(__dirname, '../dist/'));

    const mhtFile = fs
        .readdirSync(path.join(__dirname, '../input/'))
        .filter(f => path.extname(f).toLocaleLowerCase() == '.mht');
    if (mhtFile.length != 1) throw new Error(`mht not only one ${mhtFile}`);

    const cmdStr = `php MhtToHtml.php "../input/${mhtFile[0]}"`;
    const options = {
        cwd: path.join(__dirname, '../mht/'),
    };
    const reMsg = exec(cmdStr, options).toString();
    console.log('reMsg', reMsg);

    fs.moveSync(path.join(__dirname, '../mht/output/'), path.join(__dirname, '../dist/'));
}

module.exports = mhtToHtml;
