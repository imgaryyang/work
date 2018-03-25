import { createBill, prePay, refund } from '../services/paymentService';

export default {

  namespace: 'payment',

  state: {
    bill: {},
    settlement: {},
  },

  subscriptions: {

  },

  effects: {
    *createBill({ payload, callback }, { call, put }) {
      const { bill } = payload;
      const { data } = yield call(createBill, bill);
      const { result } = data || {};
      yield put({
        type: 'save',
        payload: {
          bill: result || [],
        },
      });
      if (callback) callback();
    },
    *prePay({ payload, callback }, { call, put }) {
      console.log('paymentModel:prePay');
      const { settlement } = payload;
      const { data } = yield call(prePay, settlement);
      if (data && data.success) {
        const { result } = data || {};
        yield put({
          type: 'save',
          payload: {
            settlement: result || [],
          },
        });
      }
      if (callback) callback();
    },
    *refund({ payload, callback }, { call, put }) {
      const { settlement } = payload;
      const { data } = yield call(refund, settlement);
      if (data && data.success) {
        const { result } = data || {};
        yield put({
          type: 'save',
          payload: {
            settlement: result || [],
          },
        });
      }
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
