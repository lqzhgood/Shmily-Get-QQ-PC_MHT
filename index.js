/*
 * @Description:
 * @Author: lqzh
 * @Date: 2020-02-28 10:52:24
 * @LastEditTime: 2023-01-31 17:01:35
 */
const cheerio = require('cheerio');
const fs = require('fs');
const dayjs = require('dayjs');

const config = require('./config');
const type = require('./lib/type');
const { checkJSON } = require('./lib/check');
const mhtToHtml = require('./lib/mht');
const { getAllNames, fixDirectionName } = require('./lib/utils');
const { CURR_NAME, NONE_NAME_REPLACE_KEY_LEFT, NONE_NAME_REPLACE_KEY_RIGHT } = require('./lib/directionName');
const { fixImgExt } = require('./lib/fixImgExt');

if (!fs.existsSync('./dist')) {
    fs.mkdirSync('./dist');
}

(async () => {
    mhtToHtml();

    const html = fs.readFileSync('./dist/text0.html');
    console.info('reading');
    const $ = cheerio.load(html, { decodeEntities: false });
    console.info('loading');

    const dataArr = [];

    const $trs = $('table tr');

    // 匹配到名字后只需要回写一次之前的
    let firstMatchName = {
        left: false,
        right: false,
    };

    let day = '';
    for (let i = 0; i < $trs.length; i++) {
        // if (i >= 10) break;
        const $tr = $trs.eq(i);

        const data = type($tr, i, $trs);
        if (data[0] === 'day') {
            day = data[1].content;
            continue;
        }
        switch (data[0]) {
            case 'msg':
                data[1].day = dayjs(day).format('YYYY-MM-DD');
                data[1].ms = dayjs(`${data[1].day} ${data[1].time}`).valueOf();
                dataArr.push(data[1]);

                // 如果从 mht 中匹配到名字了 就把之前消息的名字回填
                if (!firstMatchName.left && CURR_NAME.LEFT !== NONE_NAME_REPLACE_KEY_LEFT) {
                    fixDirectionName(dataArr, NONE_NAME_REPLACE_KEY_LEFT, CURR_NAME.LEFT);
                    firstMatchName.left = true;
                }
                if (!firstMatchName.right && CURR_NAME.RIGHT !== NONE_NAME_REPLACE_KEY_RIGHT) {
                    fixDirectionName(dataArr, NONE_NAME_REPLACE_KEY_RIGHT, CURR_NAME.RIGHT);
                    firstMatchName.right = true;
                }

                break;
            default:
                console.warn(i, data[0], $tr.html());
        }
    }

    // 如果名字都没有匹配到， 例如全部是空  那么使用 config 中的默认名字
    if (CURR_NAME.LEFT === NONE_NAME_REPLACE_KEY_LEFT) {
        console.warn('❌', '没有匹配到 left name');
        fixDirectionName(dataArr, NONE_NAME_REPLACE_KEY_LEFT, config.leftName);
    }
    if (CURR_NAME.RIGHT === NONE_NAME_REPLACE_KEY_RIGHT) {
        console.warn('❌', '没有匹配到 right name');
        fixDirectionName(dataArr, NONE_NAME_REPLACE_KEY_RIGHT, config.rightName);
    }

    checkJSON(dataArr);
    getAllNames(dataArr);
    console.log('dataArr.length', dataArr.length);
    const dataText = await fixImgExt(dataArr);

    fs.writeFileSync(`./dist/msg-qq-pc-mht.json`, dataText);
    console.info('ok');
})();
