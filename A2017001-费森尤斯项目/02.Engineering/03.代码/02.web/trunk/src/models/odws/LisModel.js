
import { loadLisApply } from '../../services/odws/LisService';

export default {
  namespace: 'odwsLis',
  state: {
    query: {},
    lisApplys: [],
    spin: false,
  },
  effects: {

    *loadLisApply({ payload }, { call, put }) {
      const { query } = (payload || {});

      // 显示载入指示器
      yield put({ type: 'addSpin' });
      const { data } = yield call(loadLisApply, query);
      if (data) {
        yield put({
          type: 'initLisApplys',
          data,
          query: query || {},
        });
      }
      // 移除载入指示器
      yield put({ type: 'removeSpin' });
    },

  },
  reducers: {

    initLisApplys(state, { data, query }) {
      const { result = result || [] } = data;
      const lisApplys = result;
      return {
        ...state,
        lisApplys,
        query,
      };
    },

    setState(oldState, { payload }) {
      return { ...oldState, ...payload };
    },

    addSpin(state) {
      return { ...state, spin: true };
    },

    removeSpin(state) {
      return { ...state, spin: false };
    },
  },
};
