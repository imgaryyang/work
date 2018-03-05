import { isEmpty } from 'lodash';
import * as RegCheckoutService from '../../services/appointment/RegCheckoutService';

export default {
  namespace: 'regCheckout',

  state: {
    invoiceSource: '',
    data: [],
    record: {},
    isSpin: false,
    checkResult: {},
    unCheckResult: {},
    feeType: [],
    payWay: [],
    activeTab: '1',
  },

  effects: {
    *load({ payload }, { call, put }) {
      const { activeTab, invoiceSource } = payload || {};
      const activeService = activeTab === '1'
        ? RegCheckoutService.getUnCheckoutInfo
        : RegCheckoutService.getCheckoutInfo;
      yield put({ type: 'setState', payload: { activeTab, invoiceSource, record: {}, feeType: [], payWay: [] } });
      yield put({ type: 'toggleSpin' });
      const { data } = yield call(activeService, invoiceSource);
      yield put({ type: 'toggleSpin' });
      if (data.success && !isEmpty(data.result)) {
        const { feeType, payWay, ...record } = data.result;
        yield put({ type: 'setState', payload: { record, feeType, payWay } });
      }
    },
    *checkOut({ params }, { call, put }) {
      yield put({ type: 'toggleSpin' });
      const { data } = yield call(RegCheckoutService.checkout, params);
      yield put({ type: 'setState', payload: { checkResult: data } });
      yield put({ type: 'toggleSpin' });
    },
    *unCheckout({ params }, { call, put }) {
      yield put({ type: 'toggleSpin' });
      const { data } = yield call(RegCheckoutService.unCheckout, params);
      yield put({ type: 'setState', payload: { unCheckResult: data } });
      yield put({ type: 'toggleSpin' });
    },
  },

  reducers: {
    setState(state, { payload }) {
      return { ...state, ...payload };
    },

    toggleSpin(state) {
      return { ...state, isSpin: !state.isSpin };
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/appointment/regCheckout') {
          dispatch({
            type: 'load',
            payload: { activeTab: '1', invoiceSource: '1' },
          });
        }
        if (pathname === '/charge/chargeCheckout') {
          dispatch({
            type: 'load',
            payload: { activeTab: '1', invoiceSource: '2' },
          });
        }
        dispatch({
          type: 'utils/initDicts',
          payload: ['FEE_CODE', 'PAY_MODE'],
        });
      });
    },
  },
};
