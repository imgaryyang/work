import _ from 'lodash';
import * as StatisticsService from '../../services/appointment/StatisticsService';

export default {
  namespace: 'accountItem',

  state: {
    data: [],
    isSpin: false,
    searchObjs: {},
    invoiceSource: '',
  },

  effects: {
    *load({ payload }, { select, call, put }) {
      const { query } = (payload || {});
      const invoiceSource = yield select(state => state.accountItem.invoiceSource);
      const defaultQuery = { invoiceSource };
      let searchObjs = yield select(state => state.accountItem.searchObjs);
      searchObjs = { ...searchObjs, ...query, ...defaultQuery };
      yield put({ type: 'toggleSpin' });
      const { data } = yield call(StatisticsService.accountItemStatistics, searchObjs);
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

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/appointment/statistics/accountItem') {
          dispatch({
            type: 'setState',
            payload: { invoiceSource: '1' },
          });
        }
        if (pathname === '/charge/statisByAccountItem') {
          dispatch({
            type: 'setState',
            payload: { invoiceSource: '2' },
          });
        }
      });
    },
  },
};
