# 说明

请先阅读 https://github.com/lqzhgood/Shmily

此工具是将 QQ 电脑版导出的 `.mht` 聊天记录 转换为 `Shmily-Msg` 格式的工具

处理由 `mht2html-master` 分割图片后的 html 文件，转换为 JSON。

## 使用

!!! 每次运行会清空上一次的输出文件夹 ( `.\dist` 和 `.\mht\output` ) !!! <br />

0. 安装 node 环境 [http://lqzhgood.github.io/Shmily/guide/setup-runtime/nodejs.html]
1. 安装 php 环境 [http://lqzhgood.github.io/Shmily/guide/setup-runtime/php.html]
2. 导出的 `.mht` 文件放入 `input`

    - (可选) 从 [PC_Clipboard](https://github.com/lqzhgood/Shmily-Get-QQ-PC_Clipboard) 更新 [face.json](https://raw.githubusercontent.com/lqzhgood/Shmily-Get-QQ-PC_Clipboard/main/temp/face.json) 放入 input 中 `./input/face.json`

        > QQ 导出 mht 中包含了图片等资源的 base64, 会使用 `.\lib\mht.js` 分离 html 和 图片文件到 `.\dist` <br /> 其中图片资源文件会以 md5 名字命名
        >
        > [PC_Clipboard](https://github.com/lqzhgood/Shmily-Get-QQ-PC_Clipboard) 的 [face.json](https://raw.githubusercontent.com/lqzhgood/Shmily-Get-QQ-PC_Clipboard/main/temp/face.json) 中包含 MD5 和 表情描述的映射, 通过这个映射表会填充 mht 用到表情的描述用于统计 <br />

3. 修改 `config.js`

    ```
    // 用于从 mht 匹配
    direction.name.go 填写 自己 用过的昵称
    direction.name.come 填写 对方 用过的昵称

    // 用于在 Shmily 显示
    rightNum 自己的 QQ 号码
    rightName 自己的昵称
    leftNum 对方的 QQ 号码
    leftName 对方的昵称
    ```

4. 执行 `npm run build`
5. 复制 `merger` 里的文件到 `\dist\data\`
6. `dist` 获取 数据文件 和 资源文件
7. (可选) 通过 [Shmily-Get-QQ-PC_utils](https://github.com/lqzhgood/Shmily-Get-QQ-PC_utils) 修复一些问题

## 注意

### ！丢失消息！

以下类型不会出现在 QQ 导出的 MHT 文件中, 所以无法获取

> 一些类型的示例可以在 `can't get type` 中查看

```
- 本地图片不存在的不会显示。(空图片占位)
- 视频不会显示
- 发送过去的文件消息不会显示(对方接收信息会显示)
- 自己接收的文件消息不会显示
- 语音不会显示

```

### 消息乱码不正确

有些内容解析出来不正确,会乱码, 如下 (第二行 // 为个人推测的正确结果)

```
[QQ经典-抠鼻]? 这个 ? 代表这个表情解析错误， ? 应该是某个无法解析的半字符
// [QQ经典-抠鼻]? ->  [QQ经典-可怜]  //id msg-qq_s60.json_2011-09-16_11-00-20_53e5b5_1


[QQ 经典-抠鼻]縅 这个 縅 代表这个表情解析错误， 这里有两个表情, 后面的表情因为前面表情的半个字符没有解析出来 变成了 縅
// |[QQ 经典-抠鼻]縅   | -> [QQ 经典-委屈][QQ经典-大哭] //msg-qq-pc.json_2011-11-02_01-03-04_0a2d4a_1


// |[QQ 经典-抠鼻]坎灰?不好吃   | -> |[QQ 经典-委屈] 不要
不好吃| // msg-qq_s60.json_2011-11-18_15-43-24_1df2a6_1


'。?' -> '～'

```

这应该是腾讯的 bug，因为从 QQ 的消息管理器里面看到的就是错误的（[QQ 经典-抠鼻]?）

在我消息历史里面这个 bug 的时间跨度是 `2011-08-15 16:58:38` -> `2011-11-28 10:53:48`

可以通过 [Shmily-Get-QQ-PC_utils](https://github.com/lqzhgood/Shmily-Get-QQ-PC_utils) 去修复这些问题

## 对多个 MHT 合并去重

可能你原来在多个时段备份了 .mht 的文件, 现在想合并这些 .mht 文件并去重.

我的结论是你只能通过 `Beyond Compare` 等类似的软件手动合并去重了. 原因和可能出现的问题如下

#### 合并多个有时间重叠的 MHT

因为 MHT 导出的消息只有内容和时间( YYYY-MM-DD HH:mm:ss) , 这两项的精度都不足以保证此条消息的唯一, 因此无法生成精确 ID 用于合并去重多个 MHT 的内容，所以只能手动合并.

做过一些尝试, 代码在 `./lib/merge.js`, 因为以上原因废弃

#### 无法通过 `Beyond Compare` 进行文本对比, 因为每次导出的 html 不一致

由于 QQ 的 MHT 导出每次生成的图片名称如 `{790EA64E-D540-4eb0-81C6-053C2098CC0E}.dat` 是随机数，因此 msg 的 html 并不能一模一样，如果需要对比两个 MHT 是否内容一致, 可以过滤掉图片名称后再进行比较.

规则 --> 不重要的文本 ---> 正则 `\{.{8}-.{4}-.{4}-.{4}-.{12}\}\.dat`

## 感谢

http://lqzhgood.github.io/Shmily/guide/other/thanks.html

## 捐赠

点击链接 http://lqzhgood.github.io/Shmily/guide/other/donation.html 看世界上最可爱的动物
