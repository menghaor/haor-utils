/**
 * 存储数据
 * @param {String, Object} key 字段名 
 * @param value 字段值 
 * @return void
 */
export const setStore = (key = "", value) => {
    if (!key) return;
    if (!key instanceof Object) return localStorage.setItem(key, value);
    Object.keys(key).forEach(dataKey => {
        let dataValue = typeof key[dataKey] === 'object' ? JSON.stringify(key[dataKey]) : key[dataKey];
        localStorage.setItem(dataKey, dataValue);
    });
}

/**
 * 获取数据
 * @param {String, Array} key 键名
 * @return {String, Object}
 */
export const getStore = (key = "") => {
    if (typeof key === 'string') return localStorage.getItem(key);
    let dataRes = {};
    key.forEach(dataKey => {
        dataRes[dataKey] = localStorage.getItem(dataKey) || null;
    });
    return dataRes;
}

/**
 * 删除数据
 * @param {String, Array} key 键名
 * @return void
 */
export const deleteStore = (key = "") => {
    let removeKeys = [...key];
    removeKeys.forEach(dataKey => {
        localStorage.removeItem(dataKey);
    });
}

/**
 * 清空Store
 * @return void
 */
export const clearStore = () => {
    localStorage.clear();
}


/**
 * 通过key找到在列表中对应的显示
 * @param {Object} obj
 *  @param obj.dataList 数据列表
 *  @param obj.value    数据的值对应的字段名称   例如 'value'
 *  @param obj.label    数据的说明对应的字段名称 例如 'label'
 *  @param obj.data     当前传入的数据值
 * @return name        返回当前传入值在数组中对应的名字
 */
export const getDataName = obj => {
    let name = obj.data;
    if (Array.isArray(obj.dataList) && obj.dataList.length > 0) {
        for (let i = 0; i < obj.dataList.length; i++) {
            if (obj.dataList[i][obj.value] === obj.data) {
                name = obj.dataList[i][obj.label];
            }
        }
    }
    return name;
}

/**
 * json对象转FormData
 * @param obj
 * @returns {*}
 */
export const jsonToFormData = (obj, oldFormData) => {
    let formData = oldFormData || new FormData();
    if (obj) {
        for (let k in obj) {
            formData.append(k, obj[k]);
        }
    }
    return formData;
}

/**
 * 移除对象中的空字符串
 * @param test
 * @param recurse
 */
export const deleteEmptyString = (test, recurse) => {
    for (let i in test) {
        if (test[i] === '') {
            delete test[i];
        } else if (recurse && typeof test[i] === 'object') {
            deleteEmptyString(test[i], recurse);
        }
    }
}

/**
 * 删除对象中的空Key
 * @param test
 * @param recurse
 */
export const deleteEmptyObject = (test, recurse) => {
    for (let i in test) {
        if (test[i] === undefined || test[i] === null || test[i] === '') {
            delete test[i];
        } else if (recurse && typeof test[i] === 'object') {
            deleteEmptyObject(test[i], recurse);
        }
    }
}

/**
 * 移除对象中的无效属性
 * @param obj
 * @return {*}
 */
export const removeEmpty = obj => {
    Object.keys(obj).forEach(function (key) {
        (obj[key] &&
            typeof obj[key] === 'object' &&
            removeEmpty(obj[key])) ||
        ((obj[key] === undefined || obj[key] === null || obj[key] === '') &&
            delete obj[key]);
    });
    return obj;
}

/**
 * 深度拷贝
 * @param {*} obj
 */
export const deepCloneObject = obj => {
    let objClone = Array.isArray(obj) ? [] : {};
    if (obj && typeof obj === 'object') {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                //判断ojb子元素是否为对象，如果是，递归复制
                if (obj[key] && typeof obj[key] === 'object') {
                    objClone[key] = deepCloneObject(obj[key]);
                } else {
                    //如果不是，简单复制
                    objClone[key] = obj[key];
                }
            }
        }
    }
    return objClone;
}

/**
 * 获取页面参数
 * @param key 参数名称,不传则返回全部参数
 */
export const getQueryParam = key => {
    let paramValue = '';
    let hash = window.location.hash;
    let paramStr = hash ? (hash.indexOf('?') ? hash.split('?')[1] : '') : '';
    let paramObj = {}; //参数对象
    if (paramStr) {
        paramStr.split('&').forEach(param => {
            let arr = param.split('=');
            let paramKey = arr[0];
            let value = decodeURIComponent(arr[1]);
            paramObj[paramKey] = value;
            if (key && key === paramKey) {
                paramValue = value;
            }
        });
    }

    if (key) return paramValue;
    return paramObj;
}

/**
 * json参数转为query
 * @param Object paramObj  
 * @return String user=1&sex=0
 */
export const paramToQS = paramObj => {
    if (!(paramObj instanceof Object)) return '';
    return Object.keys(paramObj)
        .map(parkey => `${parkey}=${encodeURIComponent(paramObj[parkey])}`)
        .join('&');
}

/**
 * 线性数据转化为树
 * @param {Object} data 源数据
 * @param {Object} parentKey 父级id key
 * @param {childrenKey} childrenKey 子集key
 * @param {Object} pId 父级标识符
 */
export const toTree = (data, parentKey, childrenKey, pId) => {
    let tree = [];
    let temp = null;
    for (let i = 0; i < data.length; i++) {
        if (data[i][parentKey] === pId) {
            let obj = data[i];
            temp = toTree(data, parentKey, childrenKey, data[i][childrenKey]);
            if (temp.length > 0) {
                obj.children = temp;
            }
            tree.push(obj);
        }
    }
    return tree;
}

/**
 * 转换Key
 * @param obj
 * @param keyMap 
 * @param isDeep Boolean 是否深度
 * @return Object/Array
 */
export const convertKey = (obj, keyMap, isDeep) => {
    if (!['[object Array]', '[object Object]'].includes(Object.prototype.toString.call(obj))) {
        throw new TypeError('The first argument should be either an object or an array！');
    }
    if (Object.prototype.toString.call(keyMap) !== '[object Object]') {
        throw new TypeError('The parameter keyMap should be an object!');
    }
    let res = obj instanceof Array ? [] : {};
    if (obj instanceof Object) {
        for (let key in obj) {
            let newKey = Object.keys(keyMap).includes(key) ? keyMap[key] : key;
            res[newKey] = obj[key];

            //是否为深度转换
            if (isDeep && obj[key] instanceof Object && Object.keys(obj[key]).length) {
                res[newKey] = convertKey(obj[key], keyMap, isDeep);
            }
        }
    }
    return res;
}

/**
 * 设置tree层级信息
 * @param {Object} data
 * @param {Object} maxLevel 最多层级
 * @param {Object} currLevel 当前层级，可不传
 */
export const setTreeHierarchyIndex = function (data, maxLevel=10, currLevel) {
    if (!(data instanceof Array)) throw new TypeError('The data should be an array!');
    let result = [];
    for (let k = 0; k < data.length; k++) {
        // console.log('当前层级：', currLevel);
        // console.log('是否在指定层级范围：', currLevel < maxLevel);
        let temp = data[k];
        let newNode = {
            ...temp,
            hierarchyIndex: currLevel + 1,
            children: null
        };
        delete newNode.children;
        //是否在指定层级范围
        if (currLevel >= maxLevel) continue;
        if (temp.children && temp.children.length > 0) {
            currLevel++
            newNode.children = setTreeHierarchyIndex(temp.children, maxLevel, currLevel);
            currLevel--
        }
        result.push(newNode);
    }
    return result;
}

/**
 * 复制数据
 * @param {type}  data
 * @param {type}  count
 * @return {type}
 */
export const copyData = (data, count = 5) => new Array(count).fill(data);


/**
 * 格式化金钱，每千分位加逗号
 * @param str 
 */
export const formatMoney = (str = "") => {
    if (str === "") return "";
    str = str.toString();
    let s = '';
    let count = 0;
    for (let i = str.length - 1; i >= 0; i--) {
        s = str[i] + s
        count++
        if (count % 3 == 0 && i != 0) s = ',' + s;
    }
    return s
}