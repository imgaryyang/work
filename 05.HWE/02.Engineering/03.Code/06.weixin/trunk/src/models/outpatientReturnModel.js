import { findInpatientPaymentRecord } from '../services/outpatientReturnService';
import { refund } from '../services/paymentService';
import {Toast} from "antd-mobile/lib/index";

export default {

  namespace: 'outpatientReturn',
  state: {
    data: [],
  },

  subscriptions: {
    setup({ history, dispatch }) {
      return history.listen(({ pathname }) => {
        console.info('pathname ', pathname);
        if (pathname === '/outpatientReturn/outpatientRefundList') {
          dispatch({ type: 'findChargeList', payload: {} });
        }
      });
    },
  },

  effects: {
    *findChargeList({ payload }, { call, put, select }) {
      const { query } = payload;
      let pro = {};
      if (query) {
        pro = query;
      } else {
        const { profile } = yield select(state => state.base);
        pro = profile;
      }
      const { data } = yield call(findInpatientPaymentRecord, pro);
      if (data && data.success) {
        const { result } = data || {};
        yield put({
          type: 'save',
          payload: {
            data: result || [],
          },
        });
      }
    },
    *refund({ payload }, { call, put }) {
      const { query } = payload;
      const { data } = yield call(refund, query);
      if (data && data.success) {
        Toast.info('退款成功！', 5);
        yield put({
          type: 'findChargeList',
        });
      } else {
        Toast.info('退款失败请联系管理员！', 5);
      }
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
