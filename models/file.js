/**
 * 文件分片上传
 * @param file
 * @return Promise
 */
export const fileUploadByShard = ({
    file
}) => {
    return new Promise((resolve, reject) => {
        resolve();
    });
}

/**
 * 文件单位显示转换
 * @param bytes
 */
export const bytesToSize = (bytes = 0) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    let i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toPrecision(3) + " " + units[i];
}

/**
 * 文件下载
 * @param fileName 文件名称
 * @param content 文件流内容 || url
 * @param isStream 是否为流下载
 */
export const download = ({
    fileName,
    content
}) => {
    const blob = new Blob([content]);
    if ("download" in document.createElement("a")) {
        //非IE下载
        const elink = document.createElement("a");
        elink.download = fileName;
        elink.style.display = "none";
        elink.href = URL.createObjectURL(blob);
        elink.addEventListener("click", e => {
            e.stopImmediatePropagation();
        });
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); //释放URL 对象
        document.body.removeChild(elink);
    } else {
        //IE10+下载
        navigator.msSaveBlob(blob, fileName);
    }
}

/**
 * 获取base64
 * @returns Promise
 */
export const getBase64 = file => {
    return new Promise(resolve => {
        const fr = new FileReader();
        fr.onload = e => {
            resolve(e.target.result, e);
        };
        fr.readAsDataURL(file);
    });
}

/**
 * base64转Blob
 * @param {Promise} base64 
 */
export const base64ToBlob = (base64) => {
    let base64List = Array.isArray(base64) ? base64 : [base64];
    let promList = base64List.map(item => {
        return new Promise((resolve) => {
            let base64Arr = item.split(',');
            let imgtype = '';
            let base64String = '';
            if (base64Arr.length > 1) {
                //如果是图片base64，去掉头信息
                base64String = base64Arr[1];
                imgtype = base64Arr[0].substring(base64Arr[0].indexOf(':') + 1, base64Arr[0].indexOf(';'));
            }
            let bytes = atob(base64String);
            let bytesCode = new ArrayBuffer(bytes.length);
            let byteArray = new Uint8Array(bytesCode);

            //将base64转换为ascii码
            for (let i = 0; i < bytes.length; i++) {
                byteArray[i] = bytes.charCodeAt(i);
            }

            //生成Blob对象（文件对象）
            resolve(new Blob([bytesCode], {
                type: imgtype
            }));
        })
    })

    Promise.all(promList).then(res => Promise.resolve(res));
}

/**
 * 创建canvas
 * @param {Object} attrs 
 * @returns {Object}
 */
export const createCanvas = (attrs = {}) => {
    let canvas = document.createElement('canvas');
    Object.keys(attrs).forEach(key => {
        canvas.setAttribute(key, attrs[key]);
    });
    return canvas;
}

/**
 * 创建Img
 * @param src 图片地址
 * @param 
 */
export const createImg = (src) => {
    return new Promise(resolve => {
        let img = new Image();
        img.onload = () => {
            resolve(img);
        };
        img.setSrc = (url) => {
            img.src = url;
        }
        img.setSrc(src);
    });
}

/**
 * 图片压缩
 * @param {String/Array} src 图片地址
 * @param {Number} scale 压缩比例
 * @returns {Promise}
 */
export const imgCompress = (src, scale = 1) => {
    let imgList = Array.isArray(src) ? src : [src];
    let imgPromList = imgList.map(img => {
        return new Promise(async (resolve) => {
            let imgEl = {
                width,
                height
            } = await createImg(img);
            let comWidth = width * scale, //压缩后宽
                comHeight = height * scale; //压缩后高
            let canvas = createCanvas({
                width: comWidth,
                height: comHeight
            });
            let ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, comWidth, comHeight);
            ctx.drawImage(imgEl, 0, 0, comWidth, comHeight);
            resolve({
                ctx,
                data: canvas.toDataURL('image/jpeg', 1)
            });
        });
    });
    return Promise.all(imgPromList).then(res => Promise.resolve(res))
}