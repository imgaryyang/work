import { findInpatientBill } from '../services/inpatientService';

export default {

  namespace: 'inpatientBill',

  state: {
    data: {},
    isLoading: false,
  },

  subscriptions: {
  },

  effects: {
    *findInpatientBill({ payload }, { call, put }) {
      yield put({ type: 'setState', payload: { isLoading: true } });
      const { data } = yield call(findInpatientBill, payload);
      const { result } = data || {};
      yield put({
        type: 'setState',
        payload: {
          data: result || {},
          isLoading: false,
        },
      });
    },
  },

  reducers: {
    setState(state, { payload }) {
      return { ...state, ...payload };
    },
  },

};
