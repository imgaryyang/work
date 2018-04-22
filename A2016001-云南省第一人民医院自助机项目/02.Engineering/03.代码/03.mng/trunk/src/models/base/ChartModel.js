import dva from 'dva';
import ajax from '../../utils/ajax';
import { loadCardCount, loadDepositAcount, loadPayFeeAcount } from '../../services/base/ChartService';
import baseUtil from '../../utils/baseUtil';

export default {
  namespace: 'chartManage',
  state: {
    issuCardCount:[],
    depositAcount:[],
    troubleCount: [],
    payFeeAcount: [],
  },

  effects: {
    *loadCardCount({ payload }, { call, put }) {
      const { data } = yield call(loadCardCount);
      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: {
        	  issuCardCount: data.result,
          },
        });
        
      } else if (data && data.msg) {
    	  
      }
    },
    *loadDepositAcount({ payload }, { call, put }){
    	const { data } = yield call(loadDepositAcount, payload);
        if (data && data.success) {
          yield put({
            type: 'setState',
            payload: {
            	depositAcount: data.result,
            },
          });  
        } else if (data && data.msg) {
      	  
        }
    },
    *loadPayFeeAcount({ payload }, { call, put }){
    	const { data } = yield call(loadPayFeeAcount);
        if (data && data.success) {
          yield put({
            type: 'setState',
            payload: {
            	payFeeAcount: data.result,
            },
          });  
        } else if (data && data.msg) {
      	  
        }
    },
  },
  reducers: {
    setState(oldState, { payload }) {
      return { ...oldState, ...payload };
    },
  },
};
