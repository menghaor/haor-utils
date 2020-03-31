/**
 * 类型检测
 * @param data 检测值
 * @reutn string/number/object...
 */
export const getType = data => {
    return Object.prototype.toString
        .call(data)
        .split(" ")[1]
        .slice(0, -1)
        .toLowerCase();
}

/**
 * 检测是否为空
 * @param any data
 * @return Boolean
 */
export const isEmpty = (data = null) => {
    //base type
    if (data === undefined || data === null || data === "") return true;
    if (typeof data === "boolean") return false;
    if (typeof data === "number") return !data;
    if (data instanceof Error) return data.message === "";

    //reference type
    switch (Object.prototype.toString.call(data)) {
        case "[object String]":
        case "[object Array]":
            return !data.length;
        case "[object File]":
        case "[object Map]":
        case "[object Set]":
            return !data.size;
        case "[object Object]":
            return !Object.keys(data).length;
        default:
            return false;
    }
}

/**
 * 倒计时-常用于短信验证码倒计时
 * @param totalTime 总时间
 * @param speed  速度
 * @param runFun 每次运行调用函数
 * @return Object
 */
export const countDown = ({
    totalTime = 60,
    speed = 1000,
    runFun
}) => {
    let STATE = "start"; //运行状态
    let currentTimer = totalTime;
    let timerFun = () => {
        currentTimer--;
        if (!currentTimer) {
            clearInterval(timer);
            STATE = "finish";
        }
        typeof runFun === "function" &&
            runFun(currentTimer, {
                state: STATE
            });
    };
    let timer = setInterval(timerFun, speed);

    //默认先执行一次
    typeof runFun === "function" &&
        runFun(currentTimer, {
            state: STATE
        });

    return {
        //暂停
        pause() {
            STATE = "pause";
            clearInterval(timer);
            typeof runFun === "function" &&
                runFun(currentTimer, {
                    state: STATE
                });
        },

        //重置
        reset() {
            state = "start";
            timer && clearInterval(timer);
            timer = setInterval(timerFun, speed);
        }
    };
}

/**
 * 函数只执行一次
 * @param context 执行上下文
 * @param fn
 * @return Function
 */
export const fnOnce = (context, fn) => {
    if (typeof fn !== "function")
        throw new Error("The second argument should be a function!");
    if (context && typeof context !== "object")
        throw new Error("The first parameter should be an object!");
    context = context || window;
    context.fn = fn;
    return function () {
        if (!context.fn) throw new Error("A function can only be called once!");
        let res = context.fn.apply(context, [...arguments]);
        delete context.fn;
        return res;
    };
}

/**
 * 防抖函数
 * @param fn
 * @param delay 延时
 */
export const debounce = function (fn, delay = 500) {
    if (typeof fn !== "function") {
        throw new Error("The first argument should be a function!");
    }
    if (!delay) throw new Error("The second parameter should be a number!");
    let timer = null;
    let contArgs = [...arguments].slice(2);
    return function () {
        let params = [...arguments, ...contArgs];
        if (timer) clearTimeout(timer);
        timer = setTimeout(fn.bind(this, {
            ...params
        }), delay);
    };
}

/**
 * 节流函数
 * @param fn
 * @param delay
 */
export const throttle = (...args) => {
    let [fn, delay = 500, ...res] = args;
    if (typeof fn !== "function")
        throw new Error("The first argument should be a function!");
    if (typeof delay !== "number")
        throw new Error("The second parameter should be a number!");
    let state = true; //运行状态
    let timer = null;
    let contArgs = [...res];
    return (...args) => {
        if (!state) return;
        state = false;
        let params = [...args, ...contArgs];
        timer = setTimeout(() => {
            fn.apply(this, {
                ...params
            });
            state = true;
            clearTimeout(timer);
        }, delay);
    };
}