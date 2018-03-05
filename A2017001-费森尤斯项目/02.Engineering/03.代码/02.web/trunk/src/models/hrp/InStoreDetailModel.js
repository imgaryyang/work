import { merge } from 'lodash';
import { inStoreDetailPage } from '../../services/hrp/DirectInService';

export default {
  namespace: 'hrpInStoreDetail',

  state: {
    page: {
      total: 0,
      pageSize: 10,
      pageNo: 1,
    },
    selectedRowKeys: [],
    data: [],
    dicts: {},
    record: null,
    isSpin: false,
    visible: false,
    searchObjs: {},
    selectedTag: '',
    formCache: {},
  },

  effects: {
    *load({ payload }, { select, call, put }) {
      const { query } = (payload || {});
      let { page } = (payload || {});
      const defaultPage = yield select(state => state.hrpInStoreDetail.page);
      let searchObjs = yield select(state => state.hrpInStoreDetail.searchObjs);
      searchObjs = { ...searchObjs, ...query };
      page = { ...defaultPage, ...page };
      const { pageNo, pageSize } = page;
      const start = (pageNo - 1) * pageSize;
      yield put({ type: 'setState', payload: { isSpin: true } });
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
        if (pathname === '/hrp/inStoreDetail') {
          dispatch({
            type: 'load',
          });
          dispatch({
            type: 'utils/initDicts',
            payload: [
              'IN_TYPE', 'COMPANY_TYPE',
            ],
          });
        }
      });
    },
  },
};
