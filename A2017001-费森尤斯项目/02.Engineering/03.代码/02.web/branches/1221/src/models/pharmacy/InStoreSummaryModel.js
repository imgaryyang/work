import { merge } from 'lodash';
import { inStoreSummaryPage } from '../../services/pharmacy/DirectInService';

export default {
  namespace: 'inStoreSummary',

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
    cost: '',
    amount: '',
  },

  effects: {
    *load({ payload }, { select, call, put }) {
      const { query } = (payload || {});
      let { page } = (payload || {});
      const defaultPage = yield select(state => state.inStoreSummary.page);
      page = { ...defaultPage, ...page };
      const { pageNo, pageSize } = page;
      const start = (pageNo - 1) * pageSize;
      yield put({ type: 'setState', payload: { isSpin: true } });
      const { data } = yield call(inStoreSummaryPage, start, pageSize, query);
      const resultTmp = data.result;
      const { cost, amount, result } = resultTmp;
      if (data) {
        yield put({ type: 'init', data: result, page, cost, amount });
      }
      yield put({ type: 'setState', payload: { isSpin: false } });
    },
  },

  reducers: {
    init(state, { data, page, cost, amount }) {
      const { result, total } = data;
      const resPage = { ...state.page, ...page, total };
      const resData = result || [];
      return { ...state, data: resData, page: resPage, cost, amount };
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
        if (pathname === '/pharmacy/inStoreSummary') {
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
