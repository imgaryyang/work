import { findPaymentRecord } from '../services/paymentRecordService';

export default {

  namespace: 'paymentRecord',
  state: {
    data: [],
  },

  subscriptions: {
    setup({ history, dispatch }) {
      return history.listen(({ pathname }) => {
        console.info('pathname ', pathname);
        if (pathname === '/paymentRecord/paymentRecordList') {
          dispatch({ type: 'findChargeList', payload: {} });
        }
      });
    },
  },

  effects: {
    *findChargeList({ payload }, { call, put, select }) {
      const { query } = payload;
      console.log('1')
      let pro = {};
      if (query) {
        console.log('2');
        pro = query;
      } else {
        console.log('3');
        const { currProfile: profile } = yield select(state => state.base);
        pro = profile;
      }
      console.log('4');
      if (JSON.stringify(pro) !== '{}') {
        console.log('5');
        const { data } = yield call(findPaymentRecord, pro);
        const { result } = data || {};
        console.log('6');
        yield put({
          type: 'save',
          payload: {
            data: result || [],
          },
        });
      }
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
