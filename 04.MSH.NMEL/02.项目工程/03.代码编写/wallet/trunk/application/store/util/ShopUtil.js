export const ServerDomain = 'http://10.10.33.67';
// export const ServerDomain = 'http://10.10.33.173';
export const ServerUrl = ServerDomain + '/index.php';

export function getOrderStateTxt(orderState) {
    switch (orderState) {
    case '0':
        return '已取消';
    case '10':
        return '待付款';
    case '20':
        return '待发货';
    case '30':
        return '待收货';
    case '40':
        return '已完成';
    }
    return '';
}

/**
 * 小数精确计算-加法
 */
export function floatAdd(arg1, arg2) {
    var r1, r2, m;
    try {
        r1 = arg1.toString().split(".")[1].length;
    } catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    } catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    return (arg1 * m + arg2 * m) / m;
}

/**
 * 乘法函数，用来得到精确的乘法结果
 */
export function accMul(arg1, arg2) {
    var m = 0,
    s1 = arg1.toString(),
    s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length;
    } catch(e) {}
    try {
        m += s2.split(".")[1].length;
    } catch(e) {}
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}

/**
 * POST提交，对象参数转化
 */
export function toQueryString(obj) {
    return obj ? Object.keys(obj).sort().map(function(key) {
        var val = obj[key];
        if (Array.isArray(val)) {
            return val.sort().map(function(val2) {
                return encodeURIComponent(key) + '=' + encodeURIComponent(val2);
            }).join('&');
        }

        return encodeURIComponent(key) + '=' + encodeURIComponent(val);
    }).join('&') : '';
}

/**
 * 常用颜色
 *
 * LIGHTER_GRAY 背景颜色、分割线颜色
 */
export const Color = {
    RED: '#f54646',
    DARK_GRAY: '#494954',
    GRAY: '#9e9eae',
    LIGHT_GRAY: '#dcdce1',
    LIGHTER_GRAY: '#ecebea',
}

/**
 * 常用字体大小
 */
export const FontSize = {
    LARGE: 20,
    BASE: 14,
    SMALL: 9,
}

/**
 * 常用间隔距离
 *
 * TEXT 文本间隔
 * INSIDE 内侧间隔
 * OUTSIDE 外侧间隔
 * BOTTOM 底部间隔
 */
export const Space = {
    TEXT: 5,
    INSIDE: 10,
    OUTSIDE: 16,
    BOTTOM: 20,
}
