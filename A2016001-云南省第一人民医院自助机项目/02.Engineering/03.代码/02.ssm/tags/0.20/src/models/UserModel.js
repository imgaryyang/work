import dva from 'dva';
import { login, logout } from '../services/UserService';

export default {

	namespace: 'user',

	state: {
		user: null,
	},

	//订阅
	subscriptions: {
	},

	//远程请求
	effects: {

		/**
		 * 用户登录
		 */
    * login ({ payload }, { select, call, put }) {
    	const {data} = yield call(login);
    	if (data && data.success ) {
    		yield put({
	  			type: 'init',
	  			payload: data.result,
	      })
      }
    },

		/**
		 * 用户登出
		 */
    * logout ({ payload }, { select, call, put }) {
    	const {data} = yield call(logout);
    	if (data && data.success ) {
    		yield put({
	  			type: 'logout'
	      })
      }
    },

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
		 * 初始化用户信息
		 */
		init (state, {payload}) {
			return {
				...state, 
				user: payload,
			};
		},

		/**
		 * 登出 - 清空用户信息
		 */
		logout (state, {payload}) {
			return {
				...state, 
				user: null,
			};
		},

	},
};


