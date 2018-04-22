import { loadOrgPage } from '../../services/statistics/TrilateralCheckingService';

export default {
  namespace: 'trilateralChecking',
  state: {
    query: {},
    page: { total: 0, pageSize: 10, pageNo: 1 },
    spin: false,
    data: [],
  },
  effects: {
    *load({ payload }, { select, call, put }) {
      const { page, query } = (payload || {});
      const defaultPage = yield select(state => state.org.page);
      const newPage = { ...defaultPage, ...page };
      const { pageNo, pageSize } = newPage;
      const start = (pageNo - 1) * pageSize;
      yield put({
        type: 'setState',
        payload: { spin: true },
      });
      const { data } = yield call(loadOrgPage, start, pageSize, query);
      yield put({
        type: 'setState', payload: { spin: false },
      });
      if (data && data.success) {
        yield put({
          type: 'init',
          data: data.result,
          page: newPage,
        });
      }
    },
  },
  reducers: {
    setState(oldState, { payload }) {
      return { ...oldState, ...payload };
    },
  },
};
