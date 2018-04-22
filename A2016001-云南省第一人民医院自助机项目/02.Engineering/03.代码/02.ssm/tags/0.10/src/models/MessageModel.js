/**
 * 公用消息模型
 * 1、用于页面顶端非阻断式浮动消息
 * 2、用于业务完成后跳转到的公共info界面
 */
import dva from 'dva';
import config from '../config';

const _time = config.timer.msgShow;

export default {

	namespace: 'message',

	state: {
		msg: null,				//消息内容可支持字符串或element
		showSwitch: false,
		hideSwitch: false,

		info: null,
		autoBack: true,		//公共info界面是否显示自动返回首页
	},

	//订阅
	subscriptions: {
	},

	//远程请求
	effects: {
	},

	//处理state
	reducers: {

		/**
		 * 通用setState
		 */
		setState (state, {payload}) {
			let {...props} = payload;
			return {
				...state, 
				...props,
			};
		},

		/**
		 * 设置公用info界面的消息
		 */
		setInfo (state, {payload}) {
    	if (payload && payload.info) {
				let {...props} = payload;
				return {
					...state, 
					...props,
				};
			}
		},

		/**
		 * 显示消息窗口
		 */
		show (state, {payload}) {
    	if (payload && payload.msg) {
				return {
					...state, 
					msg: payload.msg,
					showSwitch: true,
				};
			}
		},

		/**
		 * 隐藏消息窗口
		 */
		hide (state, {payload}) {
			return {
				...state, 
				msg: null,
				hideSwitch: true,
			};
		},

	},
};


