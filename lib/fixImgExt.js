const fs = require("fs");
const path = require("path");
const FileType = require("file-type");
const { DIST_DIR, imgWebPublicDir } = require("../config.js");

async function fixImgExt(dataArr) {
    let dataText = JSON.stringify(dataArr, null, 4);

    // const imgPath = path.join(__dirname, '../dist/data/qq-pc/img/');
    const imgPath = path.join(DIST_DIR, imgWebPublicDir);

    const imgs = fs.readdirSync(imgPath);

    for (let i = 0; i < imgs.length; i++) {
        const n = imgs[i];
        const f = path.join(imgPath, n);
        const { name, ext } = path.parse(f);
        const { ext: ext_l } = (await FileType.fromFile(f)) || {};
        const rExt = `.${ext_l.toLowerCase()}`;

        if (ext === rExt) continue;

        const nn = `${name}${rExt}`;
        fs.renameSync(f, path.join(imgPath, nn));
        dataText = dataText.replaceAll(n, nn);
    }

    return dataText;
}

module.exports = {
    fixImgExt,
};
