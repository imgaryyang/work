import { findInpatientDailyList } from '../services/inpatientService.js';

export default {

  namespace: 'inpatientDaily',
  state: {
    data: [],
    isLoading: false,
  },

  subscriptions: {
  },

  effects: {
    *findInpatientDaily({ payload }, { call, put }) {
      yield put({ type: 'setState', payload: { isLoading: true } });
      const { data } = yield call(findInpatientDailyList, payload);
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
