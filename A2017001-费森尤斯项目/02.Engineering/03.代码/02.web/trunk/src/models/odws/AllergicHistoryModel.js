import { notification } from 'antd';
import { loadAllergicHistory, saveAllergic } from '../../services/odws/AllergicHistoryService';

export default {
  namespace: 'odwsAllergicHistory',
  state: {
    query: {},
    allergicHistory: [],
    spin: false,
  },
  effects: {

    /**
     * 载入所有过敏记录
     */
    *loadAllergicHistory({ payload }, { call, put }) {
      // 显示载入指示器
      yield put({ type: 'addSpin' });
      const { data } = yield call(loadAllergicHistory, payload.patientId);
      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: {
            allergicHistory: data.result,
          },
        });
      } else {
        notification.error({
          message: '错误',
          description: '载入过敏历史记录出错，请稍后再试！',
        });
      }
      // 移除载入指示器
      yield put({ type: 'removeSpin' });
    },

    /**
     * 保存过敏记录
     */
    *saveAllergic({ payload }, { select, call, put }) {
      // 显示载入指示器
      yield put({ type: 'addSpin' });
      const { data } = yield call(saveAllergic, payload);
      if (data && data.success) {
        const { currentReg } = yield select(state => state.odws);
        yield put({
          type: 'loadAllergicHistory',
          payload: {
            patientId: currentReg.patient.id,
          },
        });
      } else {
        notification.error({
          message: '错误',
          description: '保存过敏记录出错，请稍后再试！',
        });
      }
      // 移除载入指示器
      yield put({ type: 'removeSpin' });
    },

  },

  reducers: {

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
