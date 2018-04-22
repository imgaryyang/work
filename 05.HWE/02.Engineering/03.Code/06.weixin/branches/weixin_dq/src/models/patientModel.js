import { Toast } from 'antd-mobile';
import { save, queryHisProfiles, bindProfile } from '../services/patientService';

export default {

  namespace: 'patient',

  state: {
    visible: false,
    patientInfo: {},
    bindedProfiles: {},
    hisProfiles: [],
    loadingHisProfiles: false,
    smsData: {},
    bindButtonDisabled: false,
  },

  subscriptions: {
  },

  effects: {
    /**
     * 新增或修改就诊人信息
     * @param payload
     * @param callback
     * @param submitDown
     * @param call
     */
    *save({ payload, callback, submitDown }, { call }) {
      Toast.loading('正在保存就诊人信息，请稍候...');
      // console.log(payload);
      const { data } = yield call(save, payload.patientInfo);
      // console.log(data);
      if (data && data.success) {
        if (typeof submitDown === 'function') submitDown(data.result);
      } else if (data && data.msg) {
        if (callback) callback(data.msg);
      }
    },

    *initBindedProfiles(arg1, { put, select }) {
      const { profiles } = yield select(state => state.patient.patientInfo);
      const bindedProfiles = {};
      for (let i = 0; profiles && i < profiles.length; i++) {
        const key = `${profiles[i].hosId}${profiles[i].no}`;
        bindedProfiles[key] = key;
      }
      // console.log('bindedProfiles:', bindedProfiles);
      yield put({
        type: 'setState',
        payload: {
          bindedProfiles,
        },
      });
    },

    /**
     * 查询HIS档案
     * @param payload
     * @param callback
     * @param submitDown
     * @param call
     */
    *queryHisProfiles({ payload, callback }, { call, put }) {
      // Toast.loading();
      yield put({ type: 'setState', payload: { loadingHisProfiles: true } });
      // console.log(payload);
      const { data } = yield call(queryHisProfiles, payload);
      // console.log(data);
      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: {
            hisProfiles: data.result,
            loadingHisProfiles: false,
          },
        });
        // Toast.hide();
      } else if (data && data.msg) {
        yield put({ type: 'setState', payload: { loadingHisProfiles: false } });
        if (callback) callback(data.msg);
      }
    },

    /**
     * 绑定档案
     * @param payload
     * @param callback
     * @param submitDown
     * @param call
     */
    *bindProfile({ payload, showMsg, submitDown }, { call, put }) {
      // Toast.loading();
      yield put({
        type: 'setState',
        payload: {
          bindButtonDisabled: true,
        },
      });
      const { data } = yield call(bindProfile, payload);
      // console.log(data);
      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: {
            bindButtonDisabled: false,
          },
        });
        if (typeof submitDown === 'function') submitDown(data.result);
      } else if (data && data.msg) {
        if (showMsg) showMsg(data.msg);
      }
    },
  },

  reducers: {
    setState(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
