/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export const parseTime = function (time, cFormat) {
    if (arguments.length === 0) {
        return null;
    }
    const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
    let date;
    if (typeof time === "object") {
        date = time;
    } else {
        if (typeof time === "string" && /^[0-9]+$/.test(time)) {
            time = parseInt(time);
        }
        if (typeof time === "number" && time.toString().length === 10) {
            time = time * 1000;
        }
        date = new Date(time);
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    };
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key];
        // Note: getDay() returns 0 on Sunday
        if (key === "a") {
            return ["日", "一", "二", "三", "四", "五", "六"][value];
        }
        if (result.length > 0 && value < 10) {
            value = "0" + value;
        }
        return value || 0;
    });
    return time_str;
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export const formatTime = (time, option) => {
    if (("" + time).length === 10) {
        time = parseInt(time) * 1000;
    } else {
        time = +time;
    }
    const d = new Date(time);
    const now = Date.now();

    const diff = (now - d) / 1000;

    if (diff < 30) {
        return "刚刚";
    } else if (diff < 3600) {
        // less 1 hour
        return Math.ceil(diff / 60) + "分钟前";
    } else if (diff < 3600 * 24) {
        return Math.ceil(diff / 3600) + "小时前";
    } else if (diff < 3600 * 24 * 2) {
        return "1天前";
    }
    if (option) {
        return parseTime(time, option);
    } else {
        return (
            d.getMonth() +
            1 +
            "月" +
            d.getDate() +
            "日" +
            d.getHours() +
            "时" +
            d.getMinutes() +
            "分"
        );
    }
}

/**
 * 获取今天0点时间戳-秒
 * @return {number}
 */
export const getTodayTimeStamp = () =>
    new Date(new Date().setHours(0, 0, 0, 0)) / 1000;

/**
 * 获取当天0点时间戳-毫秒
 * @return {number}
 */
export const getTodayTimestamp = () => new Date().setHours(0, 0, 0, 0);

/**
 * 获取当天前x天的时间戳
 * @return
 */
export const getBeforeDay = day => new Date().setHours(0, 0, 0, 0) - 86400000 * day;

/**
 * 获取当天后x天的时间戳
 * @return
 */
export const getAfterDay = day => new Date().setHours(0, 0, 0, 0) + 86400000 * day;

/**
 * 毫秒转化成天时分秒的时间格式
 */
export const formatDuring = mss => {
    let days = parseInt(mss / (1000 * 60 * 60 * 24));
    let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = (mss % (1000 * 60)) / 1000;
    return (
        days + " 天 " + hours + " 小时 " + minutes + " 分钟 " + seconds + " 秒 "
    );
}

/**
 * 格式化星期
 * @param weekNubmer
 */
export const formatWeek = weekNubmer => {
    const weeks = ["日", "一", "二", "三", "四", "五", "六"];
    return weeks[weekNubmer] || "未知";
}