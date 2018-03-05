import { routerRedux } from 'dva/router';
import { Toast } from 'antd-mobile';
import { login, register, getInfo, doSave, updateProfiles, logout } from '../services/baseService';

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
    user: {},
    mobile: '',
    profiles: [],
    redirect: false,
    currPatient: {},
    currProfile: {},
    currHospital: hospital,
    info: {}, // 获得微信平台的基本信息 比如关于我们 联系我们 反馈意见等
  },

  subscriptions: {
  },

  effects: {
    *login({ payload }, { call, put }) {  // eslint-disable-line
      const { openid } = payload;
      const { data } = yield call(login, openid);
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
        yield put(routerRedux.push('/login'));
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
        console.log('请求出错');
      }
    },
    *register({ payload }, { call, put }) {
      const { data } = yield call(register, payload);
      if (data && data.success) {
        const { map } = data.result;
        console.log('map', map);
        const profiles = map.profiles ? map.profiles : [];
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
        yield put(routerRedux.push('/login'));
      }
    },
    *logout({ payload, callback }, { call, put }) {
      const { data } = yield call(logout);
      if (data && data.success) {
        yield put({
          type: 'save',
          payload: {
            user: {},
          },
        });
      }
      yield put(routerRedux.push('/login'));
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
      }
      yield put(routerRedux.goBack());
      if (callback) callback();
    },
    *updateProfiles({ payload, callback }, { call, put }) {
      Toast.loading('加载中。。。', 0);
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
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
