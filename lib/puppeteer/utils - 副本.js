/*
 * @Descripttion:
 * @Author: lqzh
 * @Date: 2020-02-26 17:10:54
 * @LastEditTime: 2020-02-27 22:26:58
 */



async function NodeNameArr(elms, arr = []) {
    try {
        if (elms.length !== arr.length) return false;
        for (let i = 0; i < elms.length; i++) {
            const elm = elms[i];
            const elmNodeName = await GetProperty(elm, 'nodeName');
            console.log('elmNodeName', elmNodeName.toLowerCase());
            if (elmNodeName.toLowerCase() !== arr[i].nodeName) return false;
            if (arr[i].childNodes === 'any') return true;
            const childNodes = await GetProperty(elm, 'childNodes');
            if (!await NodeNameArr(childNodes, arr[i].childNodes)) return false;
        }
        return true;
    } catch (error) {
        return false;
    }
}


async function GetProperty(element, property) {
    const data = await (await element.getProperty(property)).jsonValue();
    return data;
}




module.exports = {
    NodeNameArr,
    GetProperty,
};
