import { notification } from 'antd';
import moment from 'moment';
import { loadRecords, loadDetailRecords, cashSubmit,tranAdd } from '../../services/tran/TranService';

export default {
  namespace: 'cashTran',
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
    additionalVisible: false,
    additionalSpin: false,
  },
  effects: {
    /**
     * 载入关联交易记录
     */
    *load({ payload }, {select, call, put }) {
    	  const query = yield select(state => state.cashTran.query);
	      const { startDate, endDate, ...rest } = (payload || query);
	      yield put({
	        type: 'setState',
	        payload: { spin: true },
	      });
	      const { data } = yield call(loadRecords, startDate, endDate, { ...rest });
	      yield put({
	        type: 'setState',
	        payload: { spin: false },
	      });
	      if (data && data.success) {
	        yield put({
	          type: 'setState',
	          payload: {
	            data: data.result,
	            query: payload || query,
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
			notification.error({message: '错误',description:"现金补录错误,请核对后重试！"});
			return;
		}
		
		const {data} = yield call(cashSubmit, settlement);
		if (data && data.success && data ) {
			var settle = data.result;
			if(!settle || !settle.order){
				notification.error({message: '错误',description:"现金补录失败,请核对后重试!"});
			}else{
				var order = settle.order;
				if(order.status ==  'A'){
					notification.error({message: '错误',description:"现金补录失败,订单状态为 A,请核对后重试!"});
				} else if(order.status !=  '0'){
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
				}
			}
    	}else if(data && data.msg ){
    		notification.error({message: '错误',description:data.msg });
    	}else{
    		notification.error({message: '错误',description:'现金补录失败,请核对后重试!'});
    	}
		yield put({
            type: 'load',
        });
	},
	
	*tranAdditional({ payload }, { select, call, put }) {
		const {patientNo, settle} = payload;
		const { data } = yield call(tranAdd, patientNo, settle);
		if (data && data.success) {
			yield put({
				type: 'setState',
				payload: {
					additionalVisible: false,
				    additionalSpin: false,
				},
			});
		}else if(data && data.msg ){
    		notification.error({message: '错误',description:data.msg });
    	}else{
    		notification.error({message: '错误',description:'补录失败,请核对后重试!'});
    	}
		yield put({
            type: 'load',
        });
	},
  },
  reducers: {
    setState(oldState, { payload }) {
      return { ...oldState, ...payload };
    },
  },
};
