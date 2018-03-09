import { routerRedux } from 'dva/router';
import { Toast } from 'antd-mobile';
import { loginByOpenId, loginByUserId, registerByOpenId, registerByUserId, getInfo, doSave, updateProfiles, logout, sendAuthSM } from '../services/baseService';

const hospital = {
  id: '8a81a7db4dad2271014dad2271e20001',
  orgId: '8a81a7db4dad2271014dad22org20001',
  name: '北京大学人民医院',
  no: 'H31AAAA001',
  type: '1',
  level: '3A',
  status: '1',
  logo: '8a50ad50e87c11e7be625254001f7cdb',
  scenery: '54279a56e87d11e7be625254001f7cdb',
  sceneryNum: 4,
  longitude: 116.360788,
  latitude: 39.942493,
  org: null,
  profiles: null,
  brief: '北京大学人民医院创建于1918年，是中国人自行筹资建设和管理的第一家综合性西医医院，最初命名为“北京中央医院”，中国现代医学先驱伍连德博士任首任院长。 北京大学人民医院的发展历程，是中国医学进步的见证。经过99年的发展现已发展成为集医疗、教学、科研为一体的现代化综合性三级甲等医院。',
};

export default {

  namespace: 'base',

  state: {
    openid: '',
    userId: '',
    user: {},
    mobile: '',
    profiles: [],
    redirect: false,
    currPatient: {},
    currProfile: {},
    currHospital: hospital,
    info: {}, // 获得微信平台的基本信息 比如关于我们 联系我们 反馈意见等
    smsMessage: {},
  },

  subscriptions: {
  },

  effects: {
    *loginByOpenId({ payload }, { call, put }) {  // eslint-disable-line
      const { openid } = payload;
      yield put({ type: 'save', payload: { openid } });
      const { data } = yield call(loginByOpenId, openid);
      const { success, result } = data || {};
      if (success === true) {
        yield put({
          type: 'save',
          payload: {
            user: result || {},
            loginResult: success,
          },
        });
        yield put(routerRedux.push('/home'));
      } else {
        yield put(routerRedux.push('/loginWeChat'));
      }
    },
    *loginByUserId({ payload }, { call, put }) {  // eslint-disable-line
      const { userId } = payload;
      yield put({ type: 'save', payload: { userId } });
      const { data } = yield call(loginByUserId, userId);
      const { success, result } = data || {};
      if (success === true) {
        yield put({
          type: 'save',
          payload: {
            user: result || {},
            loginResult: success,
          },
        });
        yield put(routerRedux.push('/home'));
      } else {
        yield put(routerRedux.push('/loginZFB'));
      }
    },
    *getInfo({ payload }, { call, put }) {  // eslint-disable-line
      const { data } = yield call(getInfo, payload);
      const { success, result } = data || {};
      if (success === true) {
        yield put({
          type: 'save',
          payload: { info: result },
        });
      } else {
        Toast.fail(data.msg, 1);
      }
    },
    *registerByOpenId({ payload }, { call, put }) {
      const { openid } = payload;
      yield put({ type: 'save', payload: { openid } });
      const { data } = yield call(registerByOpenId, payload);
      if (data && data.success) {
        const { map } = data.result;
        console.log('map', map);
        const profiles = map && map.profiles ? map.profiles : [];
        yield put({
          type: 'save',
          payload: {
            profiles,
            user: data.result || {},
            redirect: true,
          },
        });
        yield put(routerRedux.push('/home'));
      } else {
        alert(data.msg);
        yield put(routerRedux.push('/loginWeChat'));
      }
    },
    *registerByUserId({ payload }, { call, put }) {
      const { userId } = payload;
      yield put({ type: 'save', payload: { userId } });
      const { data } = yield call(registerByUserId, payload);
      if (data && data.success) {
        const { map } = data.result;
        console.log('map', map);
        const profiles = map && map.profiles ? map.profiles : [];
        yield put({
          type: 'save',
          payload: {
            profiles,
            user: data.result || {},
            redirect: true,
          },
        });
        yield put(routerRedux.push('/home'));
      } else {
        alert(data.msg);
        yield put(routerRedux.push('/loginZFB'));
      }
    },
    *logout({ payload, callback }, { call, put }) {
      const { openid, userId } = payload;
      const { data } = yield call(logout);
      if (data && data.success) {
        yield put({
          type: 'save',
          payload: {
            user: {},
          },
        });
      }
      if (userId) {
        yield put(routerRedux.push('/loginZFB'));
      } else if (openid) {
        yield put(routerRedux.push('/loginWeChat'));
      } else {
        yield put(routerRedux.push('/home'));
      }
      if (callback) callback();
    },
    *doSave({ payload, callback }, { call, put }) {
      const { data } = yield call(doSave, payload);
      if (data && data.success) {
        const { result } = data || [];
        console.log('result', result);
        yield put({
          type: 'save',
          payload: {
            user: result || [],
          },
        });
      } else {
        Toast.fail(data.msg, 1);
      }
      yield put(routerRedux.goBack());
      if (callback) callback();
    },
    *updateProfiles({ payload, callback }, { call, put }) {
      console.log('updateProfiles...in...model');
      yield put({ type: 'setState', payload: { profiles: [] } });
      const { data } = yield call(updateProfiles);
      if (data && data.success) {
        const { result } = data || [];
        console.log('result', result);
        yield put({
          type: 'save',
          payload: {
            profiles: result || [],
          },
        });
        Toast.hide();
      } else {
        Toast.hide();
      }
      if (callback) callback();
    },
    *sendAuthSM({ payload, callback }, { call, put }) {
      const { data } = yield call(sendAuthSM, payload);
      if (data && data.success) {
        const { result } = data || [];
        console.log('result', result);
        yield put({
          type: 'save',
          payload: {
            smsMessage: result || [],
          },
        });
      }
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
