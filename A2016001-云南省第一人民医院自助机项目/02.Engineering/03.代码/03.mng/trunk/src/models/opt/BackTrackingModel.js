import { notification } from 'antd';
import moment from 'moment';
import { loadRecords, loadDetailRecords, handleCallBack, handleCallSync } from '../../services/opt/BackTrackingService';

export default {
  namespace: 'backTracking',
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
    settlementsPage: { total: 0, pageSize: 10, pageNo: 1 },
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
      
      
//      // 取现有的翻页对象
//      const defaultPage = yield select(state => state.backTracking.settlementsPage);
//      const newPage = { ...defaultPage, ...(page || {}) };
//      // console.log(newPage);
//      const { pageNo, pageSize } = newPage;
//      const start = startFrom0 ? 0 : (pageNo - 1) * pageSize;
//      yield put({ type: 'setState',
//        payload: {
//          briefRecord,
//          detailVisible: true,
//          detailSpin: false,
//        },
//      });
//      // 调用载入数据
//      console.log('briefRecord:', briefRecord);
//      const { data } = yield call(
//        loadDetailRecords,
//        start,
//        pageSize,
//        {
//          hisDetailId: briefRecord && briefRecord.bizNo ? briefRecord.bizNo : null,
//          orderId: briefRecord && briefRecord.orderId ? briefRecord.orderId : null,
//        },
//      );
//
//      if (data && data.success) {
//        yield put({
//          type: 'setState',
//          payload: {
//            details: data.result,
//            settlementsPage: { pageNo: startFrom0 ? 1 : pageNo, pageSize, total: data.result.settlements.total },
//            detailSpin: false,
//          },
//        });
//      } else {
//        notification.error({
//          message: '错误',
//          description: `${data.msg || '查询厂商列表信息出错！'}`,
//        });
//        // 显示加载指示器
//        yield put({ type: 'toggleSpin' });
//      }
    },
    *handleCallBack({ payload }, { select, call, put }) {
		const {settlements} = payload;
		const settlement = settlements[0];
		if(!settlement || settlement.status!='0' || settlement.payChannelCode!='0000'){
			console.info(settlement)
			notification.error({message: '错误',description:"现金补录错误,请核对后重试！"});
			return;
		}
		
		var {data} = yield call(handleCallBack, settlement);
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
			        
			        const query = yield select(state => state.backTracking.query);
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
	
	*handleCallSync({ payload }, { select, call, put }) {
		const {settlements} = payload;
		const settlement = settlements[0];
		if(!settlement || settlement.payChannelCode=='0000'){
			notification.error({message: '错误',description:"交易同步错误,请核对后重试！"});
			return;
		}
		
		var {data} = yield call(handleCallSync, settlement);
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
			        
			        const query = yield select(state => state.backTracking.query);
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
  },
  reducers: {
    setState(oldState, { payload }) {
      return { ...oldState, ...payload };
    },
  },
};
