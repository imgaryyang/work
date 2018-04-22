import { notification } from 'antd';
import moment from 'moment';
import { loadRecords, loadDetailRecords, handleCallBack, handleCallSync } from '../../services/tran/TranService';

export default {
  namespace: 'refundTran',
  state: {
    spin: false,
    page: { total: 0, pageSize: 10, pageNo: 1 },
    query: {
      startDate: moment().format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
    },
    data: [],
    // 明细相关
    briefRecord: {},
    detailSpin: false,
    detailVisible: false,
    details: {
      his: [],
      order: [],
      settlements: [],
    },
  },
  effects: {
    /**
     * 载入关联交易记录
     */
    *load({ payload }, { call, put }) {
      const { startDate, endDate, ...rest } = (payload || {});
      yield put({
        type: 'setState',
        payload: { spin: true },
      });
      const { data } = yield call(loadRecords, startDate, endDate, { ...rest });
      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: {
            data: data.result,
            spin: false,
            query: payload,
          },
        });
      } else {
        notification.info({ message: '提示：', description: data.msg });
      }
    },
    /**
     * 载入明细
     */
    *loadDetails({ payload }, { select, call, put }) {
    	const { briefRecord } = (payload || {});
    	yield put({
    		type: 'setState',
    		payload: {
    			details: {order:[briefRecord], settlements:briefRecord.settlements, hisDetail: briefRecord.variables.his?[briefRecord.variables.his]:[]},
    			detailVisible: true,
    			detailSpin: false,
    		},
    	});
    },
    *cashCallBack({ payload }, { select, call, put }) {
		const {settlements} = payload;
		const settlement = settlements[0];
		if(!settlement || settlement.status!='0' || settlement.payChannelCode!='0000'){
			console.info(settlement)
			notification.error({message: '错误',description:"现金补录错误,请核对后重试！"});
			return;
		}
		
		var {data} = yield call(cashCallBack, settlement);
		if (data && data.success && data ) {
			var settle = data.result;
			if(!settle || !settle.order){
				notification.error({message: '错误',description:"现金补录失败,请核对后重试!"});
			}else{
				var order = settle.order;
				if(order.status ==  'A'){
					notification.error({message: '错误',description:"现金补录失败,订单状态为 A,请核对后重试!"});
				}else if(order.status !=  '0'){
					notification.error({message: '错误',description:"现金补录失败,第三方交易错误,请核对后重试!"});
				} else {
			        yield put({
			          type: 'setState',
			          payload: {
			        	  detailSpin: false,
			              detailVisible: false,
			              briefRecord: {},
			          },
			        });
			        
			        const query = yield select(state => state.refundTran.query);
			        yield put({
			            type: 'load',
			            payload: {...query},
			        });
				}
			}
    	}else if(data && data.msg ){
    		notification.error({message: '错误',description:data.msg });
    	}else{
    		notification.error({message: '错误',description:'现金补录失败,请核对后重试!'});
    	}
	},
	
	*thirdCallSync({ payload }, { select, call, put }) {
		const {settlements} = payload;
		const settlement = settlements[0];
		if(!settlement || settlement.payChannelCode=='0000'){
			notification.error({message: '错误',description:"交易同步错误,请核对后重试！"});
			return;
		}
		
		var {data} = yield call(thirdCallSync, settlement);
		if (data && data.success && data ) {
			var settle = data.result;
			if(!settle || !settle.order){
				notification.error({message: '错误',description:"交易同步失败,请核对后重试!"});
			}else{
				var order = settle.order;
				if(order.status ==  'A'){
					notification.error({message: '错误',description:"交易同步失败,订单状态为 A,请核对后重试!"});
				}else if(order.status !=  '0'){
					notification.error({message: '错误',description:"交易同步失败,第三方交易错误,请核对后重试!"});
				} else {
					yield put({
			          type: 'setState',
			          payload: {
			        	  detailSpin: false,
			              detailVisible: false,
			              briefRecord: {},
			          },
			        });
			        
			        const query = yield select(state => state.refundTran.query);
			        yield put({
			            type: 'load',
			            payload: {...query},
			        });
				}
			}
    	}else if(data && data.msg ){
    		notification.error({message: '错误',description:data.msg });
    	}else{
    		notification.error({message: '错误',description:'交易同步错误,请核对后重试！'});
    	}
	},
	
	*cancelRefund({ payload }, { select, call, put }) {
		const {settlements} = payload;
		const settlement = settlements[0];
		if(!settlement || settlement.payChannelCode=='0000'){
			notification.error({message: '错误',description:"撤销退款失败,请核对后重试！"});
			return;
		}
		
		var {data} = yield call(cancelRefund, settlement);
		if (data && data.success && data ) {
			var settle = data.result;
			if(!settle || !settle.order){
				notification.error({message: '错误',description:"撤销退款失败,请核对后重试!"});
			}else{
				var order = settle.order;
				if(order.status !=  '0'){
					notification.error({message: '错误',description:"撤销退款失败,订单状态不为0,请核对后重试!"});
				} else {
					yield put({
			          type: 'setState',
			          payload: {
			        	  detailSpin: false,
			              detailVisible: false,
			              briefRecord: {},
			          },
			        });
			        
			        const query = yield select(state => state.refundTran.query);
			        yield put({
			            type: 'load',
			            payload: {...query},
			        });
				}
			}
    	}else if(data && data.msg ){
    		notification.error({message: '错误',description:data.msg });
    	}else{
    		notification.error({message: '错误',description:'撤销退款失败,请核对后重试！'});
    	}
	},
  },
  reducers: {
    setState(oldState, { payload }) {
      return { ...oldState, ...payload };
    },
  },
};
