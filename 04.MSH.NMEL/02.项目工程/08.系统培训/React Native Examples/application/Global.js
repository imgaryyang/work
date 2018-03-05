/**
*	环境变量及方法
*/
'use strict';

import React, {
    Platform,
    Dimensions,
    PixelRatio,
    AsyncStorage,
    Alert,
    Image,
} from 'react-native';

export const ASK_HOST 			= '@AsyncStorage.iSEB.host';
export const ASK_MOVIE_HOST 	= '@AsyncStorage.iSEB.movieHost';
export const ASK_ACCT_HOST 		= '@AsyncStorage.iSEB.acctHost';
export const ASK_HOST_TIMEOUT 	= '@AsyncStorage.iSEB.hostTimeout';
export const ASK_USER 			= '@AsyncStorage.iSEB.user';

//存储用户登录令牌
export let USER_LOGIN_INFO = null;

//操作系统 ios | android
export let os = Platform.OS;
//设备像素比
export let pixelRatio = PixelRatio.get();

//导航栏高度
export let NBHeight 		= Platform.OS === 'ios' ? 64 : 44;
//因为存在导航栏，在场景上端需要设置的上间距
export let NBPadding 		= Platform.OS === 'ios' ? 64 : 44;
//export let NBPaddingInTab = Platform.OS === 'ios' ? 60 : 50;

/*
 * 设备实际屏幕属性
 * screen.width 	屏幕宽度
 * screen.height 	屏幕高度
*/
export let screen = {
	width: Dimensions.get('window').width,
	height: Dimensions.get('window').height,
};

export let interceptedRoute = null;

//后台服务地址
export let host = null;
export let hostTimeout = 5000;
export let movieHost = null;
export let acctHost = null;
/**/
export let channelID = "CH20160415000001";

//用户当前位置
export let curr_location = 		{"code": "110100", "name": "北京"};

//用户头像存储路径
export const userPortraitPath = 	"images/person/portrait/";
//用户默认头像
export const userDftPortrait =		"me-portrait-dft.png";
//用户背景存储头像
export const userBgPath = 			"images/person/bg/";
//用户默认背景
export const userDftBg =			"me-bg-dft.png";
//银行logo存储路径
export const bankLogoPath = 		"images/bank-logo/";
//报销模块按钮路径
export const reimburseBtnPath =     "images/reimburseMng/btn/";
//消费类型标识路径
export const costTypePath =  	    "images/reimburseMng/cost/cost_type/";
//报销流程图片
export const approvePath = 			"images/reimburseMng/approve/";
//电影图片
export const movieImgPath = 		"images/filmImages/";

//本行
export const bank = 				{"code": "313100000013", "name": "北京银行"};

//需要登录后才能访问的component
export const needLoginComp = ['TransferMng', 'CreditCard', 'OpenElecAcct', 'Profile', 'CompanyView','BindBanksCard','ChooseSeat'];

//常用颜色
export const colors = {
	NAV_BAR_LINE: 	'#CCC',
	NAV_BAR_BG:		'rgba(68, 92, 149, 1)',
	NAV_TITLE_TEXT:	'#000000',
	NAV_BACK_TEXT: 	'#929292',
	NAV_BACK_ICON: 	'#929292',
	NAV_BTN: 		'#007AFF',

	TAB_BAR_LINE: 	'#CCC',
	TAB_BAR_BG: 	'#FFFFFF',
	TAB_BTN: 		'#929292',
	TAB_BTN_ACTIVE: '#007AFF',

	FONT: 			'#000000', 	//工作区主字体颜色：（黑）
	FONT_GRAY:		'#5D5D5D',	//工作区主字体颜色：（深）
	FONT_LIGHT_GRAY:'#828282',	//工作区主字体颜色：（浅）
	FONT_LIGHT_GRAY1:'#BBBBBB',	//工作区主字体颜色：（更浅）
	LINE:			'#E6E6E6',	//工作区分割线颜色
	VIEW_BG:		'#E3E3E6',	//工作区背景色

	IOS_BLUE:		'#007AFF',	//苹果蓝色
	IOS_RED:		'#FF3B30',	//苹果红色
	IOS_GREEN:		'#4CD964',	//苹果浅绿
	IOS_YELLOW:		'#FFE100',	//苹果黄色
	IOS_DARK_GRAY:	'#929292',	//苹果深灰
	IOS_LIGHT_GRAY:	'#C8C7CC',	//苹果浅灰
	IOS_GRAY_BG:	'#F8F8F8',	//苹果浅灰底色

	IOS_NAV_BG:		'rgba(245, 245, 247, 1)',  //f5f5f7 苹果导航栏底色
	IOS_NAV_LINE: 	'rgba(167, 167, 170, 1)',  //a7a7aa 苹果导航栏线条
	IOS_BG: 		'rgba(239, 239, 244, 1)',  //efeff4 苹果经典背景色
	IOS_SEP_LINE: 	'rgba(200, 199, 204, 1)',  //c8c7cc 苹果工作区分割线颜色
	IOS_ARROW: 		'rgba(199, 199, 204, 1)',  //c7c7cc 苹果箭头颜色
	IOS_GRAY_FONT: 	'rgba(142, 142, 147, 1)',  //8e8e93 苹果灰色字体颜色

	ORANGE:			'#FF6600',
	BROWN:			'#663300',
	PURPLE:			'#660066',
};

//公用样式
export const styles = {
	CONTAINER: {
		flex: 1,
		backgroundColor: colors.IOS_BG,
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
        borderColor: colors.IOS_SEP_LINE,
        borderWidth: 1 / PixelRatio.get(),
	},
	SEP_LINE: {
        width: getScreen().width - 15, 
        left: 15,
        backgroundColor: colors.IOS_SEP_LINE, 
        height: 1/pixelRatio,
    },
    FULL_SEP_LINE: {
        width: getScreen().width, 
        backgroundColor: colors.IOS_SEP_LINE, 
        height: 1/pixelRatio,
    },
    GRAY_BTN: {
		alignItems: 'center', 
		justifyContent: 'center',
    	height: 40, 
    	flex: 1, 
    	backgroundColor: colors.IOS_LIGHT_GRAY, 
    	borderRadius: 3,
    	flexDirection: 'row',
    },
    BLUE_BTN: {
		alignItems: 'center', 
		justifyContent: 'center',
    	height: 40, 
    	flex: 1, 
    	backgroundColor: colors.IOS_BLUE, 
    	borderRadius: 3,
    	flexDirection: 'row',
    },
    ORANGE_BTN: {
		alignItems: 'center', 
		justifyContent: 'center',
    	height: 40, 
    	flex: 1, 
    	backgroundColor: colors.ORANGE, 
    	borderRadius: 3,
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
			width: 44,
			height: 44,
			justifyContent: 'center',
			alignItems: 'center',
		},
		BUTTON_ICON: {
    		textAlign: 'center',
		},
	    CENTER_VIEW: {
	        height: NBHeight,
	        paddingTop: NBPadding - 44,
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
			top: NBPadding,
			left: 0,
			width: Dimensions.get('window').width,
			height: 44,
			backgroundColor: colors.IOS_NAV_BG,
			borderBottomWidth: 1 / PixelRatio.get(),
			borderBottomColor: colors.IOS_NAV_LINE,
			flexDirection: 'row',
	        alignItems: 'center',
	        justifyContent: 'center',
		},
		FIXED_BAR: {
			width: Dimensions.get('window').width,
			height: 44,
			backgroundColor: colors.IOS_NAV_BG,
			borderBottomWidth: 1 / PixelRatio.get(),
			borderBottomColor: colors.IOS_NAV_LINE,
			flexDirection: 'row',
	        alignItems: 'center',
	        justifyContent: 'center',
		},
		SEARCH_INPUT: os == 'ios' ? {
			height: 30,
			fontSize: 13,
			borderRadius: 5,
			borderWidth: 1 / PixelRatio.get(),
			borderColor: colors.IOS_NAV_LINE,
			backgroundColor: '#ffffff',
			paddingLeft: 5,
			paddingRight: 5,
		} : {
			height: 30,
			fontSize: 13,
		},
		SEARCH_INPUT_IOS: {
			borderRadius: 5,
			borderWidth: 1 / PixelRatio.get(),
			borderColor: colors.IOS_NAV_LINE,
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
		TEXT_INPUT: os == 'ios' ? {
			height: 35,
			fontSize: 13,
			borderRadius: 5,
			borderWidth: 1 / PixelRatio.get(),
			borderColor: colors.IOS_SEP_LINE,
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
			borderColor: colors.IOS_SEP_LINE,
			borderWidth: 1 / pixelRatio,
			borderRadius: 3,
		},
		OPTION_BTN_TEXT: {
			fontSize: 10,
			color: colors.IOS_GRAY_FONT,
			textAlign: 'center',
		},
	},
};

export const bankLogos = {
	'102': (<Image style={{width: 30, height: 20, backgroundColor: 'transparent'}} resizeMode='contain' source={require('./res/images/bankLogos/102.png')} />),
	'103': (<Image style={{width: 30, height: 20, backgroundColor: 'transparent'}} resizeMode='contain' source={require('./res/images/bankLogos/103.png')} />),
	'104': (<Image style={{width: 30, height: 20, backgroundColor: 'transparent'}} resizeMode='contain' source={require('./res/images/bankLogos/104.png')} />),
	'105': (<Image style={{width: 30, height: 20, backgroundColor: 'transparent'}} resizeMode='contain' source={require('./res/images/bankLogos/105.png')} />),
	'301': (<Image style={{width: 30, height: 20, backgroundColor: 'transparent'}} resizeMode='contain' source={require('./res/images/bankLogos/301.png')} />),
	'302': (<Image style={{width: 30, height: 20, backgroundColor: 'transparent'}} resizeMode='contain' source={require('./res/images/bankLogos/302.png')} />),
	'303': (<Image style={{width: 45, height: 15, backgroundColor: 'transparent'}} resizeMode='contain' source={require('./res/images/bankLogos/303.png')} />),
	'305': (<Image style={{width: 30, height: 15, backgroundColor: 'transparent'}} resizeMode='contain' source={require('./res/images/bankLogos/305.png')} />),
	'306': (<Image style={{width: 30, height: 18, backgroundColor: 'transparent'}} resizeMode='contain' source={require('./res/images/bankLogos/306.png')} />),
	'307': (<Image style={{width: 62, height: 18, backgroundColor: 'transparent'}} resizeMode='contain' source={require('./res/images/bankLogos/307.png')} />),
	'308': (<Image style={{width: 30, height: 20, backgroundColor: 'transparent'}} resizeMode='contain' source={require('./res/images/bankLogos/308.png')} />),
	'309': (<Image style={{width: 30, height: 15, backgroundColor: 'transparent'}} resizeMode='contain' source={require('./res/images/bankLogos/309.png')} />),
	'310': (<Image style={{width: 30, height: 17, backgroundColor: 'transparent'}} resizeMode='contain' source={require('./res/images/bankLogos/310.png')} />),
	'313100000013': (<Image style={{width: 30, height: 20, backgroundColor: 'transparent'}} resizeMode='contain' source={require('./res/images/bankLogos/313100000013.png')} />),
	'313241066661': (<Image style={{width: 30, height: 20, backgroundColor: 'transparent'}} resizeMode='contain' source={require('./res/images/bankLogos/313241066661.png')} />),
	'313290000017': (<Image style={{width: 30, height: 20, backgroundColor: 'transparent'}} resizeMode='contain' source={require('./res/images/bankLogos/313290000017.png')} />),
	'313731010015': (<Image style={{width: 30, height: 18, backgroundColor: 'transparent'}} resizeMode='contain' source={require('./res/images/bankLogos/313731010015.png')} />),
	'403': (<Image style={{width: 30, height: 17, backgroundColor: 'transparent'}} resizeMode='contain' source={require('./res/images/bankLogos/403.png')} />),
};

/*
 * 系统初始化
*/
export async function init() {
	try {
		let hostInAS 		= await AsyncStorage.getItem(ASK_HOST);
		let movieHostInAS 	= await AsyncStorage.getItem(ASK_MOVIE_HOST);
		let acctHostInAS 	= await AsyncStorage.getItem(ASK_ACCT_HOST);
		let hostTimeoutInAS = await AsyncStorage.getItem(ASK_HOST_TIMEOUT);
		let userInAS		= await AsyncStorage.getItem(ASK_USER);
		
		//从持久化数据中取host，如果没有，则将Global中初始化的host持久化
		if(hostInAS == null) {
			host = 'http://localhost/';
			await AsyncStorage.setItem(ASK_HOST, host);
		} else {
			host = hostInAS;
		}
		
		//从持久化数据中取movieHost，如果没有，则将Global中初始化的movieHost持久化
		if(movieHostInAS == null) {
			movieHost = 'http://localhost/';
			await AsyncStorage.setItem(ASK_MOVIE_HOST, movieHost);
		} else {
			movieHost = movieHostInAS;
		}

		//从持久化数据中取acctHost，如果没有，则将Global中初始化的acctHost持久化
		if(acctHostInAS == null) {
			acctHost = 'http://localhost/';
			await AsyncStorage.setItem(ASK_ACCT_HOST, acctHost);
		} else {
			acctHost = acctHostInAS;
		}
		
		//从持久化数据中取hostTimeout，如果没有，则将Global中初始化的hostTimeout持久化
		//console.log('hostTimeoutInAS:' + hostTimeoutInAS);
		if(hostTimeoutInAS == null) {
			await AsyncStorage.setItem(ASK_HOST_TIMEOUT, hostTimeout + '');
		} else {
			hostTimeout = parseFloat(hostTimeoutInAS);
			//console.log('Global.hostTimeout:' + hostTimeout);
		}

		USER_LOGIN_INFO = JSON.parse(userInAS);

		return true;

	} catch(e) {
		console.log('error in Global.init():');
		console.log(e);

		return false;
	}
}

export async function setHost(h) {
	host = h;
	await AsyncStorage.setItem(ASK_HOST, host);
}

export function getHost() {
	return host;
}

export async function setHostTimeout(ht) {
	hostTimeout = ht;
	await AsyncStorage.setItem(ASK_HOST_TIMEOUT, hostTimeout + '');
}

export function getHostTimeout() {
	return hostTimeout;
}

export async function setMovieHost(mh) {
	movieHost = mh;
	await AsyncStorage.setItem(ASK_MOVIE_HOST, movieHost);
}

export function getMovieHost() {
	return movieHost;
}

export async function setAcctHost(mh) {
	acctHost = mh;
	await AsyncStorage.setItem(ASK_ACCT_HOST, acctHost);
}

export function getAcctHost() {
	return acctHost;
}

/*
 * 在初始场景中通过布局属性获得屏幕实际高度及宽度
 * 在0.16及以前版本中，Android系统下通过Dimensions获取的屏幕高度包含状态栏高度，
 * 而通过Layout获取的屏幕高度不包括状态栏高度，场景中使用到屏幕高度时，使用Layout
 * 获取的屏幕属性较为准确。0.17及以上版本是否存在此问题有待验证。
*/
export function setLayoutScreen(layoutScreen) {
	screen = layoutScreen;
}

export function getScreen() {
	return screen;
}
