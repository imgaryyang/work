import { isEmpty, merge } from 'lodash';
import * as invoiceAdjustService from '../../services/finance/InvoiceAdjustService';
import { getOptions } from '../../services/UtilsService';

export default {
  namespace: 'invoiceAdjust',

  state: {
    namespace: 'invoiceAdjust',
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
    visible: false,
    dicts: {},
    searchObjs: {},
    formCache: {},
    invoiceType: '',
  },

  effects: {
    *load({ payload }, { select, call, put }) {
      const { query } = (payload || {});
      let { page } = (payload || {});
      const defaultPage = yield select(state => state.invoiceAdjust.defaultPage);
      page = { ...defaultPage, ...page };
      const { pageNo, pageSize } = page;
      const start = (pageNo - 1) * pageSize;

      yield put({ type: 'setSearchObjs', payload: query });
      yield put({ type: 'setState', payload: { invoiceType: query.invoiceType } });

      yield put({ type: 'toggleSpin' });
      const { data } = yield call(invoiceAdjustService.loadInvoicePage, start, pageSize, query);
      yield put({ type: 'toggleSpin' });

      if (data) {
        yield put({ type: 'init', data, page });
      }
    },
    *save({ params }, { select, call, put }) {
      yield put({ type: 'toggleSpin' });
      const record = yield select(state => state.utils.record);
      const query = yield select(state => state.invoiceAdjust.searchObjs);
      const { data } = yield call(invoiceAdjustService.saveInvoice, params);
      /* isEmpty(record) ? create : update */
      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: {
            visible: isEmpty(record),
            result: data,
          },
        });
        yield put({ type: 'load', payload: { query } });
      }
      yield put({ type: 'toggleSpin' });
    },
    *delete({ id }, { call, put }) {
      yield put({ type: 'toggleSpin' });
      const { data } = yield call(invoiceAdjustService.deleteInvoice, id);
      yield put({ type: 'toggleSpin' });
      if (data && data.success) {
        yield put({ type: 'load' });
      }
    },
    *loadDicts({ payload }, { call, put }) {
      const dicts = yield call(getOptions, [
        'INVOICE_TYPE', 'DEPT_TYPE', 'REG_STATE',
      ]);
      if (dicts) {
        yield put({
          type: 'setState',
          payload: { dicts },
        });
      }
    },
    *deleteSelected({ payload }, { select, call, put }) {
      const selectedRowKeys = yield select(state => state.invoiceAdjust.selectedRowKeys);
      yield put({ type: 'toggleSpin' });
      const { data } = yield call(invoiceAdjustService.deleteAllInvoices, selectedRowKeys);
      yield put({ type: 'toggleSpin' });
      if (data && data.success) {
        yield put({ type: 'load' });
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
    toggleVisible(state) {
      return { ...state, visible: !state.visible };
    },
    toggleSpin(state) {
      return { ...state, isSpin: !state.isSpin };
    },
    setState(state, { payload }) {
      return { ...state, ...payload };
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
        if (pathname === '/appointment/invoiceAdjust') {
          dispatch({
            type: 'load',
            payload: { query: { invoiceType: '1' } },
          });
        }
        if (pathname === '/charge/invoiceAdjust') {
          dispatch({
            type: 'load',
            payload: { query: { invoiceType: '2' } },
          });
        }
        dispatch({
          type: 'utils/initDicts',
          payload: ['DRUG_TYPE', 'INVOICE_TYPE'],
        });
      });
    },
  },
};
