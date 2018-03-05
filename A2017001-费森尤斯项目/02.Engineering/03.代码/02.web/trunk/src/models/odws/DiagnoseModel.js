import { notification } from 'antd';
import { loadDiagnosis, saveDiagnose, changeMainDiagnose, deleteDiagnose, loadTopDiagnosis } from '../../services/odws/DiagnoseService';

export default {
  namespace: 'odwsDiagnose',
  state: {
    query: {},
    diagnosis: [],
    topDiagnosis: [],
    spin: false,
  },
  effects: {

    /**
     * 载入诊断信息
     */
    *loadDiagnosis({ payload }, { call, put }) {
      // 显示载入指示器
      yield put({ type: 'addSpin' });
      const { data } = yield call(loadDiagnosis, payload);
      if (data && data.success) {
        yield put({
          type: 'initDiagnosis',
          data,
        });
      }
      // 移除载入指示器
      yield put({ type: 'removeSpin' });
    },

    /**
     * 载入使用最多的20条诊断
     */
    *loadTopDiagnosis({ payload }, { call, put }) {
      // 显示载入指示器
      yield put({ type: 'addSpin' });
      const { data } = yield call(loadTopDiagnosis, payload);
      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: {
            topDiagnosis: data.result || [],
          },
        });
      }
      // 移除载入指示器
      yield put({ type: 'removeSpin' });
    },

    /**
     * 保存诊断
     */
    *saveDiagnose({ payload }, { call, put }) {
      // 显示载入指示器
      yield put({ type: 'addSpin' });
      const { data } = yield call(saveDiagnose, payload);
      if (data && data.success) {
        yield put({
          type: 'loadDiagnosis',
          payload: payload.regId,
        });
      } else {
        notification.error({
          message: '错误',
          description: '保存诊断出错，请稍后再试！',
        });
      }
      // 移除载入指示器
      yield put({ type: 'removeSpin' });
    },

    /**
     * 变更主诊断
     */
    *changeMainDiagnose({ payload }, { call, put }) {
      // 显示载入指示器
      yield put({ type: 'addSpin' });
      const { data } = yield call(changeMainDiagnose, payload);
      if (data && data.success) {
        yield put({
          type: 'loadDiagnosis',
          payload: payload.regId,
        });
      } else {
        notification.error({
          message: '错误',
          description: '变更主诊断出错，请稍后再试！',
        });
      }
      // 移除载入指示器
      yield put({ type: 'removeSpin' });
    },

    /**
     * 删除诊断
     */
    *deleteDiagnose({ payload }, { call, put }) {
      // 显示载入指示器
      yield put({ type: 'addSpin' });
      const { data } = yield call(deleteDiagnose, payload);
      if (data && data.success) {
        yield put({
          type: 'loadDiagnosis',
          payload: payload.regId,
        });
      } else {
        notification.error({
          message: '错误',
          description: '删除诊断出错，请稍后再试！',
        });
      }
      // 移除载入指示器
      yield put({ type: 'removeSpin' });
    },

  },
  reducers: {

    initDiagnosis(state, { data }) {
      const { result = result || [] } = data;
      const diagnosis = result;
      return {
        ...state,
        diagnosis,
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
