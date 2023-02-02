# 说明

请先阅读 https://github.com/lqzhgood/Shmily

此工具是将 QQ 电脑版导出的 `.mht` 聊天记录 转换为 `Shmily-Msg` 格式的工具

处理由 `mht2html-master` 分割图片后的 html 文件，转换为 JSON。

## 使用

!!! 每次运行会删除 `.\dist` 和 `.\mht\output` 文件夹 !!! <br />

0. 安装 node 环境 [http://lqzhgood.github.io/Shmily/guide/setup-runtime/nodejs.html]
1. 导出的 `.mht` 文件放入 `input`

    - [PC_Clipboard](https://github.com/lqzhgood/Shmily-Get-QQ-PC_Clipboard) 得到的 face.json 放入 input 中 `./input/face.json`

2. 修改 `config.js`
3. 执行 `npm run msg`
4. `dist` 获取 数据文件 和 资源文件
5. 通过 https://github.com/lqzhgood/Shmily-Get-QQ-PC_utils 修复一些问题

## ！丢失消息！ 以下类型 QQ 聊天窗不显示 就无法复制

一些类型可以在 `can't get type` 查看示例

```
- 本地图片不存在的不会显示。(空图片占位)
- 视频不会显示
- 发送过去的文件消息不会显示(对方接收信息会显示)
- 自己接收的文件消息不会显示
- 语音不会显示

```

## 原理

QQ 导出 mht 中包含了图片等资源的 base64, 会使用 `.\lib\mht.js` 分离 html 和 图片文件到 `.\dist` <br />
其中图片资源文件会以 md5 名字命名，通过使用 RichTextCopy 得到的 face.json 可以通过 md5 得到图片的 alt 属性并写入每条 msg 的 html 中 <br />

## 合并

`./lib/merge.js` 没用，因为得不到精确 ID，所以只能手动合并

> 每次导出的 html 不一致

由于 MHT 每次生成的图片名称如 `{790EA64E-D540-4eb0-81C6-053C2098CC0E}.dat` 是随机数，因此 msg 的 html 并不能一模一样，因此需要通过规则过滤。

规则 --> 不重要的文本 ---> 正则 `\{.{8}-.{4}-.{4}-.{4}-.{12}\}\.dat`

## 注意

### Bug

有些解析不对,例如

```
[QQ经典-抠鼻]? 这个 ? 代表这个表情解析错误， ? 应该是某个无法解析的半字符
// [QQ经典-抠鼻]? ->  [QQ经典-可怜]  //id msg-qq_s60.json_2011-09-16_11-00-20_53e5b5_1


[QQ经典-抠鼻]縅 这个 縅 代表这个表情解析错误， 这里有两个表情, 后面的表情因为前面表情的半个字符没有解析出来 变成了 縅
// |[QQ经典-抠鼻]縅  | -> [QQ经典-委屈][QQ经典-大哭] //msg-qq-pc.json_2011-11-02_01-03-04_0a2d4a_1

// |[QQ经典-抠鼻]坎灰?不好吃  | -> |[QQ经典-委屈] 不要
不好吃| // msg-qq_s60.json_2011-11-18_15-43-24_1df2a6_1


'。?' -> '～'
同理

```

这应该是腾讯的 bug，因为从 QQ 的消息管理器里面看到的就是错误的（[QQ 经典-抠鼻]?）

在我消息历史里面这个 bug 的时间跨度是 `2011-08-15 16:58:38` -> `2011-11-28 10:53:48`
