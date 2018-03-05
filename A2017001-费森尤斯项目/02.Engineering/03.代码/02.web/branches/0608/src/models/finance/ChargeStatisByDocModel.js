import { merge } from 'lodash';
import { statisByDeptAndDoc } from '../../services/finance/ChargeStatisService';

export default {
  namespace: 'chargeStatisByDoc',

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
    *load({ payload }, { call, put }) {
      const { query } = (payload || {});
      yield put({ type: 'setState', payload: { isSpin: true } });
      const { data } = yield call(statisByDeptAndDoc, query);
      
      yield put({ type: 'setState', payload: { isSpin: false } });
      if (data) {
        yield put({ type: 'init', data });
      }
    },
  },

  reducers: {
    init(state, { data }) {
      const { result } = data;
      const resData = result || [];
      return { ...state, data: resData };
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
        if (pathname === '/charge/statisByDocAndItem') {
          dispatch({
            type: 'load',
          });
          dispatch({
            type: 'utils/initDicts',
            payload: ['DRUG_TYPE'],
          });
        }
      });
    },
  },
};
