import dva from 'dva';
import { loadCaseHistoryRecords, loadCaseHistory, loadCheckRecords, loadCheckInfo } from '../services/OutpatientService';

export default {

	namespace: 'outpatient',

	state: {
		caseHistoryRecords: [],
		caseHistoryRecordsLoaded: false,
		caseHistory: null,
		caseHistoryLoaded: false,

		checkRecords: [],
		checkRecordsLoaded: false,
		checkInfo: {},
		checkInfoLoaded: false,
	},

	//订阅
	subscriptions: {
	},

	//远程请求
	effects: {

		/**
		 * 载入病历记录
		 */
    * loadCaseHistoryRecords ({ payload }, { select, call, put }) {
    	const {data} = yield call(loadCaseHistoryRecords);
    	if (data && data.success ) {
    		yield put({
	  			type: 'setState',
	  			payload: {
	  				caseHistoryRecords: data.result,
	  				caseHistoryRecordsLoaded: true,
	  			},
	      })
      }
    },

		/**
		 * 载入病历信息
		 */
    * loadCaseHistory ({ payload }, { select, call, put }) {
    	const {data} = yield call(loadCaseHistory);
    	if (data && data.success ) {
    		yield put({
	  			type: 'setState',
	  			payload: {
	  				caseHistory: data.result,
	  				caseHistoryLoaded: true,
	  			},
	      })
      }
    },

		/**
		 * 载入检查记录
		 */
    * loadCheckRecords ({ payload }, { select, call, put }) {
    	const {data} = yield call(loadCheckRecords);
    	if (data && data.success ) {
    		yield put({
	  			type: 'setState',
	  			payload: {
	  				checkRecords: data.result,
	  				checkRecordsLoaded: true,
	  			},
	      })
      }
    },

		/**
		 * 载入检查信息
		 */
    * loadCheckInfo ({ payload }, { select, call, put }) {
    	const {data} = yield call(loadCheckInfo);
    	if (data && data.success ) {
    		yield put({
	  			type: 'setState',
	  			payload: {
	  				checkInfo: data.result,
	  				checkInfoLoaded: true,
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

	},
};


