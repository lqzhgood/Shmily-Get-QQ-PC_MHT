/**
 * @name: 这里用来处理  senderName 和 receiverName
 * @description: 顺序处理 mht 时可能前面没有名字, 因此需要在读取到名字后回写前面的名字
 * 其实这里写的过于复杂了 不过挺严谨的 不会发生的情况也可以涵盖了
 * @param {*}
 * @return {*}
 */

const NONE_NAME_REPLACE_KEY_LEFT = '{NONE_NAME_REPLACE_KEY_LEFT}';
const NONE_NAME_REPLACE_KEY_RIGHT = '{NONE_NAME_REPLACE_KEY_RIGHT}';

module.exports = {
    NONE_NAME_REPLACE_KEY_LEFT,
    NONE_NAME_REPLACE_KEY_RIGHT,
    CURR_NAME: {
        LEFT: NONE_NAME_REPLACE_KEY_LEFT,
        RIGHT: NONE_NAME_REPLACE_KEY_RIGHT,
    },
};
