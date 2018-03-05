'use strict';

import {
    Platform,
    Dimensions,
    PixelRatio,
    AsyncStorage,
} from 'react-native';

// import UserAction from './flux/UserAction';

//一次性获取设备属性
export let _os = Platform.OS;
export let _pixelRatio = PixelRatio.get();
export let _navBarHeight = Platform.OS === 'ios' ? 64 : 44;

// export let _logo = null;
// export let Config = null;

//后台服务地址
// export let _host 		= 'http://10.10.69.18/api/';
export let  _host       = 'http://110.76.186.47/api/';
export let  _host_store = 'http://110.76.186.47/store/';
// export let _iSEB_host 	= _os == 'ios' ? 'http://localhost:9000/' : 'http://10.12.253.5:9000/';
export let _hostTimeout = 5000;
export const _appId = '8a8c7db154ebe90c0154ebfdd1270005';

//需要登录后才能访问的component
export const _needLoginComp = [];

export let _ASK_USER = 'user';
export let _ASK_USER_BANKCARDS = 'bankcards';


//========================================================================


export const ServerDomain = 'http://110.76.186.47/store';
export const ServerUrl = ServerDomain + '/index.php';
export const PaymentKey = 'zhangzhaoyi';
export const NetInfoIsConnected = true;

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

/*export function setConfig (config) {
    //console.log(config);
    Config = config;

    _ASK_HOST           = '@AsyncStorage.' + Config._APP_ID + _ASK_HOST;
    _ASK_HOST_TIMEOUT   = '@AsyncStorage.' + Config._APP_ID + _ASK_HOST_TIMEOUT;
    _ASK_USER           = '@AsyncStorage.' + Config._APP_ID + _ASK_USER;
    _ASK_USER_BANKCARDS = '@AsyncStorage.' + Config._APP_ID + _ASK_USER_BANKCARDS;
    _ASK_USER_GESLISTS  = '@AsyncStorage.' + Config._APP_ID + _ASK_USER_GESLISTS;

    _ASK_USER_RANDOM    = '@AsyncStorage.' + Config._APP_ID + _ASK_USER_RANDOM;
    _ASK_USER_MODULUS1  = '@AsyncStorage.' + Config._APP_ID + _ASK_USER_MODULUS1;
    _ASK_USER_EXPONENT1 = '@AsyncStorage.' + Config._APP_ID + _ASK_USER_EXPONENT1;
    _ASK_USER_MODULUS2  = '@AsyncStorage.' + Config._APP_ID + _ASK_USER_MODULUS2;
    _ASK_USER_EXPONENT2 = '@AsyncStorage.' + Config._APP_ID + _ASK_USER_EXPONENT2;

    _logo = Config._logo;

    //console.log(Config, _ASK_USER);
}*/

export function getConfig () {
    return Config;
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
    IOS_SEP_LINE:   '#dcdce1',//'rgba(200,199,204,1)',  //#c8c7cc 苹果工作区分割线颜色
    ORANGE:         'rgba(255,102,0,1)',    //'#FF6600',
    FONT_LIGHT_GRAY1:'rgba(187,187,187,1)', //'#BBBBBB', 工作区主字体颜色：（更浅）
    IOS_GRAY_FONT:  'rgba(142,142,147,1)',  //#8e8e93 苹果灰色字体颜色
    BLUE:'#5bc8f3',
}

/**
 * 常用字体大小
 */
export const FontSize = {
    LARGER: 18,
    LARGE: 16,
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
    BOTTOM: 10,
}

export const _styles = {
    CONTAINER: {
        flex: 1,
        backgroundColor: Color.LIGHTER_GRAY,
        flexDirection: 'column',
    },
    CENTER: {
	    //双向绝对居中
        alignItems: 'center',
        justifyContent: 'center',
    },
    NAV_BAR: {
        BUTTON_CONTAINER: {
            flexDirection: 'row',
            height: 44,
        },
        RIGHT_BUTTONS: {
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
        },
        BUTTON: {
            width: 66,
            height: 44,
            justifyContent: 'center',
            alignItems: 'center',
        },
    }
}





