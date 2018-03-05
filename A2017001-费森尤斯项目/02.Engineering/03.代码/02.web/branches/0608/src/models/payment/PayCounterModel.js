import * as PayService from '../../services/payment/PayService';

export default {
  namespace: 'payCounter',

  state: {
    current: 1,
    result: {},
    payInfo: {},
    isVisible: false,
    isPaying: false,
    isDone: '',
    payResult: {},
  },

  effects: {
    *createOrder({ payload }, { call, put }) {
      const { orderNo, amt } = (payload || {});
      const { data } = yield call(PayService.createOrder, orderNo, amt);
      if (data && data.success) {
        yield put({ type: 'setState', payload: { payInfo: data.result } });
        yield put({ type: 'setState', payload: { isVisible: true } });
      }
    },
    *createSettlement({ payload }, { call, put }) {
      const { orderNo, amt, payChannelCode, namespace } = (payload || {});
      yield put({ type: 'togglePaying' });
      const { data } = yield call(PayService.createSettlement, orderNo, amt, payChannelCode);
      if (data && data.success) {
        yield put({ type: 'setState', payload: { payResult: data.result } });
        yield put({ type: 'setState', payload: { current: 2, isDone: true } });
      } else {
        yield put({ type: 'setState', payload: { isDone: false } });
      }
      yield put({ type: `${namespace}/setState`, payload: { payResult: data } });
      yield put({ type: 'togglePaying' });
    },
    *removeOrder({ payload }, { call }) {
      const { orderNo } = (payload || {});
      yield call(PayService.removeOrder, orderNo);
    },
  },

  reducers: {
    setState(oldState, { payload }) {
      return { ...oldState, ...payload };
    },

    toggleVisible(state) {
      return { ...state, isVisible: !state.isVisible };
    },

    togglePaying(state) {
      return { ...state, isPaying: !state.isPaying };
    },

    resetPayInfo(state) {
      return { ...state, payInfo: {}, isDone: '', current: 1 };
    },
  },
};
