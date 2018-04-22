import dva from 'dva';
import moment from 'moment';
import {loadOrders,reportExp} from '../../services/OrderService';
import baseUtil from '../../utils/baseUtil';
export default {

	namespace: 'order',

	state: {
		orders:[],
		settles:[],
		page: { start: 0, pageSize: 8, total:0, pageNo: 1 },
	},
		  
	subscriptions: {},
	effects: {
		*loadOrders({ payload, callback }, { select, call, put }) {//预存订单
			const { query } = payload;//
			console.info("loadOrders", query)
			var { data } = yield call(loadOrders, query);//初始化
	    	if( data && data.success ){//卡不存在,语音提示
	    		const { result,total,start,pageSize } = data;//
	    		yield put({
		  			type: 'setState',
		  			payload: {
		  				orders:data.result||[],
		  				page:{total, start, pageSize},
		  			},
		  		})
	    	}else if(data && data.msg){
	    		baseUtil.error(data.msg);
	    	}else{
	    		baseUtil.error('加载订单出错');
	    	}
		},
		
		*reportExp({ payload , callback}, { select, call, put }) {
			const { order } = payload;//
			const page = yield select(state => state.page);
			console.info(page);
			var { data } = yield call(reportExp, order);//
			if( data && data.success ){//
				yield put({
					type: 'loadOrders',
					payload: { query:{...order, ...page}}
				});
			}else if (data && data.msg){
				baseUtil.error(data.msg);
			}else{
				baseUtil.error('异常申报错误');
			}
		},
	    *setState({ payload ,callback}, { select, call, put }) {
	    	yield put({
    			type: 'changeState',
    			payload: payload
    		});
	    	if(callback) callback();
		},
	},
	reducers: {
		"reset"(state,{ payload}) {
			return {
				orders:[],
				page: { start: 0, limit: 8, pageNo: 1 }
			};
		},
		"changeState"(state,{ payload}) {
			return {...state,...payload};
		},
	},
};