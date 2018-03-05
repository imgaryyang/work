import _ from 'lodash';
import * as StatisticsService from '../../services/appointment/StatisticsService';

export default {
  namespace: 'regReport',

  state: {
    data: [],
    isSpin: false,
    searchObjs: {},
  },

  effects: {
    *load({ payload }, { select, call, put }) {
      const { query } = (payload || {});
      let searchObjs = yield select(state => state.regReport.searchObjs);
      searchObjs = { ...searchObjs, ...query };
      yield put({ type: 'toggleSpin' });
      const { data } = yield call(StatisticsService.registStatistics, searchObjs);
      if (data && data.success) {
        yield put({ type: 'setState', payload: { data: data.result || [] } });
      }
      yield put({ type: 'toggleSpin' });
    },
  },

  reducers: {
    setState(state, { payload }) {
      return { ...state, ...payload };
    },

    toggleSpin(state) {
      return { ...state, isSpin: !state.isSpin };
    },

    setSearchObjs(state, { payload }) {
      let { searchObjs } = payload;
      const merge = (target, ...sources) => Object.assign(target, ...sources);
      if (!_.isEmpty(searchObjs)) {
        searchObjs = merge(state.searchObjs, searchObjs);
      } else {
        searchObjs = {};
      }
      return { ...state, searchObjs };
    },
  },
};
