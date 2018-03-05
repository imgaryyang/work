import { merge } from 'lodash';
import { notification } from 'antd';
import { loadCheckInfoDetailPage, loadCheckInfoBillPage } from '../../services/pharmacy/CheckInfoService';

export default {
  namespace: 'checkInfoSearch',

  state: {
    query: {},
    page: { total: 0, pageSize: 10, pageNo: 1 },
    checkInfoPage: { total: 0, pageSize: 10, pageNo: 1 },
    searchObjs: {},
    checkInfoSearchObjs: {},
    checkInfoData: [],
    data: [],
    spin: false,
    record: null,
    selectedRowKeys: [],
    dicts: {},
    selectedTag: '',
    bill: '',
  },

  effects: {
    *loadCheckInfoBillPage({ payload }, { select, call, put }) {
      const { page, query } = (payload || {});
      const defaultPage = yield select(state => state.checkInfoSearch.page);
      const defaultQuery = yield select(state => state.checkInfoSearch.query);
      const newPage = { ...defaultPage, ...page };
      const { pageNo, pageSize } = newPage;
      const start = (pageNo - 1) * pageSize;
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(loadCheckInfoBillPage, start, pageSize, query || defaultQuery);
      yield put({ type: 'setState', payload: { spin: false, query } });
      if (data && data.success) {
        yield put({
          type: 'init',
          data,
          page: newPage,
        });
      }
    },
    *loadCheckInfo({ payload }, { select, call, put }) {
      const { page, query, record } = (payload || {});
      const defaultPage = yield select(state => state.checkInfoSearch.checkInfoPage);
      const defaultQuery = yield select(state => state.checkInfoSearch.query);
      const newPage = { ...defaultPage, ...page };
      const newQuery = { ...defaultQuery, ...query };
      const { pageNo, pageSize } = newPage;
      const start = (pageNo - 1) * pageSize;
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(loadCheckInfoDetailPage, start, pageSize, newQuery || defaultQuery);
      yield put({ type: 'setState', payload: { spin: false, query: newQuery } });
      if (data && data.success) {
        yield put({
          type: 'initCheckInfo',
          data,
          page: newPage,
        });
        if (record) {
          yield put({ type: 'setState', payload: { record } });
        }
      }
    },
  },

  reducers: {
    init(state, { data, page }) {
      const { result, total } = data;
      const p = { ...state.page, ...page, total };
      const datatmp = result || [];
      return { ...state, data: datatmp, page: p };
    },
    initCheckInfo(state, { data, page }) {
      const { result, total } = data;
      const p = { ...state.CheckInfoPage, ...page, total };
      const datatmp = result || [];
      return { ...state, checkInfoData: datatmp, checkInfoPage: p };
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
    setCheckInfoSearchObjs(state, { payload: checkInfoSearchObj }) {
      if (checkInfoSearchObj) {
        const checkInfoSearchObjs = merge(state.checkInfoSearchObjs, checkInfoSearchObj);
        return { ...state, checkInfoSearchObjs };
      } else {
        return { ...state, checkInfoSearchObjs: {} };
      }
    },
  },
};
