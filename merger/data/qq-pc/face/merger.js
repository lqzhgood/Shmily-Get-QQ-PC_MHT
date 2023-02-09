const fs = require('fs');
const path = require('path');

const JSON_FILE_NAME = '_faceArr.json';

const faceArr = [];

fs.readdirSync('./')
    .filter(d => fs.statSync(d).isDirectory())
    .forEach(d => {
        const jsonFile = fs.readFileSync(path.join(__dirname, `./${d}/${JSON_FILE_NAME}`));
        const json = JSON.parse(jsonFile);

        faceArr.push(...json);

        const num_dir = []
            .concat(
                fs.readdirSync(`./${d}/`).filter(f => f != JSON_FILE_NAME && f != 'alias' && f != '_temp'),
                fs.existsSync(`./${d}/alias/`) ? fs.readdirSync(`./${d}/alias/`) : [],
            )
            .reduce((pre, f) => {
                const { name } = path.parse(f);
                if (name != 'Thumbs') pre.push(name);
                return pre;
            }, []);

        let num_json = [];

        // 文件校验
        json.forEach(face => {
            num_json.push(...face.files);

            if (face.type !== d) console.log(`type 和目录不符 ${face.type} ${d}`);
            face.files.forEach(file => {
                const isExist = fs.existsSync(`./${d}/${file.md5}${file.ext}`);
                if (!isExist) console.warn('❌', '文件不存在', d, file);
                const { size } = fs.statSync(`./${d}/${file.md5}${file.ext}`);
                if (size != file.size) console.warn('❌', '文件大小不对', d, file);

                if (file.alias) {
                    num_json.push(...file.alias);
                    file.alias.forEach(file_alias => {
                        const isExistAlias = fs.existsSync(`./${d}/alias/${file_alias.md5}${file_alias.ext}`);
                        if (!isExistAlias) console.warn('❌', '文件不存在 alias', d, file_alias);
                        const { size: size_alias } = fs.statSync(`./${d}/alias/${file_alias.md5}${file_alias.ext}`);
                        if (size_alias != file_alias.size) console.warn('❌', '文件不存在 alias', d, file_alias);
                    });
                }
            });
        });
        num_json = num_json.map(f => f.md5);

        if (num_dir.filter(x => !num_json.includes(x)).length > 0)
            console.warn('❌', '图片文件多于 JSON', d, num_dir.length - num_json.length, num_dir, num_json);
        if (num_json.filter(x => !num_dir.includes(x)).length > 0)
            console.warn('❌', '图片文件多于 JSON', d, num_dir.length - num_json.length, num_dir, num_json);
    });

// 查看是否有重复的表情描述
faceArr.reduce((pre, f) => {
    const str = `${f.type}_&_${f.alt}`;
    if (!pre.includes(str)) {
        pre.push(str);
    } else {
        console.log('有重复的表情描述', str);
    }
    return pre;
}, []);

fs.writeFileSync('./emojiMapByQQ.json', JSON.stringify(faceArr, null, 4));

// 检查是否有重复的 MD5 文件

const md5Arr = faceArr
    .reduce((pre, cV) => {
        for (let i = 0; i < cV.files.length; i++) {
            const f = cV.files[i];
            pre.push(f.md5);
            if (f.alias) {
                for (let j = 0; j < f.alias.length; j++) {
                    const f_alias = f.alias[j];
                    pre.push(f_alias.md5);
                }
            }
        }

        return pre;
    }, [])
    .reduce((pre, md5) => {
        const f = pre.find(v => v.md5 === md5);
        if (!f) {
            pre.push({
                md5,
                count: 1,
            });
        } else {
            f.count++;
        }

        return pre;
    }, [])
    .filter(v => v.count >= 2);
console.log('重复的文件', md5Arr);
console.log("记得执行 \\tools\\checkModifyQQFace\index.js ,以更新 modify.json 中的表情图片");
console.log('ok');
