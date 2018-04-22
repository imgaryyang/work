import dva from 'dva';
import moment from 'moment';
import { loadPrepaidBalance, loadDailyBill, loadInpatientBill } from '../services/InpatientService';

export default {

	namespace: 'inpatient',

	state: {
		PrepaidBalance: null,

		InpatientBill: {},
		InpatientBillLoaded: false,

		DailyBill: {},
		DailyBillLoaded: false,

		InpatientAdmissionDate: null,
	},

	//订阅
	subscriptions: {
	},

	//远程请求
	effects: {

		/**
		 * 载入账户基本信息
		 */
    * loadPrepaidBalance ({ payload }, { select, call, put }) {
    	const {data} = yield call(loadPrepaidBalance);
    	if (data && data.success ) {
    		yield put({
	  			type: 'setState',
	  			payload: data.result,
	      })
      }
    },

		/**
		 * 查询住院日清单
		 */
    * loadDailyBill ({ payload }, { select, call, put }) {
    	//先清空数据
    	yield put({
  			type: 'setState',
  			payload: {
  				DailyBill: {},
  				DailyBillLoaded: false,
  				InpatientAdmissionDate: null,
  			},
      });

    	const {data} = yield call(loadDailyBill, payload);
    	if (data && data.success ) {
    		yield put({
	  			type: 'setState',
	  			payload: {
	  				DailyBill: data.result,
	  				DailyBillLoaded: true,
	  				InpatientAdmissionDate: data.result.AdmissionDate,
	  			},
	      })
      };
    },

		/**
		 * 查询住院费用
		 */
    * loadInpatientBill ({ payload }, { select, call, put }) {
    	//先清空数据
    	yield put({
  			type: 'setState',
  			payload: {
  				InpatientBill: {},
  				InpatientBillLoaded: false,
  			},
      });

    	const {data} = yield call(loadInpatientBill, payload);
    	if (data && data.success ) {
    		yield put({
	  			type: 'setState',
	  			payload: {
	  				InpatientBill: data.result,
	  				InpatientBillLoaded: true,
	  			},
	      })
      };
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

		acctTransToIpptPrepaid (state, {payload}) {
			//修改预缴账户余额
	    return {
				...state, 
				PrepaidBalance: state.PrepaidBalance + parseInt(payload.amt),
			};
		},

		prepaidDone (state, {payload}) {
			//修改预缴账户余额
	    return {
				...state, 
				PrepaidBalance: state.PrepaidBalance + payload.Amt,
			};
		},

	},
};


