/**
 * 配置文件
 */
'use strict';

const config = Object.freeze({
	logo: 'logo.png',
	title: '云南省第一人民医院自助服务系统',
	remSize: 12, 					//rem大小 - px
	authCodeLen: 4,				//短信验证码长度
	//定时器
	timer: {
		autoBackToHome: 5, 	//操作结束自动返回首页菜单的时间 - seconds
		resendAuthMsg: 10, 	//重新发送短信验证码的时间 - seconds
		msgShow: 5,
	},
	//首页导航菜单
	home: {
		header: {
			height: 10,
			padding: 1.5,
		},
		menu: {
			width: 14, //rem
			height: 13, //rem
			colsPerRow: 4,
		},
		footer: {
			height: 6,
		},
	},
	//导航栏
	navBar: {
		height: 10,
		padding: 1.5,
	},
	msg: {
		height: 18,
		bottomHeight: 6,
	},
	//科室相关
	dept: { 
		level: 3,
	},
	//预约相关
	appointment: {
		availableAppointDays: 14, //可预约医生的日期长度 - days
		appointToday: false,			//是否可预约当天 - boolean
	},
	prepaid: {
		limit: 3000,
	},
	pay: {
		needPayDetailsDefaultVisible: false,
	},
	inpatientPrepaid: {
		limit: 5000,
	},
	paymentChannels: {
		'MI': '医保报销',
		'PA': '医保个人账户',
		'00': '就诊卡虚拟账户',
		'10': '现金',
		'20': '银联',
			'21': '闪付',
			'22': 'Apple Pay',
			'23': 'Samsung Pay',
			'24': 'Huawei Pay',
			'25': 'Mi Pay',
		'30': '支付宝/微信',
			'31': '微信',
			'32': '支付宝',
	},
	orderType: {
		'0': '就诊卡虚拟账户预存',
		'1': '预约',
		'2': '挂号',
		'3': '缴费（诊间结算）',
		'4': '住院预缴',
		'5': '办理就诊卡',
	},
	colors: {
		bg: '#F5F5F5',
		font: '#4E4E4E',
		lenovoRed: '#BC1E1E',
		lightGray: '#E4E4E4',
	},
	getWS: function() {
		return {
			width: _screenWidth,
			height: (_screenHeight - config.navBar.height * config.remSize),
		}
	},
});

module.exports = config;
