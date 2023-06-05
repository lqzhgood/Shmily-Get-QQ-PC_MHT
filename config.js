/*
 * @Description:
 * @Author: lqzh
 * @Date: 2020-02-28 15:47:38
 * @LastEditTime: 2023-06-05 11:43:16
 */

const path = require("path");

const config = {
    direction: {
        name: {
            go: ["昵称1", "昵称2", "昵称3"],
            come: ["昵称1", "昵称2", "昵称3"],
        },
        // 根据颜色 判断发送方向(粗略) 但是每节的第一条颜色是错的. 所以需要以上 name 进行精准判断
        style: {
            go: "color:#42B475;padding-left:10px;", //right
            come: "color:#006EFE;padding-left:10px;", // left
        },
    },

    // Name:
    // 每条消息只有发送人 , 那么第一条 msg 发送者 就不知道接收人的名字
    // 所以需要从后一条中匹配， 如果从后一条里面匹配到了 就回写之前未匹配的
    // 如果都没匹配到 才会用这里的 Name 。
    // Num 是一直会用的

    rightNum: "110",
    rightName: "name~",

    leftNum: "119",
    leftName: " name",

    rootPath: "QQ-PC-MHT-12345678-20230101",

    DIST_DIR: path.join(__dirname, "./dist/"),
};

config.DIST_DIR_TEMP = path.join(config.DIST_DIR, "_temp");

config.imgWebPublicDir = `./data/${config.rootPath}/img`;
config.faceWebPublicDir = `./data/${config.rootPath}/face`;
config.fileWebPublicDir = `./data/${config.rootPath}/file`;

module.exports = config;
