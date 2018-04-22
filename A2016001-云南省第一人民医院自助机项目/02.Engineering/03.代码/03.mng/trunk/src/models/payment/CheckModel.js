import { notification } from 'antd';
import { loadChecks, loadDetails, handleSyncFile, handleImport, handleCheck } from '../../services/payment/CheckService';
import { cancelRefund, thirdSync } from '../../services/tran/TranService';

export default {

  namespace: 'check',

  state: {
	  checkList:[],
	  checkPage: { total: 0, pageSize: 10, pageNo: 1 },
	  checkQuery: {},
   
	  checkRecord:{},
   
	  detailPage: { total: 0, pageSize: 10, pageNo: 1 },
	  detailQuery: {},
	  details: [],
	  detail: {},
	  spin: false,
	  visible: false,
	  detailSpin: false,
	  detailVisible: false,
	  importDetailSpin: false,
	  importDetailVisible: false,
  },

  effects: {
    *loadChecks({ payload }, { select, call, put }) {
      const { checkQuery, page } = payload ||{};
      const defaultQuery = yield select(state => state.check.checkQuery);
      const defaultPage = yield select(state => state.check.checkPage);
      const { pageSize, pageNo } = {...defaultPage, ...page};
      var start = (pageNo-1)*pageSize ;
      var limit = pageSize ;
      var param = checkQuery || defaultQuery;
      yield put({ 
    	  type: 'setState',
    	  payload: {
    		  spin: true ,
    		  checkQuery: param,
    	  }
      });
      const { data } = yield call(loadChecks, start, limit, param);
      yield put({ type: 'setState', payload: { spin: false } });
      if (data && data.success) {
    	  var { total, result } = data;
    	  let p = { ...defaultPage, ...page, total:total };
    	  yield put({
    		  type : 'setState',
    		  payload : { checkList: result||[], checkPage:p},
    	  })
      }
    },
    *loadDetails({ payload }, { select, call, put }) {
	  const { detailQuery, page, checkRecord } = payload || {};
	  const defaultQuery = yield select(state => state.check.detailQuery);
      const defaultPage = yield select(state => state.check.detailPage);
      const defaultRecord = yield select(state => state.check.checkRecord);
      const { pageSize, pageNo } = {...defaultPage, ...page};
      var start = (pageNo-1)*pageSize ;
      var limit = pageSize ;
      var param = detailQuery || defaultQuery;
      var record = checkRecord || defaultRecord;
      yield put({ 
    	  type: 'setState',
    	  payload: {
    		  checkRecord: record,
    		  detailSpin: true ,
    		  defaultQuery: {...param, checkRecord: record.id},
    	  }
      });
      
      const { data } = yield call(loadDetails, start, limit, {...param, checkRecord: record.id});
      
      yield put({ type: 'setState', payload: { spin: false } });
      if (data && data.success) {
    	  var { total, result } = data;
    	  let p = { ...defaultPage, ...page, total:total };
    	  yield put({
    		  type : 'setState',
    		  payload : { detailSpin: false, details: result||[], detailPage: p},
    	  })
      }
    },
    *cancelRefund({ payload }, { select, call, put }) {
		const { settlement } = payload;
		if(!settlement || !settlement.settleNo){
			notification.error({message: '错误',description:"撤销退款失败,请核对后重试！"});
			return;
		}
		
		var {data} = yield call(cancelRefund, settlement);
		if (data && data.success && data ) {
			var settle = data.result;
			var order = settle.order;
			if(order.status != '9'){
				notification.error({message: '错误',description:"撤销退款失败,订单状态不为关闭,请核对后重试!"});
			} else {
				notification.success({message: '成功',description:settle.settleNo +" 撤销退款" + settle.amt +" 成功！"});
			}
    	}else if(data && data.msg ){
    		notification.error({message: '错误',description:data.msg });
    	}else{
    		notification.error({message: '错误',description:'撤销退款失败,请核对后重试！'});
    	}
	},
	*thirdSync({ payload }, { select, call, put }) {
		const {settlement} = payload;
		if(!settlement || !settlement.settleNo){
			notification.error({message: '错误',description:"交易同步错误,请核对后重试！"});
			return;
		}
		
		var {data} = yield call(thirdSync, settlement);
		if (data && data.success && data ) {
			var settle = data.result;
			if(!settle || !settle.order){
				notification.error({message: '错误',description:"交易同步失败,请核对后重试!"});
			}else{
				var order = settle.order;
				if(order.status !=  '0'){
					notification.error({message: '错误',description:"交易同步失败,第三方交易错误,请核对后重试!"});
				} else {
					notification.success({message: '成功',description:settle.settleNo +" 交易同步" + settle.settleNo +" 成功！"});
				}
			}
    	}else if(data && data.msg ){
    		notification.error({message: '错误',description:data.msg });
    	}else{
    		notification.error({message: '错误',description:'交易同步错误,请核对后重试！'});
    	}
	},
	*handleSyncFile({ payload }, { select, call, put }) {
		const {checkRecord} = payload;
		if(!checkRecord || !checkRecord.id){
			notification.error({message: '错误',description:"手工下载对账文件参数错误,请核对后重试！"});
			return;
		}
		yield put({ 
			type: 'setState',
			payload: {
				detailSpin: true ,
			}
		});
		var {data} = yield call(handleSyncFile, checkRecord);
		if (data && data.success && data ) {
			notification.success({message: '成功',description:"手工下载对账文件成功！"});
			yield put({ 
				type: 'setState',
				payload: {
					detailSpin: false ,
				}
			});
			yield put({ 
		    	  type: 'loadDetails',
				  payload: { page: {pageNo: 1}, },
			});
    	}else if(data && data.msg ){
    		notification.error({message: '错误',description:data.msg });
    	}else{
    		notification.error({message: '错误',description:'手工下载对账文件错误,请核对后重试！'});
    	}
	},
	*handleImport({ payload }, { select, call, put }) {
		const {checkRecord} = payload;
		if(!checkRecord || !checkRecord.id){
			notification.error({message: '错误',description:"手工导入对账数据参数错误,请核对后重试！"});
			return;
		}
		yield put({ 
			type: 'setState',
			payload: {
				detailSpin: true ,
			}
		});
		var {data} = yield call(handleImport, checkRecord);
		if (data && data.success && data ) {
			notification.success({message: '成功',description:"手工导入对账数据成功！"});
			yield put({ 
				type: 'setState',
				payload: {
					detailSpin: false ,
				}
			});
			yield put({ 
		    	  type: 'loadDetails',
				  payload: { page: {pageNo: 1}, },
			});
    	}else if(data && data.msg ){
    		notification.error({message: '错误',description:data.msg });
    	}else{
    		notification.error({message: '错误',description:'手工导入对账数据错误,请核对后重试！'});
    	}
	},
	*handleCheck({ payload }, { select, call, put }) {
		const {checkRecord} = payload;
		if(!checkRecord || !checkRecord.id){
			notification.error({message: '错误',description:"手工对账参数错误,请核对后重试！"});
			return;
		}
		yield put({ 
			type: 'setState',
			payload: {
				detailSpin: true ,
			}
		});
		var {data} = yield call(handleCheck, checkRecord);
		if (data && data.success && data ) {
			notification.success({message: '成功',description:"手工对账成功！"});
			yield put({ 
				type: 'setState',
				payload: {
					detailSpin: false ,
				}
			});
			yield put({ 
		    	  type: 'loadDetails',
				  payload: { page: {pageNo: 1}, },
			});
    	}else if(data && data.msg ){
    		notification.error({message: '错误',description:data.msg });
    	}else{
    		notification.error({message: '错误',description:'手工对账错误,请核对后重试！'});
    	}
	},
  },

  reducers: {

    init(state, { data, page }) {
      const { result, total } = data;
      const p = { ...state.page, ...page, total };
      const users = result || [];
      return { ...state, data: users, page: p };
    },

    setState(oldState, { payload }) {
      return { ...oldState, ...payload };
    },

  },
};
