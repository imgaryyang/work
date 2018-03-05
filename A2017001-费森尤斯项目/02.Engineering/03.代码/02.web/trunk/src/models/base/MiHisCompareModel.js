import { merge, isEmpty } from 'lodash';
import * as miHisCompare from '../../services/base/MiHisCompareService';

export default {
  namespace: 'miHisCompare',

  state: {
    namespace: 'miHisCompare',
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
    selectedTag: '',
    pageNo: 1,
  },

  effects: {
    *load({ payload }, { select, call, put }) {
      console.log(1111);
      const { query } = (payload || {});
      let { page } = (payload || {});
      const defaultPage = yield select(state => state.miHisCompare.defaultPage);
      page = { ...defaultPage, ...page };
      const { pageNo, pageSize } = page;
      const start = (pageNo - 1) * pageSize;

      yield put({ type: 'toggleSpin' });
      const { data } = yield call(miHisCompare.loadPage, start, pageSize, query);
      yield put({ type: 'toggleSpin' });
      console.info(page);
      if (data) {
        yield put({ type: 'init', data, page });
        yield put({ type: 'setState',
                    payload: {
                       pageNo: page.pageNo,
                    },
                 });
      }
    },
    *save({ params }, { select, call, put }) {
      yield put({ type: 'toggleSpin' });
      const record = yield select(state => state.utils.record);
      const pageNo = yield select(state => state.miHisCompare.pageNo);
      const searchObj = yield select(state => state.miHisCompare.searchObj);
      const { data } = yield call(miHisCompare.save, params);
      /* isEmpty(record) ? create : update */
      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: {
            visible: isEmpty(record),
            result: data,
          },
        });
         let  page  = {};
         page.pageNo = pageNo;
         yield put({ type: 'load', payload: { query: searchObj, page: page} });
      }
      yield put({ type: 'toggleSpin' });
    },
    *delete({ id }, { call, put }) {
      yield put({ type: 'toggleSpin' });
      const { data } = yield call(miHisCompare.remove, id);
      yield put({ type: 'toggleSpin' });
      if (data && data.success) {
        yield put({ type: 'load' });
      }
    },
    *deleteSelected({ payload }, { select, call, put }) {
      const selectedRowKeys = yield select(state => state.miHisCompare.selectedRowKeys);
      yield put({ type: 'toggleSpin' });
      const { data } = yield call(miHisCompare.removeAll, selectedRowKeys);
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
        if (pathname === '/base/miHisCompare') {
          dispatch({
            type: 'load',
          });
        }
      });
    },
  },
};
