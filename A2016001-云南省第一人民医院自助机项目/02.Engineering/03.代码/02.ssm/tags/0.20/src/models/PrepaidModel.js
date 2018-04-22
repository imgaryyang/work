import dva from 'dva';
import { createOrder } from '../services/PrepaidService';


export default {

	namespace: 'prepaid',

	state: {
		order:{},
		settlement:{},
	},

	subscriptions: {},

	effects: {
		*createOrder({ payload }, { select, call, put }) {console.info(payload);
			var {data} = yield call(createOrder,payload.param);
			console.info('call : ',data);
			if(data && data.success ){
				var order = data.result,settlement = {};
				var settlements = order.settlements;
				console.info('settlements : ',settlements);
				if(settlements && settlements.length > 0 ){
					settlement = settlements[0];
				}
				console.info('result : ',order,settlement);
				yield put({type: 'setState',payload: {
					order: order,
					settlement:settlement,
		  		}})
			}
		},
		*createCashOrder({ payload }, { select, call, put }) {
			yield put({type: 'setState',payload: {
				order: order,
				settlement:settlement,
	  		}})
		},
		*forPay({ payload,callback }, { select, call, put }){
			yield put({type: 'setState',payload: {
				baseInfo: data.result
	  		}})
			if(callback)callback();
		}
	},

	//处理state
	reducers: {
		setState (state, {payload}) {
			return { ...state, ...payload,};
		},
		reset (state, {payload}) {
			return { order:{},settlement:{},};
		},
	},
};


