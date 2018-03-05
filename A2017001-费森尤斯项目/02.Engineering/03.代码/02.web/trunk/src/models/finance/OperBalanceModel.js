import { merge } from 'lodash';
import * as operBalanceService from '../../services/finance/OperBalanceService';

export default {
  namespace: 'operBalance',

  state: {
    namespace: 'operBalance',
    defaultPage: {
      total: 0,
      pageSize: 10,
      pageNo: 1,
    },
    selectedRowKeys: [],
    data: [],
    record: {},
    result: {},
    isSpin: false,
    dicts: {},
    searchObjs: {},
    visible: false,
    selectedTag: {},
  },

  effects: {
    *update({ id }, { call, put }) {
      yield put({ type: 'toggleSpin' });
      const { data } = yield call(operBalanceService.update, id);
      yield put({ type: 'toggleSpin' });
      if (data && data.success) {
        yield put({ type: 'load' });
      }
    },
    *save({ params }, { call, put }) {
      yield put({ type: 'toggleSpin' });
      const { data } = yield call(operBalanceService.save, params);
      if (data && data.success) {
        yield put({ type: 'setState', payload: { record: {} } });
        yield put({ type: 'load' });
      }
      yield put({ type: 'toggleSpin' });
    },
    *load({ payload }, { select, call, put }) {
      const { query } = (payload || {});
      let { page } = (payload || {});
      const defaultPage = yield select(state => state.operBalance.defaultPage);
      page = { ...defaultPage, ...page };
      const { pageNo, pageSize } = page;
      const start = (pageNo - 1) * pageSize;

      yield put({ type: 'toggleSpin' });
      const { data } = yield call(operBalanceService.loadPage, start, pageSize, query);
      yield put({ type: 'toggleSpin' });

      if (data) {
        yield put({ type: 'init', data, page });
      }
    },
  },

  reducers: {
    init(state, { data, page }) {
      const { result, total } = data;
      const resPage = { ...state.page, ...page, total };
      const resData = result || [];
      return { ...state, data: resData, page: resPage };
    },

    setState(state, { payload }) {
      return { ...state, ...payload };
    },

    toggleSpin(state) {
      return { ...state, isSpin: !state.isSpin };
    },
    toggleVisible(state) {
      return { ...state, visible: !state.visible };
    },
    setSearchObjs(state, { payload: searchObj }) {
      if (searchObj) {
        const searchObjs = merge(state.searchObjs, searchObj);
        return { ...state, searchObjs };
      } else {
        return { ...state, searchObjs: {} };
      }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/finance/operBalance') {
          dispatch({
            type: 'load',
            payload: { query: { invoiceType: '', isCheck: false } },
          });
          dispatch({
            type: 'utils/initDicts',
            payload: ['INVOICE_TYPE', 'IS_CHECK'],
          });
          dispatch({
            type: 'utils/initDataSource',
            payload: ['hcpUserCashier'],
          });
        }
      });
    },
  },
};
