import { findInpatientPaymentRecord } from '../services/inpatientPaymentRecordService';

export default {

  namespace: 'inpatientPaymentRecord',
  state: {
    data: [],
  },

  subscriptions: {
    setup({ history, dispatch }) {
      return history.listen(({ pathname }) => {
        console.info('pathname ', pathname);
        if (pathname === '/inpatientPaymentRecord/inpatientPaymentRecordList') {
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
      console.log(pro);
      const { data } = yield call(findInpatientPaymentRecord, pro);
      const { result } = data || {};
      yield put({
        type: 'save',
        payload: {
          data: result || [],
        },
      });
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
