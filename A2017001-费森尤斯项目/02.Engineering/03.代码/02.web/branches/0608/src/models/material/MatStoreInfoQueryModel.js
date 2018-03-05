import { merge } from 'lodash';
import { loadStoreInfoPage } from '../../services/material/StoreInfoService';
import { loadStoreSumInfoPage } from '../../services/material/StoreSumInfoService';

export default {
  namespace: 'matStoreInfoQuery',

  state: {
    page: { total: 0, pageSize: 10, pageNo: 1 },
    searchObjs: {},
    data: [],
    spin: false,
    record: null,
    activeKey: '1',
    tabArray: [{ key: 1, tab: '库存汇总' }, { key: 2, tab: '库存明细' }],
  },

  effects: {
    *load({ payload }, { select, call, put }) {
      const { page, query } = (payload || {});
      const defaultPage = yield select(state => state.matStoreInfoQuery.page);
      const activeKey = yield select(state => state.matStoreInfoQuery.activeKey);
      const newPage = { ...defaultPage, ...page };
      const { pageNo, pageSize } = newPage;
      const start = (pageNo - 1) * pageSize;

      yield put({ type: 'setState', payload: { spin: true } });
      console.log(activeKey);
      const { data } = activeKey === '1' ? yield call(loadStoreSumInfoPage, start, pageSize, query) :
        yield call(loadStoreInfoPage, start, pageSize, query);

      yield put({ type: 'setState', payload: { spin: false } });

      if (data) {
        yield put({
          type: 'init',
          data,
          page: newPage,
        });
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

    setState(state, { payload }) {
      return { ...state, ...payload };
    },

    resetPage(state) {
      // return { ...state, page: { ...page, pageNo: 1 } };
      const page = { total: 0, pageSize: state.page.pageSize, pageNo: 1 };
      return { ...state, page };
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
};
