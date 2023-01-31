/*
 * @Description:
 * @Author: lqzh
 * @Date: 2020-02-28 18:16:25
 * @LastEditTime: 2020-11-03 14:05:00
 */



exports.checkJSON = function (json) {
    for (let i = 0; i < json.length; i++) {
        const v = json[i];
        try {
            if (!v.day || !v.time) throw new Error('时间错误');
            if (!v.direction) throw new Error('聊天方向错误');
        } catch (error) {
            console.log('v', error.message, v);
            break;
        }
    }

    console.log('check ok', json.length);
};