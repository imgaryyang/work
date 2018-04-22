import dva from 'dva';
import { loadAcctInfo } from '../services/AccountService';

export default {

	namespace: 'account',

	state: {
		account: {},
		billList: [],
	},

	//订阅
	subscriptions: {
	},

	//远程请求
	effects: {

		/**
		 * 载入账户基本信息
		 */
    * loadAcctInfo ({ payload }, { select, call, put }) {
    	const {data} = yield call(loadAcctInfo);
    	if (data && data.success ) {
    		yield put({
	  			type: 'setState',
	  			payload: {
	  				account: data.result
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

		acctTransToIpptPrepaid (state, {payload}) {
			let account = state.account;
			account.Balance -= parseInt(payload.amt);
			//修改预存账户余额
	    return {
				...state, 
				account: account,
			};
		},

		acctPay (state, {payload}) {
			let account = state.account;
			account.Balance -= parseInt(payload.amt);
			//修改预存账户余额
	    return {
				...state, 
				account: account,
			};
		},

		prepaidDone (state, {payload}) {
			let account = state.account;
			account.Balance += payload.Amt;
			//修改预存账户余额
	    return {
				...state, 
				account: account,
			};
		},

	},
};


