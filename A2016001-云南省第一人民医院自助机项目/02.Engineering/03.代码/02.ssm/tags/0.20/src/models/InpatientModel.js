import dva from 'dva';
import moment from 'moment';
import { loadPrepaidBalance, loadInpatientInfo, loadDailyBillDetail, loadInpatientBill } from '../services/InpatientService';

export default {

	namespace: 'inpatient',

	state: {
		PrepaidBalance: null,
		
		InpatientInfo: {},
		InpatientInfoLoaded: false,
		
		InpatientBill: [],
		InpatientBillLoaded: false,

		DailyBillDetail: [],
		DailyBillDetailLoaded: false,

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
	  			//payload : data.result,
	  			payload: {
	  				PrepaidBalance : data.result,
	  			},
	  			
	      })
      }
    },
    
    /**
	 * 查询住院基本信息
	 */
    * loadInpatientInfo ({ payload }, { select, call, put }) {
    	//先清空数据
    	const {data} = yield call(loadInpatientInfo, payload);
    	if (data && data.success ) {
    		yield put({
	  			type: 'setState',
	  			payload: {
	  				InpatientInfo: data.result,
	  				InpatientInfoLoaded: true,
	  				InpatientAdmissionDate: data.result.admissionDate,
	  			},
    		})
    	};
    },
    
	/**
	 * 查询住院日清单
	 */
    * loadDailyBillDetail ({ payload }, { select, call, put }) {
    	//先清空数据
    	yield put({
  			type: 'setState',
  			payload: {
  				InpatientInfo: {},
  				InpatientInfoLoaded: false,
  				InpatientAdmissionDate: null,
  				DailyBillDetail: [],
  				DailyBillDetailLoaded: false
  			},
    	});
    	const {data} = yield call(loadInpatientInfo, payload);
    	if (data && data.success ) {//先获取主信息
    		if(data.result.inpatientId){
    			const dailyBills = yield call(loadDailyBillDetail, data.result, payload);
    			if(dailyBills.data && dailyBills.data.success){
    				yield put({
        	  			type: 'setState',
        	  			payload: {
        	  				InpatientInfo: data.result,
        	  				InpatientInfoLoaded: true,
        	  				InpatientAdmissionDate: data.result.admissionDate,
        	  				DailyBillDetail: dailyBills.data.result,
        	  				DailyBillDetailLoaded: true
        	  			},
            		})
    			}
    		}
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
  				InpatientInfo: {},
  				InpatientInfoLoaded: false,
  				InpatientAdmissionDate: null,
  				InpatientBill: [],
  				InpatientBillLoaded: false
  			},
    	});
    	
    	const {data} = yield call(loadInpatientInfo, payload);
    	if (data && data.success ) {//先获取主信息
    		if(data.result.inpatientId){
    			const bills = yield call(loadInpatientBill, data.result);
    			if(bills.data && bills.data.success){
    				yield put({
        	  			type: 'setState',
        	  			payload: {
        	  				InpatientInfo: data.result,
        	  				InpatientInfoLoaded: true,
        	  				InpatientAdmissionDate: data.result.admissionDate,
        	  				InpatientBill: bills.data.result,
        	  				InpatientBillLoaded: true
        	  			},
            		})
    			}
    		}
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
				PrepaidBalance: state.PrepaidBalance + parseFloat(payload.amt),
			};
		},

		prepaidDone (state, {payload}) {
		//修改预缴账户余额
	    return {
				...state, 
				PrepaidBalance: state.PrepaidBalance + parseFloat(payload.Amt),
			};
		},

	},
};


