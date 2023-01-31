/*
 * @Descripttion:
 * @Author: lqzh
 * @Date: 2020-02-25 16:14:19
 * @LastEditTime: 2020-02-28 10:48:16
 */
const express = require('express');
const puppeteer = require('puppeteer');

const type = require('./lib/type');

const app = express();
const port = 3000;

app.use(express.static('./output'));
app.listen(port, () => console.log(`listening on port ${port}!`));



const config = {
    // defaultViewport: {
    // width: 1000,
    // height: 1000,
    // },
};

if (process.env.NODE_ENV !== 'production') {
    Object.assign(config, {
        devtools: true,
        headless: false,
    });
}


(async () => {
    const browser = await puppeteer.launch(config);
    const page = await browser.newPage();
    page.on('console', msg => {
        if (msg._text.startsWith('Failed to load resource')) return;
        console.log('msg', msg._text);
    });
    await page.goto(`http://127.0.0.1:${port}/single.html`, {
        timeout: 0,
        waitUntil: 'domcontentloaded',
    });
    await page.exposeFunction('type', type);

    const result = await page.evaluate(() => {
        const trs = document.querySelectorAll("table tr");
        for (let i = 0; i < trs.length; i++) {
            if (i == 0) {
                const tr = trs[i];
                console.log('tr', tr);
                const data = type(tr, i, trs);
                console.log('data', data);
            }
        }
        return [];
    });
    console.log('result', result);

    console.log('over');
})();
