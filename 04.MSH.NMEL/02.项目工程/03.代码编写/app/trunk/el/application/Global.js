/**
*	环境变量及方法
*/
'use strict';

import React, {
    Component,
    PropTypes,
} from 'react';

import {
    Platform,
    Dimensions,
    PixelRatio,
    AsyncStorage,
    Alert,
    Image,
    StyleSheet,
} from 'react-native';

import UserAction from './flux/UserAction';

export let Config = null;
/**
 * 医院基础信息
 * 医院专属客户端可从此处取医院信息
 */
export let _hosp = null;

export let _logo = null;

export let _ASK_HOST 			= '.host';
export let _ASK_HOST_TIMEOUT 	= '.hostTimeout';
export let _ASK_USER 			= '.user';
export let _ASK_USER_BANKCARDS 	= '.bankcards';
export let _ASK_USER_GESLISTS 	= '.gesLists';

export let _ASK_USER_RANDOM 	= '.user.random';
export let _ASK_USER_MODULUS1 	= '.modulus1';
export let _ASK_USER_EXPONENT1 	= '.exponent1';
export let _ASK_USER_MODULUS2 	= '.modulus2';
export let _ASK_USER_EXPONENT2 	= '.exponent2';

//操作系统 ios | android
export let _os = Platform.OS;

//设备像素比
export let _pixelRatio = PixelRatio.get();

//导航栏高度
export let _navBarHeight = Platform.OS === 'ios' ? 64 : 44;

/*
 * 设备实际屏幕属性
 * screen.width 	屏幕宽度
 * screen.height 	屏幕高度
*/
export let _screen = {
	width: Dimensions.get('window').width,
	height: Dimensions.get('window').height,
};

//后台服务地址
export let _host 		= 'http://110.76.186.37/api/';
// export let _host 		= 'http://10.12.253.35:9200/';
export let _iSEB_host 	= _os == 'ios' ? 'http://localhost:9000/' : 'http://10.12.253.5:9000/';
export let _hostTimeout = 5000;

//用户当前位置
export let _currLocation = {"code": "110100", "name": "北京"};

//需要登录后才能访问的component
export const _needLoginComp = ['Test','SalaryList','BindCard1','Profile','SecuritySettings','PatientsList','TreatList','CheckReportList','MedAlarmList'];


//常用颜色
export const _colors = {
	NAV_BAR_LINE: 	'rgba(204,204,204,1)', 	//'#CCCCCC',
	NAV_BAR_BG:		'rgba(68,92,149,1)', 	//'#445C95',
	NAV_TITLE_TEXT:	'rgba(0,0,0,1)', 		//'#000000',
	NAV_BACK_TEXT: 	'rgba(146,146,146,1)', 	//'#929292',
	NAV_BACK_ICON: 	'rgba(146,146,146,1)', 	//'#929292',
	NAV_BTN: 		'rgba(0,122,255,1)', 	//'#007AFF',

	TAB_BAR_LINE: 	'rgba(204,204,204,1)', 	//'#CCCCCC',
	TAB_BAR_BG: 	'rgba(255,255,255,1)', 	//'#FFFFFF',
	TAB_BTN: 		'rgba(146,146,146,1)', 	//'#929292',
	TAB_BTN_ACTIVE: 'rgba(0,122,255,1)', 	//'#007AFF',

	FONT: 			'rgba(0,0,0,1)', 		//'#000000', 工作区主字体颜色：（黑）
	FONT_GRAY:		'rgba(93,93,93,1)', 	//'#5D5D5D', 工作区主字体颜色：（深）
	FONT_LIGHT_GRAY:'rgba(130,130,130,1)', 	//'#828282', 工作区主字体颜色：（浅）
	FONT_LIGHT_GRAY1:'rgba(187,187,187,1)', //'#BBBBBB', 工作区主字体颜色：（更浅）
	LINE:			'rgba(230,230,230,1)', 	//'#E6E6E6', 工作区分割线颜色
	VIEW_BG:		'#f8f7fd',  			//'rgba(227,227,230,1)', 	//'#E3E3E6', 工作区背景色

	IOS_BLUE:		'rgba(0,122,255,1)', 	//'#007AFF', 苹果蓝色
	IOS_RED:		'rgba(255,59,48,1)', 	//'#FF3B30', 苹果红色
	IOS_GREEN:		'rgba(76,217,100,1)', 	//'#4CD964', 苹果浅绿
	IOS_YELLOW:		'rgba(255,225,0,1)', 	//'#FFE100', 苹果黄色
	IOS_DARK_GRAY:	'rgba(146,146,146,1)', 	//'#929292', 苹果深灰
	IOS_LIGHT_GRAY:	'rgba(200,199,204,1)', 	//'#C8C7CC', 苹果浅灰
	IOS_GRAY_BG:	'rgba(248,248,248,1)', 	//'#F8F8F8', 苹果浅灰底色

	IOS_NAV_BG:		'rgba(245,245,247,1)',  //#f5f5f7 苹果导航栏底色
	IOS_NAV_LINE: 	'rgba(167,167,170,1)',  //#a7a7aa 苹果导航栏线条
	IOS_BG: 		'rgba(239,239,244,1)',  //#efeff4 苹果经典背景色
	IOS_SEP_LINE: 	'#dcdce1',//'rgba(200,199,204,1)',  //#c8c7cc 苹果工作区分割线颜色
	IOS_ARROW: 		'rgba(199,199,204,1)',  //#c7c7cc 苹果箭头颜色
	IOS_GRAY_FONT: 	'rgba(142,142,147,1)',  //#8e8e93 苹果灰色字体颜色
	IOS_SEARCH_BG: 	'rgba(202,201,207,1)',  //#cac9cf 搜索框背景颜色

	ORANGE:			'rgba(255,102,0,1)', 	//'#FF6600',
	BROWN:			'rgba(102,51,0,1)', 	//'#663300',
	PURPLE:			'rgba(102,0,102,1)', 	//'#660066',
};

//公用样式
export const _styles = {
	CONTAINER: {
		flex: 1,
		backgroundColor: _colors.VIEW_BG,
		flexDirection: 'column',
	},
	PLACEHOLDER10: {
		backgroundColor: 'transparent',
		height: 10,
	},
	PLACEHOLDER15: {
		backgroundColor: 'transparent',
		height: 15,
	},
	PLACEHOLDER20: {
		backgroundColor: 'transparent',
		height: 20,
	},
	PLACEHOLDER40: {
		backgroundColor: 'transparent',
		height: 40,
	},
	ICON: {		//用于icon组件，此组件在Android下必须使用字体居中才能保证icon不偏移
		textAlign: 'center',
	},	
	CENTER: {	//双向绝对居中
		alignItems: 'center', 
		justifyContent: 'center',
	},
	BORDER: {
        borderColor: _colors.IOS_SEP_LINE,
        borderWidth: 1 / _pixelRatio,
	},
	SEP_LINE: {
        //width: getScreen().width - 15, 
        marginLeft: 15,
        backgroundColor: _colors.IOS_SEP_LINE, 
        height: 1/_pixelRatio,
    },
	SEP_LINE_WITH_ICON: {
        //width: getScreen().width - 50, 
        marginLeft: 50,
        backgroundColor: _colors.IOS_SEP_LINE, 
        height: 1/_pixelRatio,
    },
    FULL_SEP_LINE: {
        //width: getScreen().width, 
        backgroundColor: _colors.IOS_SEP_LINE, 
        height: 1/_pixelRatio,
    },
    GRAY_BTN: {
		alignItems: 'center', 
		justifyContent: 'center',
    	height: 40, 
    	flex: 1, 
    	backgroundColor: _colors.IOS_LIGHT_GRAY, 
    	borderRadius: 3,
    	flexDirection: 'row',
    },
    BLUE_BTN: {
		alignItems: 'center', 
		justifyContent: 'center',
    	height: 40, 
    	flex: 1, 
    	backgroundColor: _colors.IOS_BLUE, 
    	borderRadius: 3,
    	flexDirection: 'row',
    },
    ORANGE_BTN: {
		alignItems: 'center', 
		justifyContent: 'center',
    	height: 40, 
    	flex: 1, 
    	backgroundColor: _colors.ORANGE, 
    	borderRadius: 3,
    },
    LIST: {
		borderWidth: 1 / _pixelRatio,
		borderColor: _colors.IOS_SEP_LINE,
		borderLeftWidth: 0,
		borderRightWidth: 0,
    },
	GRAY_FONT: {
		fontSize: 13,
		color: _colors.FONT_GRAY,
	},
	CARD_TITLE: {
		borderBottomWidth: 1 / _pixelRatio,
		borderBottomColor: _colors.IOS_SEP_LINE,
		paddingBottom: 6,
	},
	CARD_TITLE_TEXT: {
		fontSize: 13,
		color: _colors.FONT_GRAY,
		fontWeight: '500',
	},
	MSG_VIEW: {
		marginTop: 20,
		alignItems: 'center',
		justifyContent: 'center',
	},
	MSG_TEXT: {
		fontSize: 17,
		color: _colors.FONT_LIGHT_GRAY1,
		textAlign: 'center',
		margin: 10,
	},
	NAV_BAR: {
	    BAR: {
	        width: _screen.width,
	        height: _navBarHeight,
	        borderTopWidth: 0,
	        flexDirection: 'row',
	        overflow: 'hidden',
	    },
		FLOW_BAR: {
	        position: 'absolute',
	        top: 0,
	        left: 0,
	    },
		BUTTON_CONTAINER: {
			flexDirection: 'row',
			height: 44,
		},
		RIGHT_BUTTONS: {
	        alignItems: 'flex-end',
	        justifyContent: 'flex-end',
		},
		BUTTON: {
			width: 44,
			height: 44,
			justifyContent: 'center',
			alignItems: 'center',
		},
		BUTTON_ICON: {
    		textAlign: 'center',
		},
	    CENTER_VIEW: {
	        height: _navBarHeight,
	        paddingTop: (_os == 'ios' ? 20 : 0),
	        alignItems: 'center',
	        justifyContent: 'center',
	        flex: 1.5,
	    },
        TITLE_TEXT: {
            flex: 1,
            fontSize: 16,
            color: '#000000',
            textAlign: 'center',
        },
	},
	TOOL_BAR: {
		BAR: {
			position: 'absolute',
			top: _navBarHeight,
			left: 0,
			width: _screen.width,
			height: 44,
			backgroundColor: _colors.IOS_NAV_BG,
			borderBottomWidth: 1 / _pixelRatio,
			borderBottomColor: _colors.IOS_NAV_LINE,
			flexDirection: 'row',
	        alignItems: 'center',
	        justifyContent: 'center',
		},
		FIXED_BAR: {
			width: _screen.width,
			height: 44,
			backgroundColor: _colors.IOS_NAV_BG,
			borderBottomWidth: 1 / _pixelRatio,
			borderBottomColor: _colors.IOS_NAV_LINE,
			flexDirection: 'row',
	        alignItems: 'center',
	        justifyContent: 'center',
		},
		SEARCH_INPUT: _os == 'ios' ? {
			height: 30,
			fontSize: 13,
			borderRadius: 5,
			borderWidth: 1 / _pixelRatio,
			borderColor: _colors.IOS_NAV_LINE,
			backgroundColor: '#ffffff',
			paddingLeft: 5,
			paddingRight: 5,
		} : {
			height: 30,
			fontSize: 13,
		},
		SEARCH_INPUT_IOS: {
			borderRadius: 5,
			borderWidth: 1 / _pixelRatio,
			borderColor: _colors.IOS_NAV_LINE,
			backgroundColor: '#ffffff',
			paddingLeft: 5,
			paddingRight: 5,
		},
		BUTTON: {
			width: 50, 
			height: 43,
		},
	},
	FORM: {
		TEXT_INPUT: _os == 'ios' ? {
			height: 35,
			fontSize: 13,
			borderRadius: 5,
			borderWidth: 1 / _pixelRatio,
			borderColor: _colors.IOS_SEP_LINE,
			backgroundColor: '#ffffff',
			paddingLeft: 5,
			paddingRight: 5,
		} : {
			height: 35,
			fontSize: 13,
		},
		NO_BORDER_TEXT_INPUT: {
			borderWidth: 0,
			backgroundColor: 'transparent',
			fontSize: 13,
			paddingLeft: 5,
			paddingRight: 5,
			height: 35,
		},
		GRAY_TEXT_INPUT: _os == 'ios' ? {
			height: 35,
			fontSize: 13,
			borderRadius: 5,
			borderWidth: 0,
			backgroundColor: _colors.IOS_GRAY_BG,
			paddingLeft: 5,
			paddingRight: 5,
		} : {
			height: 35,
			fontSize: 13,
			borderRadius: 5,
			borderWidth: 0,
			backgroundColor: _colors.IOS_GRAY_BG,
			paddingLeft: 5,
			paddingRight: 5,
		},
	},
	ACCT: {
		OPTION_ROW: {
			flexDirection: 'row',
			padding: 5,
			alignItems: 'flex-end', 
			justifyContent: 'flex-end',
			paddingRight: 10,
		},
		OPTION_BTN: {
			padding: 3,
			paddingRight: 10,
			paddingLeft: 10,
			marginLeft: 10,
			alignItems: 'center', 
			justifyContent: 'center',
			borderColor: _colors.IOS_SEP_LINE,
			borderWidth: 1 / _pixelRatio,
			borderRadius: 3,
		},
		OPTION_BTN_TEXT: {
			fontSize: 10,
			color: _colors.IOS_GRAY_FONT,
			textAlign: 'center',
		},
	},
	CARD: {
		flex: 1,
		backgroundColor: '#ffffff',
		borderColor: _colors.IOS_SEP_LINE,
		borderWidth: 1 / _pixelRatio,
		borderRadius: 3,
		padding: 10,
	},
	ICON_HOLDER: {
		width: 30,
		height: 30,
		borderRadius: 5,
	},
};

/*
 * 系统初始化
*/
export async function init() {
	try {
		//let hostInAS 		= await AsyncStorage.getItem(_ASK_HOST);

		let hostTimeoutInAS = await AsyncStorage.getItem(_ASK_HOST_TIMEOUT);
		let userInAS		= await AsyncStorage.getItem(_ASK_USER);
		let bankCardsInAS	= await AsyncStorage.getItem(_ASK_USER_BANKCARDS);

		//从持久化数据中取host，如果没有，则将Global中初始化的host持久化
		/*if(hostInAS == null) {
			_host = 'http://localhost:9000/';
			await AsyncStorage.setItem(_ASK_HOST, _host);
		} else {
			_host = hostInAS;
		}*/
		
		//从持久化数据中取hostTimeout，如果没有，则将Global中初始化的hostTimeout持久化
		if(hostTimeoutInAS == null) {
			await AsyncStorage.setItem(_ASK_HOST_TIMEOUT, _hostTimeout + '');
		} else {
			_hostTimeout = parseFloat(hostTimeoutInAS);
		}

		//TODO:将取出的用户对象放置到flux store中
		UserAction.login(JSON.parse(userInAS), JSON.parse(bankCardsInAS));

		return true;

	} catch(e) {
		console.log('error in Global.init():');
		console.log(e);

		return false;
	}
}

export function setConfig (config) {
	//console.log(config);
	Config = config;

	_ASK_HOST 			= '@AsyncStorage.' + Config._APP_ID + _ASK_HOST;
	_ASK_HOST_TIMEOUT 	= '@AsyncStorage.' + Config._APP_ID + _ASK_HOST_TIMEOUT;
	_ASK_USER 			= '@AsyncStorage.' + Config._APP_ID + _ASK_USER;
	_ASK_USER_BANKCARDS = '@AsyncStorage.' + Config._APP_ID + _ASK_USER_BANKCARDS;
	_ASK_USER_GESLISTS 	= '@AsyncStorage.' + Config._APP_ID + _ASK_USER_GESLISTS;

	_ASK_USER_RANDOM 	= '@AsyncStorage.' + Config._APP_ID + _ASK_USER_RANDOM;
	_ASK_USER_MODULUS1 	= '@AsyncStorage.' + Config._APP_ID + _ASK_USER_MODULUS1;
	_ASK_USER_EXPONENT1 = '@AsyncStorage.' + Config._APP_ID + _ASK_USER_EXPONENT1;
	_ASK_USER_MODULUS2 	= '@AsyncStorage.' + Config._APP_ID + _ASK_USER_MODULUS2;
	_ASK_USER_EXPONENT2 = '@AsyncStorage.' + Config._APP_ID + _ASK_USER_EXPONENT2;

	_logo = Config._logo;

	//console.log(Config, _ASK_USER);
}

export function getConfig () {
	return Config;
}

/*export async function setHost(h) {
	_host = h;
	await AsyncStorage.setItem(_ASK_HOST, _host);
}*/

export function getHost() {
	return _host;
}

/*export async function setHostTimeout(ht) {
	_hostTimeout = ht;
	await AsyncStorage.setItem(_ASK_HOST_TIMEOUT, _hostTimeout + '');
}*/

export function getHostTimeout() {
	return _hostTimeout;
}

/*
 * 在初始场景中通过布局属性获得屏幕实际高度及宽度
 * 在0.16及以前版本中，Android系统下通过Dimensions获取的屏幕高度包含状态栏高度，
 * 而通过Layout获取的屏幕高度不包括状态栏高度，场景中使用到屏幕高度时，使用Layout
 * 获取的屏幕属性较为准确。0.17及以上版本是否存在此问题有待验证。
*/
export function setLayoutScreen(layoutScreen) {
	_screen = layoutScreen;
}

export function getScreen() {
	return _screen;
}
