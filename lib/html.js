const cheerio = require('cheerio');
const path = require('path');
// const FACE = require('../input/face.json') ;
const FACE = [];
const { faceWebPublicDir } = require('../config');

exports.htmlToText = function (html) {
    const $ = cheerio.load(html, { decodeEntities: false });
    $('img').replaceWith((i, elm) => {
        const { alt } = elm.attribs;
        return `<span>${alt ? `[${alt}]` : '[图]'}</span>`;
    });
    $('br').replaceWith((i, elm) => {
        return `<span>\n</span>`;
    });

    return $.text();
};

/**
 * @name: 弃用 在最后fix中统一处理表情
 * @description:
 * @param {*} elm
 * @return {*}
 */
exports.faceToAlt = function ($elm) {
    const $img = $elm.find('img');
    let lostImg = 0;
    $img.each((i, n) => {
        const { src } = n.attribs;
        const { name, base } = path.parse(src);
        const isFace = FACE.find(v => v.md5 == name);
        if (isFace) {
            n.attribs.alt = isFace.alt;
            n.attribs.src = `${faceWebPublicDir}/${base}`;
        } else if (/^\{[A-Za-z0-9]{8}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{12}\}\.dat$/.test(src)) {
            // {A26B54AB-AA8A-4c1c-882A-EF18CE9611ED}.dat 这样的格式表示图片文件丢失
            n.attribs.src = `lostImg_${lostImg}`;
            lostImg++;
        } else {
            // 这里是 既不是表情 又不是丢失图片,那么就应该是普通且存在的图片了 不需要处理.
        }
    });
};
