import { merge } from 'lodash';
import { inStoreDetailPage, inStoreBillPage } from '../../services/material/DirectInputService';

export default {
  namespace: 'instoredetail',

  state: {
    page: {
      total: 0,
      pageSize: 10,
      pageNo: 1,
    },
    selectedRowKeys: [],
    recordData: [],
    recordPage: {
      total: 0,
      pageSize: 10,
      pageNo: 1,
    },
    data: [],
    dicts: {},
    record: '',
    isSpin: false,
    visible: false,
    searchObjs: {},
    inBill: '',
    selectedTag: '',
    formCache: {},
  },

  effects: {
    /*
    加载入库单记录
     */
    *loadRecord({ payload }, { select, call, put }) {
      const { query } = (payload || {});
      let { page } = (payload || {});
      const defaultPage = yield select(state => state.instoredetail.recordPage);
      let searchObjs = yield select(state => state.instoredetail.searchObjs);
      searchObjs = { ...searchObjs, ...query };
      page = { ...defaultPage, ...page };
      const { pageNo, pageSize } = page;
      const start = (pageNo - 1) * pageSize;
      yield put({ type: 'setState', payload: { isSpin: true } });
      const { data } = yield call(inStoreBillPage, start, pageSize, searchObjs);
      yield put({ type: 'setState', payload: { isSpin: false } });
      if (data) {
        yield put({ type: 'initRecord', data, page });
      }
    },
    /*
    加载入库明细
     */
    *loadDetail({ payload }, { select, call, put }) {
      const { record } = (payload || {});
      let { page, query } = (payload || {});
      const defaultPage = yield select(state => state.instoredetail.page);
      let searchObjs = yield select(state => state.instoredetail.searchObjs);
      const inBill = yield select(state => state.instoredetail.inBill);
      if (query && query.inBill) {
        yield put({ type: 'setState', payload: { inBill: query.inBill } });
      } else {
        query = { inBill };
      }
      searchObjs = { ...searchObjs, ...query };
      page = { ...defaultPage, ...page };
      const { pageNo, pageSize } = page;
      const start = (pageNo - 1) * pageSize;
      yield put({ type: 'setState', payload: { isSpin: true, record } });
      const { data } = yield call(inStoreDetailPage, start, pageSize, searchObjs);
      yield put({ type: 'setState', payload: { isSpin: false } });
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

    initRecord(state, { data, page }) {
      const { result, total } = data;
      const resPage = { ...state.recordPage, ...page, total };
      const resData = result || [];
      return { ...state, recordData: resData, recordPage: resPage };
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
        if (pathname === '/material/inputDetail') {
          dispatch({
            type: 'load',
          });
          dispatch({
            type: 'utils/initDicts',
            payload: [
              'DRUG_TYPE', 'IN_TYPE', 'COMPANY_TYPE',
            ],
          });
        }
      });
    },
  },
};
