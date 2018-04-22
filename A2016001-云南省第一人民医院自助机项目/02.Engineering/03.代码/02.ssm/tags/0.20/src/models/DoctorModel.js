import dva from 'dva';
import { loadDoctors } from '../services/BaseService';

export default {

	namespace: 'doctor',

	state: {
		doctors: [],
		searchResult: [],
		cond: '',
	},

	//订阅
	subscriptions: {
	},

	//远程请求
	effects: {

		/**
		 * 载入医生信息
		 */
    *load({ payload }, { select, call, put }) {
    	const {data} = yield call(loadDoctors);
    	if (data && data.success ) {
    		yield put({
	  			type: 'setState',
	  			payload: {
	  				searchResult: data.result,
	  			},
	      })
      }
    },

		/**
		 * 查询医生信息
		 */
    *search({ payload }, { select, call, put }) {

    	yield put({
				type: 'setState',
				payload: payload
    	});

			const theState = yield select(state => state.doctor);

    	const {data} = yield call(loadDoctors);

    	let result = data.result ? data.result : [], filterResult = result;
    	filterResult = result.filter (
		    row => theState.cond && row.ShortPinYin.substr(0, theState.cond.length) == theState.cond /*row.ShortPinYin.startsWith(theState.cond)*/
		  );

    	if ( filterResult /*data && data.success*/) {
    		yield put({
	  			type: 'setState',
	  			payload: {
	  				searchResult: filterResult,
	  			},
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
		 * 清空医生查询结果
		 */
		clearSearchResult (state, {payload}) {
			return {
				...state, 
				searchResult: [],
			};
		},

	}

};


