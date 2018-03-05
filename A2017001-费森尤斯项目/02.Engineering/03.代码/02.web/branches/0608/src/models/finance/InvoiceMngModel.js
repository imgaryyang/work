import _ from 'lodash';
import * as invoiceMngService from '../../services/finance/InvoiceMngService';

export default {
  namespace: 'invoiceMng',

  state: {
    namespace: 'invoiceMng',
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
    selectedTag: '1',
    invoiceStart: 0,
    invoiceAmount: 1,
  },

  effects: {
    *load({ payload }, { select, call, put }) {
      const { query } = (payload || {});
      let { page } = (payload || {});
      const defaultPage = yield select(state => state.invoiceMng.defaultPage);
      page = { ...defaultPage, ...page };
      const { pageNo, pageSize } = page;
      const start = (pageNo - 1) * pageSize;

      yield put({ type: 'toggleSpin' });
      const { data } = yield call(invoiceMngService.loadInvoicePage, start, pageSize, query);
      yield put({ type: 'getinvoiceStartNum', data });    // 获取起始号
      yield put({ type: 'toggleSpin' });

      if (data) {
        yield put({ type: 'init', data, page });
      }
    },
    *save({ params }, { call, put }) {
      yield put({ type: 'toggleSpin' });
      const { data } = yield call(invoiceMngService.saveInvoice, params);
      if (data && data.success) {
        yield put({ type: 'getinvoiceStartNum', data });    // 获取起始号
        yield put({ type: 'load' });
      }
      yield put({ type: 'setState', payload: { result: data } });
      yield put({ type: 'toggleSpin' });
    },
    *delete({ id }, { call, put }) {
      yield put({ type: 'toggleSpin' });
      const { data } = yield call(invoiceMngService.deleteInvoice, id);
      yield put({ type: 'toggleSpin' });
      if (data && data.success) {
        yield put({ type: 'load' });
      }
    },
    *deleteSelected({ payload }, { select, call, put }) {
      const selectedRowKeys = yield select(state => state.invoiceMng.selectedRowKeys);
      yield put({ type: 'toggleSpin' });
      const { data } = yield call(invoiceMngService.deleteAllInvoices, selectedRowKeys);
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

    setState(state, { payload }) {
      return { ...state, ...payload };
    },

    toggleSpin(state) {
      return { ...state, isSpin: !state.isSpin };
    },

    setSearchObjs(state, { payload: searchObj }) {
      if (searchObj) {
        const searchObjs = _.merge(state.searchObjs, searchObj);
        return { ...state, searchObjs };
      } else {
        return { ...state, searchObjs: {} };
      }
    },
    getinvoiceStartNum(state, { data }) {
      const { result } = data;
      let invoiceEnd = 0;
      if (!_.isNull(result) && !_.isUndefined(result)) {
        invoiceEnd = _.isArray(result)
        ? _.maxBy(result, o => o.invoiceEnd).invoiceEnd
        : result.invoiceEnd;
      }
      const invoiceStart = invoiceEnd + 1;
      return { ...state, invoiceStart };
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/finance/invoiceMng') {
          dispatch({
            type: 'load',
            payload: { query: { invoiceType: '1' } },
          });
          dispatch({
            type: 'utils/initDicts',
            payload: ['INVOICE_TYPE'],
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
