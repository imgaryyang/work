import dva from 'dva';
import { loadBillList, loadNeedPayBills } from '../services/BillService';

export default {

	namespace: 'bill',

	state: {
		bills: [],					//所有账单列表，包含预存和消费
		needPayBills: [],		//所有代缴费账单
		needPayBillsLoaded: false,
		selectedIds: '',
		selectedTotalAmt: 0,
		selectedBills: [],	//被选择的缴费账单
		billBrief: {},
		preSettlement: {},
	},

	//订阅
	subscriptions: {
	},

	//远程请求
	effects: {

		/**
		 * 查询账单明细
		 */
    * loadBillList ({ payload }, { select, call, put }) {
    	const {data} = yield call(loadBillList);
    	if (data && data.success ) {
    		yield put({
	  			type: 'setState',
	  			payload: {
	  				bills: data.result
	  			},
	      })
      }
    },

		/**
		 * 查询待缴费账单
		 */
    * loadNeedPayBills ({ payload }, { select, call, put }) {
    	const {data} = yield call(loadNeedPayBills);
    	if (data && data.success ) {
    		let ids = '', total = 0;
    		for (let i = 0 ; i < data.result.length ; i++) {
					ids += data.result[i]['PrescriptionId'] + ';';
					total += data.result[i]['TotalAmt'];
    		}

    		yield put({
	  			type: 'setState',
	  			payload: {
	  				needPayBills: data.result,
	  				needPayBillsLoaded: true,
	  				selectedIds: ids,
	  				selectedTotalAmt: total,
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


