import _ from 'lodash';
import * as StatisticsService from '../../services/appointment/StatisticsService';

export default {
  namespace: 'payWay',

  state: {
    data: [],
    isSpin: false,
    searchObjs: {},
    invoiceSource: '',
    title: '',
  },

  effects: {
    *load({ payload }, { select, call, put }) {
      const { query } = (payload || {});
      const invoiceSource = yield select(state => state.payWay.invoiceSource);
      const defaultQuery = { invoiceSource };
      let searchObjs = yield select(state => state.payWay.searchObjs);
      searchObjs = { ...searchObjs, ...query, ...defaultQuery };
      yield put({ type: 'toggleSpin' });
      const { data } = yield call(StatisticsService.payWayStatistics, searchObjs);
      if (data && data.success) {
        const { result } = data;
        const title = result.title;
        const newData = result.data;
        yield put({ type: 'setState', payload: { data: newData || [], title } });
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
        if (pathname === '/appointment/statistics/payWay') {
          dispatch({
            type: 'setState',
            payload: { invoiceSource: '1' },
          });
        }
        if (pathname === '/charge/statisByPayWay') {
          dispatch({
            type: 'setState',
            payload: { invoiceSource: '2' },
          });
        }
      });
    },
  },
};
