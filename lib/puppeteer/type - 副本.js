/*
 * @Descripttion:
 * @Author: lqzh
 * @Date: 2020-02-25 22:01:24
 * @LastEditTime: 2020-02-27 22:03:20
 */
const { NodeNameArr, GetProperty } = require('./utils');


async function infoRecordTitle(tr, i, trs) {
    try {
        const nodeTree = [{
            nodeName: 'tr',
            childNodes: [
                {
                    nodeName: 'div',
                    childNodes: [
                        { nodeName: 'br' },
                        { nodeName: 'b' },
                    ],
                },
            ],
        }];
        if (!await NodeNameArr([tr], nodeTree)) throw new Error('格式错误 nodeTree');
        if ((await GetProperty(tr, 'textContent')).trim() !== '消息记录') throw new Error('格式错误 content');
        return ['infoRecordTitle', { type: '消息记录', content: '' }];
    } catch (error) {
        return [false];
    }
}

async function infoGroup(tr) {
    try {
        const nodeTree = [{
            nodeName: 'tr',
            childNodes: [
                {
                    nodeName: 'td',
                    childNodes: [
                        { nodeName: 'div' },
                    ],
                },
            ],
        }];
        if (!await NodeNameArr([tr], nodeTree)) throw new Error('格式错误 nodeTree');
        const text = (await GetProperty(tr, 'textContent')).trim();
        if (!/^消息分组:/.test(text)) throw new Error('格式错误 content');
        return ['infoGroup', { type: '消息分组', content: text.replace(/^消息分组:/, '') }];
    } catch (error) {
        return [false];
    }
}

async function infoPeople(tr, i, trs) {
    try {
        const nodeTree = [{
            nodeName: 'tr',
            childNodes: [
                {
                    nodeName: 'td',
                    childNodes: [
                        { nodeName: 'div' },
                    ],
                },
            ],
        }];
        if (!await NodeNameArr([tr], nodeTree)) throw new Error('格式错误 nodeTree');
        if ((await infoGroup(trs[i - 1]))[0] !== 'infoGroup') throw new Error('格式错误 last Elm not Group');
        const text = (await GetProperty(tr, 'textContent')).trim();
        if (!/^消息对象:/.test(text)) throw new Error('格式错误 content');
        return ['infoPeople', { type: '消息对象', content: text.replace(/^消息对象:/, '') }];
    } catch (error) {
        return [false];
    }
}

async function emptyNode(tr, i, trs) {
    try {
        const nodeTree = [{
            nodeName: 'tr',
            childNodes: [
                {
                    nodeName: 'td',
                    childNodes: [
                        { nodeName: 'div' },
                    ],
                },
            ],
        }];
        if (!await NodeNameArr([tr], nodeTree)) throw new Error('格式错误 nodeTree');
        const text = (await GetProperty(tr, 'textContent')).trim();
        if (text !== '') throw new Error('格式错误 content');
        return ['emptyNode', { type: '空节点', content: '' }];
    } catch (error) {
        return [false];
    }
}

async function dayNode(tr, i, trs) {
    try {
        const nodeTree = [{
            nodeName: 'tr',
            childNodes: [
                { nodeName: 'td' },
            ],
        }];
        if (!await NodeNameArr([tr], nodeTree)) throw new Error('格式错误 nodeTree');

        const text = (await GetProperty(tr, 'textContent')).trim();
        if (!/^日期: \d{4}-\d{2}-\d{2}$/.test(text)) throw new Error('格式错误 content');
        return ['day', { type: '日期', content: text.match(/\d{4}-\d{2}-\d{2}/).toString() }];
    } catch (error) {
        return [false];
    }
}

async function msgNode(tr, i, trs) {
    try {
        const nodeTree = [{
            nodeName: 'tr',
            childNodes: [
                {
                    nodeName: 'td',
                    childNodes: [
                        {
                            nodeName: 'div',
                            childNodes: [
                                { nodeName: 'div' },
                                { nodeName: '#textx' },
                            ],
                        },
                        {
                            nodeName: 'div',
                            childNodes: 'any',
                        },
                    ],
                },
            ],
        }];
        if (!await NodeNameArr([tr], nodeTree)) throw new Error('格式错误 nodeTree');


        return ['msg', { type: '消息', content: '' }];
    } catch (error) {
        console.log('error', error);
        return [false];
    }
}

module.exports = async function (tr, i, trs) {
    let data = [false];
    // data = await infoRecordTitle(tr, i, trs);
    // if (data[0]) return data;
    // data = await infoGroup(tr, i, trs);
    // if (data[0]) return data;
    // data = await infoPeople(tr, i, trs);
    // if (data[0]) return data;
    // data = await emptyNode(tr, i, trs);
    // if (data[0]) return data;
    // data = await dayNode(tr, i, trs);
    // if (data[0]) return data;
    data = await msgNode(tr, i, trs);
    if (data[0]) return data;
    return [false, '错误的类型', tr];
};