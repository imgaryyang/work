import { notification } from 'antd';
import { loadMedicalRecord, saveMedicalRecord, loadTemplates } from '../../services/odws/MedicalRecordService';

export default {
  namespace: 'odwsMedicalRecord',
  state: {
    query: {},
    medicalRecord: {},
    templates: {},
    spin: false,
  },
  effects: {

    /**
     * 载入本次就诊对应的病历信息
     */
    *loadMedicalRecord({ payload }, { call, put }) {
      // 显示载入指示器
      yield put({ type: 'addSpin' });
      const { data } = yield call(loadMedicalRecord, payload);
      if (data && data.success) {
        yield put({
          type: 'initMedicalRecord',
          data,
        });
      } else {
        notification.error({
          message: '错误',
          description: '读取病历信息出错，请稍后再试！',
        });
      }
      // 移除载入指示器
      yield put({ type: 'removeSpin' });
    },

    /**
     * 载入病历模板
     */
    *loadTemplates({ payload }, { call, put }) {
      const { searchCode } = payload;
      // 显示载入指示器
      yield put({ type: 'addSpin' });
      const { data } = yield call(loadTemplates, searchCode);
      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: {
            templates: data.result,
          },
        });
      } else {
        notification.error({
          message: '错误',
          description: '读取病历模板出错，请稍后再试！',
        });
      }
      // 移除载入指示器
      yield put({ type: 'removeSpin' });
    },

    /**
     * 保存病历
     */
    *saveMedicalRecord({ payload }, { call, put }) {
      // 显示载入指示器
      yield put({ type: 'addSpin' });
      const { data } = yield call(saveMedicalRecord, payload);
      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: {
            medicalRecord: data.result,
          },
        });
        yield put({
          type: 'loadMedicalRecord',
          payload: payload.regId,
        });
      } else {
        notification.error({
          message: '错误',
          description: '保存病历信息出错，请稍后再试！',
        });
      }
      // 移除载入指示器
      yield put({ type: 'removeSpin' });
    },

  },
  reducers: {

    initMedicalRecord(state, { data }) {
      const { result } = data;
      const medicalRecord = result || {};
      return {
        ...state,
        medicalRecord,
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
