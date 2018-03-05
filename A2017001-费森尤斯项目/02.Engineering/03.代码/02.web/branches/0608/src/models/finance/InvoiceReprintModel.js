import { merge } from 'lodash';
import baseUtil from '../../utils/baseUtil';
import { loadInvoicePage, loadChargeDetailPage, loadPayWayPage, refund, reprint } from '../../services/finance/InvoiceReprintService';

export default {
  namespace: 'invoiceReprint',

  state: {
    query: {},
    page: { total: 0, pageSize: 10, pageNo: 1 },
    data: [],
    detailQuery: {},
    detailPage: { total: 0, pageSize: 10, pageNo: 1 },
    detailData: [],
    payWayQuery: {},
    payWayPage: { total: 0, pageSize: 10, pageNo: 1 },
    payWayData: [],
    payWayVisible: false,
    refundVisible: false,
    spin: false,
    record: null,
  },

  effects: {
    *load({ payload }, { select, call, put }) {
      const { page, query } = (payload || {});
      const defaultQuery = yield select(state => state.invoiceReprint.query);
      const newQuery = query || defaultQuery;
      const defaultPageSize = yield select(state => state.invoiceReprint.page.pageSize);
      const newPage = page || { total: 0, pageSize: defaultPageSize, pageNo: 1 };
      // const defaultPage = yield select(state => state.invoiceReprint.page);
      // const newPage = { ...defaultPage, ...page };
      // if (newSearch) newPage.pageNo = 1;
      const start = (newPage.pageNo - 1) * newPage.pageSize;

      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(loadInvoicePage, start, newPage.pageSize, newQuery);
      yield put({ type: 'setState', payload: { spin: false, query: newQuery } });

      if (data) {
        yield put({
          type: 'init',
          data,
          page: newPage,
        });
      }
    },

    *loadDetail({ payload }, { select, call, put }) {
      const { page, query } = (payload || {});
      const defaultQuery = yield select(state => state.invoiceReprint.detailQuery);
      const newQuery = query || defaultQuery;
      const defaultPageSize = yield select(state => state.invoiceReprint.page.pageSize);
      const newPage = page || { total: 0, pageSize: defaultPageSize, pageNo: 1 };
      const start = (newPage.pageNo - 1) * newPage.pageSize;

      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(loadChargeDetailPage, start, newPage.pageSize, newQuery);
      yield put({ type: 'setState', payload: { spin: false, detailQuery: newQuery } });

      if (data) {
        yield put({ type: 'initDetail', data, page: newPage });
      }
    },

    *loadPayWay({ payload }, { select, call, put }) {
      const { page, query, onRefund } = (payload || {});
      const defaultQuery = yield select(state => state.invoiceReprint.payWayQuery);
      const newQuery = query || defaultQuery;
      const defaultPageSize = yield select(state => state.invoiceReprint.page.pageSize);
      const newPage = page || { total: 0, pageSize: defaultPageSize, pageNo: 1 };
      const start = (newPage.pageNo - 1) * newPage.pageSize;

      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(loadPayWayPage, start, newPage.pageSize, newQuery);
      yield put({ type: 'setState', payload: { spin: false, payWayQuery: newQuery } });
      if (onRefund) {
        yield put({ type: 'setState', payload: { refundVisible: true } });
      } else {
        yield put({ type: 'setState', payload: { payWayVisible: true } });
      }
      if (data) {
        yield put({ type: 'initPayWay', data, page: newPage });
      }
    },

    *refund({ payload }, { call, put }) {
      yield put({ type: 'setState', payload: { spin: true } });
      try { // 测超时
        const { data } = yield call(refund, payload);
        if (data && data.success) {
          yield put({ type: 'setState', payload: { refundVisible: false, payWayData: null } });
          yield put({ type: 'load' });
        } else {
          baseUtil.alert(data.msg);
        }
      } catch (e) {
        
      }
      yield put({ type: 'setState', payload: { spin: false } });
    },

    *reprint({ payload, callback }, { call, put }) {
      yield put({ type: 'setState', payload: { spin: true } });
      try { // 测超时
        const { data } = yield call(reprint, payload);
        if (data && data.success) {
          yield put({ type: 'setState', payload: { record: null } });
          yield put({ type: 'load' });
          if (callback) callback(payload.regId);
        } else if (data && data.msg) {
          baseUtil.alert(data.msg);
        } else {
          baseUtil.alert('不明错误');
        }
      } catch (e) {
        
      }
      yield put({ type: 'setState', payload: { spin: false } });
    },
  },

  reducers: {
    init(state, { data, page }) {
      const { result, total } = data;
      const p = { ...state.page, ...page, total };
      const datatmp = result || [];
      return { ...state, data: datatmp, page: p };
    },

    initDetail(state, { data, page }) {
      const { result, total } = data;
      const p = { ...state.page, ...page, total };
      const datatmp = result || [];
      return { ...state, detailData: datatmp, detailPage: p };
    },

    initPayWay(state, { data, page }) {
      const { result, total } = data;
      const p = { ...state.page, ...page, total };
      const datatmp = result || [];
      return { ...state, payWayData: datatmp, payWayPage: p };
    },

    mergeQuery(state, { payload: searchObj }) {
      if (searchObj) {
        const query = merge(state.query, searchObj);
        return { ...state, query };
      } else {
        return { ...state, query: {} };
      }
    },

    setState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
