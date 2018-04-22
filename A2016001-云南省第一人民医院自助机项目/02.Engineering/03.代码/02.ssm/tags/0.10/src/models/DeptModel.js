import dva from 'dva';
import { loadDepts } from '../services/BaseService';

export default {
	namespace: 'dept',

	state: {
		depts: [],
		selected1: {},
		selected2: {},
		selected3: {},
	},

	//订阅
	subscriptions: {
	},

	//远程请求
	effects: {
		/**
		 * 载入所有科室信息
		 */
    *load({ payload }, { select, call, put }) {
    	const {data} = yield call(loadDepts);
    	if (data && data.success ) {
    		yield put({
	  			type: 'init',
	  			payload: data.result,
	      })
      }
    },
	},

	//处理state
	reducers: {

		/**
		 * 初始化科室信息
		 */
		init (state, {payload}) {
			if(!state.selected1['DeptName']) {
				let selected1 = {}, selected2 = {};
				selected1 = payload.length > 0 ? payload[0] : {};
				selected2 = selected1['children'] && selected1['children'].length > 0 ? selected1['children'][0] : {};

				return {
					...state, 
					depts: payload,
					selected1: selected1,
					selected2: selected2,
				};
			} else
				return state;
		},

		/**
		 * 设置当前被选科室相关信息
		 */
		selectDept (state, {payload}) {
			return {
				...state, 
				selected1: payload['selected1'],
				selected2: payload['selected2'],
				selected3: payload['selected3'],
			}
		},
	},
};


