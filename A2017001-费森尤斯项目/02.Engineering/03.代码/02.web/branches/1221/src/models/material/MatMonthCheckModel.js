import _ from 'lodash';
import baseUtil from '../../utils/baseUtil';
import { loadPage, create, findMonthCheckTime } from '../../services/material/MonthCheckService';

export default {
  namespace: 'matMonthCheck',

  state: {
    page: { total: 0, pageSize: 10, pageNo: 1 },
    searchObjs: {},
    data: [],
    spin: false,
    checkTimeList: null,
  },

  effects: {
    *load({ payload }, { select, call, put }) {
      const { page, query } = (payload || {});
      const defaultPage = yield select(state => state.matMonthCheck.page);
      const newPage = { ...defaultPage, ...page };
      const { pageNo, pageSize } = newPage;
      const start = (pageNo - 1) * pageSize;

      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(loadPage, start, pageSize, query);

      if (data) {
        yield put({ type: 'init', data, page: newPage });
      }

      yield put({ type: 'setState', payload: { spin: false } });
    },

    *save({ payload }, { call, put }) {
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(create, {});

      if (data && data.success) {
        yield put({ type: 'setState', payload: { checkTimeList: null } });
        yield put({ type: 'load' });
      } else if (data && data.msg) {
        baseUtil.alert(data.msg);
      } else {
        baseUtil.alert('不明错误');
      }
      yield put({ type: 'findTimeList' });
      yield put({ type: 'setState', payload: { spin: false } });
    },

    *findTimeList({ payload }, { call, put }) {
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(findMonthCheckTime, {});
      if (data && data.success) {
        const { result } = data;
        yield put({ type: 'setState', payload: { checkTimeList: result } });
      } else if (data && data.msg) {
        baseUtil.alert(data.msg);
      } else {
        baseUtil.alert('不明错误');
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
        const searchObjs = _.merge(state.searchObjs, searchObj);
        return { ...state, searchObjs };
      } else {
        return { ...state, searchObjs: {} };
      }
    },
  },
};
