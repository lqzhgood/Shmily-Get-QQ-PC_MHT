/*
 * @Descripttion:
 * @Author: lqzh
 * @Date: 2020-02-26 17:10:54
 * @LastEditTime: 2023-11-22 13:05:38
 */
const _ = require("lodash");
const path = require("path");
const fs = require("fs");
const config = require("../config");
const {
    CURR_NAME,
    NONE_NAME_REPLACE_KEY_LEFT,
    NONE_NAME_REPLACE_KEY_RIGHT,
} = require("./directionName");

function NodeNameArr($elms, arr = []) {
    try {
        // 如果长度都不一样肯定不一样
        if ($elms.length !== arr.length) return false;
        for (let i = 0; i < $elms.length; i++) {
            const $elm = $elms.eq(i);
            // 查看 nodeName 是否相同
            // console.log('1', 1);
            if (!is($elm, arr[i].nodeName)) return false;
            // 如果 为 any 则不再检测子元素
            // console.log('2', 2);
            if (arr[i].childNodes === "any") return true;
            // console.log('3', children($elm), arr[i].childNodes);
            // 递归检查子元素
            if (!NodeNameArr(children($elm), arr[i].childNodes)) return false;
            // console.log('4', 4);
        }
        return true;
    } catch (error) {
        // console.log('error', error);
        return false;
    }
}

function children($elm) {
    return $elm.contents().filter((i, v) => {
        return v.nodeType == 1 ? v : v.data.trim();
    });
}

function is($elm, nodeName) {
    const elm = $elm.get(0);
    // console.log(elm.nodeType, elm.tagName, elm.type, nodeName);
    if (elm.nodeType === 1) {
        if (elm.tagName.toLowerCase() !== nodeName) return false;
    } else if (elm.nodeType === 3) {
        if ("#" + elm.type !== nodeName) return false;
    }
    // console.log('true', true);
    return true;
}

const NAME_NOT_IN_CONFIG = [];

function directionHandle(name, style) {
    let direction;

    // 根据名称判断 方向
    // 有名字才匹配  name为空就不匹配
    if (name.trim() != "") {
        direction = Object.keys(config.direction.name).find((d) => {
            const names = config.direction.name[d];
            return names.some((n) => name.includes(n));
        });
        if (!direction){
            if (!NAME_NOT_IN_CONFIG.includes(name)){
                NAME_NOT_IN_CONFIG.push(name)
                fs.writeFileSync(
                    path.join(config.DIST_DIR_TEMP, "NAME_NOT_IN_CONFIG.json"),
                    JSON.stringify(_.union(NAME_NOT_IN_CONFIG), null, 4)
                );
            }

            console.warn("❌", `name 无匹配 |${name}|`);}
    }

    if (direction) return direction;

    // 根据样式判断 方向
    direction = Object.keys(config.direction.style).find((d) => {
        const s = config.direction.style[d];
        return style.toLowerCase().trim() === s.toLowerCase().trim();
    });
    if (direction) return direction;

    if (!direction) throw new Error("错误的消息");
    return null;
}

function getAllNames(arr) {
    const names = arr.reduce((pre, cV) => {
        pre.push(cV.senderName);
        pre.push(cV.receiverName);
        return pre;
    }, []);
    fs.writeFileSync(
        path.join(config.DIST_DIR_TEMP, "names.json"),
        JSON.stringify(_.union(names), null, 4)
    );
}

function fixDirectionName(arr, dk, rk) {
    arr.forEach((f) => {
        if (f.senderName === dk) {
            f.senderName = rk;
        }
        if (f.receiverName === dk) {
            f.receiverName = rk;
        }
    });
}

module.exports = {
    NodeNameArr,
    directionHandle,
    getAllNames,
    fixDirectionName,
};
