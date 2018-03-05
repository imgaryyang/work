
import { loadExamApply } from '../../services/odws/ExamService';

export default {
  namespace: 'odwsExam',
  state: {
    query: {},
    examApplys: [],
    spin: false,
  },
  effects: {

    *loadExamApply({ payload }, { call, put }) {
      const { query } = (payload || {});

      // 显示载入指示器
      yield put({ type: 'addSpin' });
      const { data } = yield call(loadExamApply, query);
      if (data) {
        yield put({
          type: 'initExamApplys',
          data,
          query: query || {},
        });
      }
      // 移除载入指示器
      yield put({ type: 'removeSpin' });
    },

  },
  reducers: {

    initExamApplys(state, { data, query }) {
      const { result = result || [] } = data;
      const examApplys = result;
      return {
        ...state,
        examApplys,
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
