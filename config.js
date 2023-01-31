/*
 * @Description:
 * @Author: lqzh
 * @Date: 2020-02-28 15:47:38
 * @LastEditTime: 2023-01-31 16:04:58
 */
module.exports = {
    direction: {
        name: {
            go: ['昵称1', '昵称2', '昵称3'],
            come: ['昵称1', '昵称2', '昵称3'],
        },
        // 根据颜色 判断发送方向(粗略) 但是每节的第一条颜色是错的. 所以需要以上 name 进行精准判断
        style: {
            go: 'color:#42B475;padding-left:10px;', //right
            come: 'color:#006EFE;padding-left:10px;', // left
        },
    },

    // Name:
    // 每条消息只有发送人 , 那么第一条 msg 发送者 就不知道接收人的名字
    // 所以需要从后一条中匹配， 如果从后一条里面匹配到了 就回写之前未匹配的
    // 如果都没匹配到 才会用这里的 Name 。
    // Num 是一直会用的

    rightNum: '110',
    rightName: 'name~',

    leftNum: '119',
    leftName: ' name',

    imgWebPublicDir: './data/qq-pc/img',
    faceWebPublicDir: './data/qq-pc/face',
    fileWebPublicDir: './data/qq-pc/file',
};

// 385219308
