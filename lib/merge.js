const path = require('path');
const _ = require('lodash');
const fs = require('fs');
const dayjs = require('dayjs');

const mainDir = path.join(__dirname, 'dist');
const list = [2, 3];

// let count = 0;

// const fArr = list.reduce((pre, cV) => {
//     const json = require(path.join(mainDir, `./${cV}.json`));
//     count += json.length;
//     console.log(`${cV}.json`, json.length);
//     return pre.concat(json);
// }, []).map(v => {
//     v.ms = dayjs(`${v.day} ${v.time}`).valueOf();
//     return v;
// });
// console.log('count, ArrLength, count - ArrLength', count, fArr.length, count - fArr.length);

// fs.writeFileSync(path.join(mainDir, './fin.json'), JSON.stringify(fArr, null, 4));

const a1 = require(path.join(mainDir, `./3.json`)).map((v, i) => {
    v.index = i;
    return v;
});
const a2 = require(path.join(mainDir, `./7.json`)).map((v, i) => {
    v.index = i;
    return v;
});
console.log('a1.length', a1.length);
console.log('a2.length', a2.length);



const a = _.unionBy(a1, a2, v => {
    return `
        ${v.index}
        ${v.content}
        ${v.direction}
        ${v.day}
        ${v.time}
        ${v.ms}
    `;
}).map(v => {
    delete v.index;
    return v;
});
fs.writeFileSync(path.join(mainDir, './a.json'), JSON.stringify(a, null, 4));
console.log('a.length', a.length);


// const b = _.uniqWith(a1, _.isEqual);


// // const b = _([].concat(a1))
// //     // .sortBy(['ms'])
// //     .unionBy(v => {
// //         return `
// //         ${v.day}
// //         ${v.time}
// //         ${v.source}
// //         ${v.content}
// //         ${v.direction}
// //         ${v.name}
// //     `;
// //     })
// //     .value();

// fs.writeFileSync(path.join(mainDir, './b.json'), JSON.stringify(b, null, 4));
// console.log('b,b.length', b.length);

// console.log('重复数量', count, b.length, count - b.length);

// const c = _.pullAllBy(a1, b, v => `
//         ${v.day}
//         ${v.time}
//         ${v.source}
//         ${v.content}
//         ${v.direction}
//         ${v.name}
//     `);


// console.log('c.length', c.length, c);


setTimeout(() => {

}, 1000000);