import { Toast } from 'antd-mobile/lib/index';
import { findInpatientPaymentRecord } from '../services/outpatientReturnService';
import { refund } from '../services/paymentService';

export default {

  namespace: 'outpatientReturn',
  state: {
    data: [],
    refundDetailData: {},
    isLoading: false,
  },

  subscriptions: {
    setup({ history, dispatch }) {
      return history.listen(({ pathname }) => {
        // console.info('pathname ', pathname);
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
        const { currProfile: profile } = yield select(state => state.base);
        pro = profile;
      }
      if (JSON.stringify(pro) !== '{}') {
        yield put({ type: 'setState', payload: { isLoading: true } });
        const { data } = yield call(findInpatientPaymentRecord, pro);
        if (data && data.success) {
          const { result } = data || {};
          yield put({
            type: 'save',
            payload: {
              data: result || [],
              isLoading: false,
            },
          });
        } else if (data && data.msg) {
          yield put({ type: 'setState', payload: { isLoading: false, data: [] } });
          Toast.fail(`请求数据出错：${data.msg}`, 1);
        } else {
          Toast.info('请求数据出错');
          yield put({ type: 'setState', payload: { isLoading: false, data: [] } });
        }
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
    *setRefundDetailData({ payload, callback }, { put }) {
      yield put({
        type: 'save',
        payload: {
          refundDetailData: payload,
        },
      });
      if (callback) callback();
    }
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    setState(state, { payload }) {
      return { ...state, ...payload };
    },
  },

};
