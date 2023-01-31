/*
 * @Description:
 * @Author: lqzh
 * @Date: 2020-02-25 22:01:24
 * @LastEditTime: 2022-04-03 19:22:06
 */
const path = require('path');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

const config = require('../config.js');
const { NodeNameArr, directionHandle } = require('./utils');
const { CURR_NAME } = require('./directionName');

const { faceToAlt, htmlToText } = require('./html');

function infoRecordTitle($tr) {
    try {
        const nodeTree = [
            {
                nodeName: 'tr',
                childNodes: [
                    {
                        nodeName: 'td',
                        childNodes: [
                            {
                                nodeName: 'div',
                                childNodes: [
                                    { nodeName: 'br' },
                                    { nodeName: 'b', childNodes: [{ nodeName: '#text' }] },
                                ],
                            },
                        ],
                    },
                ],
            },
        ];
        if (!NodeNameArr($tr, nodeTree)) throw new Error('格式错误 nodeTree');

        if ($tr.text().trim() !== '消息记录') throw new Error('格式错误 content');
        return ['infoRecordTitle', { type: '消息记录', content: '' }];
    } catch (error) {
        return [false];
    }
}

function infoGroup($tr) {
    try {
        const nodeTree = [
            {
                nodeName: 'tr',
                childNodes: [
                    {
                        nodeName: 'td',
                        childNodes: [{ nodeName: 'div', childNodes: [{ nodeName: '#text' }] }],
                    },
                ],
            },
        ];
        if (!NodeNameArr($tr, nodeTree)) throw new Error('格式错误 nodeTree');
        const text = $tr.text().trim();
        if (!/^消息分组:/.test(text)) throw new Error(`格式错误 content ${text}`);
        return ['infoGroup', { type: '消息分组', content: text.replace(/^消息分组:/, '') }];
    } catch (error) {
        return [false];
    }
}

function infoPeople($tr) {
    try {
        const nodeTree = [
            {
                nodeName: 'tr',
                childNodes: [
                    {
                        nodeName: 'td',
                        childNodes: [{ nodeName: 'div', childNodes: [{ nodeName: '#text' }] }],
                    },
                ],
            },
        ];
        if (!NodeNameArr($tr, nodeTree)) throw new Error('格式错误 nodeTree');
        if (infoGroup($tr.prev())[0] !== 'infoGroup') throw new Error('格式错误 last Elm not Group');

        const text = $tr.text().trim();
        if (!/^消息对象:/.test(text)) throw new Error('格式错误 content');
        return ['infoPeople', { type: '消息对象', content: text.replace(/^消息对象:/, '') }];
    } catch (error) {
        return [false];
    }
}

function emptyNode($tr) {
    try {
        const nodeTree = [
            {
                nodeName: 'tr',
                childNodes: [
                    {
                        nodeName: 'td',
                        childNodes: [{ nodeName: 'div' }],
                    },
                ],
            },
        ];
        if (!NodeNameArr($tr, nodeTree)) throw new Error('格式错误 nodeTree');

        const text = $tr.text().trim();
        if (text !== '') throw new Error('格式错误 content');
        return ['emptyNode', { type: '空节点', content: '' }];
    } catch (error) {
        return [false];
    }
}

function dayNode($tr) {
    try {
        const nodeTree = [
            {
                nodeName: 'tr',
                childNodes: [{ nodeName: 'td', childNodes: [{ nodeName: '#text' }] }],
            },
        ];
        if (!NodeNameArr($tr, nodeTree)) throw new Error('格式错误 nodeTree');

        const text = $tr.text().trim();
        if (!/^日期: \d{4}-\d{2}-\d{2}$/.test(text)) throw new Error('格式错误 content');
        return ['day', { type: '日期', content: text.match(/\d{4}-\d{2}-\d{2}/).toString() }];
    } catch (error) {
        return [false];
    }
}

function msgNode($tr) {
    try {
        const nodeTree = [
            {
                nodeName: 'tr',
                childNodes: [
                    {
                        nodeName: 'td',
                        childNodes: [
                            {
                                nodeName: 'div',
                                childNodes: [{ nodeName: 'div', childNodes: 'any' }, { nodeName: '#text' }],
                            },
                            {
                                nodeName: 'div',
                                childNodes: 'any',
                            },
                        ],
                    },
                ],
            },
        ];
        if (!NodeNameArr($tr, nodeTree)) throw new Error('格式错误 nodeTree');

        const $div = $tr.children('td').children('div');
        const $attr = $div.eq(0).contents();
        const name = $attr.eq(0).text();
        const time = $attr.eq(1).text();

        const directionStyle = $div.eq(0).attr('style');
        const direction = directionHandle(name, directionStyle);
        // 根据上一条信息拼接 发送和接收 方
        const send = {};
        const receive = {};
        if (direction === 'go') {
            CURR_NAME.RIGHT = name;

            send.sender = config.rightNum;
            send.senderName = CURR_NAME.RIGHT;

            receive.receiver = config.leftNum;
            receive.receiverName = CURR_NAME.LEFT;
        }

        if (direction === 'come') {
            CURR_NAME.LEFT = name;

            send.sender = config.leftNum;
            send.senderName = CURR_NAME.LEFT;

            receive.receiver = config.rightNum;
            receive.receiverName = CURR_NAME.RIGHT;
        }

        // html 最后处理 因为会改变 DOM

        // 必须放在第一行 这时候 text 还没处理，没有\n换行。
        const isFile = msgFileNode($div.eq(1));
        let type = '消息';
        if (isFile) type = '文件';

        // face --> alt
        faceToAlt($div.eq(1));
        const html = $div.eq(1).html();
        // alt --> span
        const content = htmlToText(html);

        if (isBusy(content)) type = '忙';

        // day 取全局的 每次dayNode会更新全局的day 组装 msg

        return [
            'msg',
            {
                source: 'QQ',
                device: 'PC',
                type,

                direction,

                ...send,
                ...receive,

                day: '',
                time: dayjs(time, 'HH:mm:ss').format('HH:mm:ss'),
                ms: '', //外部处理

                content,
                html,

                msAccuracy: false,
            },
        ];
    } catch (error) {
        console.log('error', error);
        return [false];
    }
}

function msgFileNode($dom) {
    //22:12:22成功接收离线文件“{2481ACAA-3B75-4434-F58D-2EA522D1989E}0.jpg”(16.00KB)  打开文件  打开所在文件夹
    const text = $dom.text();
    const reg = text.match(/\d{1,2}:\d{1,2}:\d{1,2}成功接收离线文件“(.+)”\(.+\)\s+打开文件\s+打开所在文件/);
    if (!reg) return false;
    const fileName = reg[1];
    const ext = path.extname(fileName);
    const filePath = `${config.fileWebPublicDir}/${fileName}`;

    const oHtml = $dom.html();

    // !!! 通过 fix 处理文件得到 $QQ.fileParse ,然后用前端显示,这样更灵活
    // * 为相关注释代码

    // 注意与 RichTextCopy 的 html 保持一致
    let nHtml = oHtml;
    // *  let nHtml = oHtml.replace('打开文件', `<a href='${filePath}' target='_blank' class='openFile'>打开文件</a>`);
    if (!ext) {
        console.warn(`无后缀名文件 ${fileName}`);
    } else if (['.jpg', '.jpeg', '.png', '.gif'].includes(ext.toLocaleLowerCase())) {
        // 放到前端处理 $QQ.fileParse
        // * nHtml += `<br/><img src='${filePath}' />`;
    } else {
        console.warn(`HTML 不做额外处理的后缀 |${ext}| - ${fileName}`);
    }
    $dom.html(nHtml);
    return true;
}

function isBusy(text) {
    return /我现在有事不在.{1}一会再和你联系/.test(text);
}

module.exports = function (tr, i, trs) {
    let data = [false];
    data = infoRecordTitle(tr, i, trs);
    if (data[0]) return data;
    data = infoGroup(tr, i, trs);
    if (data[0]) return data;
    data = infoPeople(tr, i, trs);
    if (data[0]) return data;
    data = emptyNode(tr, i, trs);
    if (data[0]) return data;
    data = dayNode(tr, i, trs);
    if (data[0]) return data;
    data = msgNode(tr, i, trs);
    if (data[0]) return data;
    return [false, '错误的类型', tr];
};
