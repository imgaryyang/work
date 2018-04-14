import { routerRedux } from 'dva/router';
import { Toast } from 'antd-mobile';
import {
  loginByOpenId, loginByUserId, registerByOpenId, registerByUserId, getInfo,
  doSave, updateProfiles, sendSecurityCode, verifySecurityCode,
  reloadUserInfo, loginAfterVerifySecurityCode,
} from '../services/baseService';
import Global from '../Global';

export default {

  namespace: 'base',

  state: {
    // 支付宝/微信对应的用户身份信息
    openid: '',
    userId: '',

    // 可供使用的屏幕尺寸信息
    screen: {
      width: 0,
      height: 0,
      wsInTabHeight: 0,
      wsInStackHeight: 0,
    },

    // 用户基本信息及当前医院、当前就诊人、当前档案
    user: {},
    currHospital: {},
    currPatient: {},
    currProfile: {},
    edition: 'single',

    // 公用导航栏参数
    title: '',
    showCurrHospitalAndPatient: false,
    allowSwitchHospital: true,
    allowSwitchPatient: true,
    hideNavBarBottomLine: false,
    headerRight: null,

    // SMS verify
    sendButtonDisabled: false,
    verifyButtonDisabled: false,
    smsMessage: {},
    second: 30,
    smsData: {
      mobile: '',
      securityCode: '',
    },

    // login after verify
    loginButtonDisabled: false,

    // ?
    profiles: [],
    redirect: false,
    info: {}, // 获得微信平台的基本信息 比如关于我们 联系我们 反馈意见等
    slideMenuIdx: 0,
  },

  subscriptions: {
  },

  effects: {
    /**
     * 设置屏幕尺寸
     * @param payload
     * @param put
     */
    *setScreen({ payload }, { put }) {
      yield put({
        type: 'save',
        payload: {
          screen: {
            width: payload.width,
            height: payload.height,
            wsInTabHeight: payload.height - 50,
            wsInStackHeight: payload.height - 45,
          },
        },
      });
    },

    /**
     * 使用微信公众号身份信息进行登录
     * @param payload
     * @param call
     * @param put
     */
    *loginByOpenId({ payload }, { call, put }) {
      console.info('loginByOpenId');
      Toast.loading('正在登录，请稍候...');
      const { openid, route } = payload;
      yield put({ type: 'save', payload: { route } });
      // 调用登录
      const { data } = yield call(loginByOpenId, openid);
      // console.log('openid & data in loginByOpenId():', openid, data);
      if (data && data.success === true) {
        const { result } = data;
        // 记录当前用户信息及openId
        yield put({
          type: 'save',
          payload: {
            openid,
            user: result,
          },
        });
        // 从当前登录用户的patients设置当前就诊人
        yield put({ type: 'setCurrInfoFromPatients' });
        Toast.hide();
        if (route) {
          yield put(routerRedux.replace(`/stack/${route}`));
        } else {
          // 登录成功，转向到主页菜单
          yield put(routerRedux.replace('/home/hfc'));
        }
      } else if (data && data.msg) {
        yield put({
          type: 'save',
          payload: {
            openid,
          },
        });
        Toast.hide();
        // 登录不成功，转向到短信验证登录界面
        yield put(routerRedux.replace('/loginBySMS'));
      }
    },

    /**
     * 使用支付宝服务窗身份信息进行登录
     * @param payload
     * @param call
     * @param put
     */
    *loginByUserId({ payload }, { call, put }) {  // eslint-disable-line
      Toast.loading('正在登录，请稍候...');
      const { userId, route } = payload;
      yield put({ type: 'save', payload: { route } });
      // 调用登录
      const { data } = yield call(loginByUserId, userId);
      // console.log('userId & data in loginByUserId():', userId, data);
      if (data && data.success === true) {
        const { result } = data;
        // 记录当前用户信息及userId
        yield put({
          type: 'save',
          payload: {
            userId,
            user: result,
          },
        });
        // 从当前登录用户的patients设置当前就诊人
        yield put({ type: 'setCurrInfoFromPatients' });
        Toast.hide();
        if (route) {
          yield put(routerRedux.replace(`/stack/${route}`));
        } else {
          // 登录成功，转向到主页菜单
          yield put(routerRedux.replace('/home/hfc'));
        }
      } else if (data && data.msg) {
        yield put({
          type: 'save',
          payload: {
            userId,
          },
        });
        Toast.hide();
        // 登录不成功，转向到短信验证登录界面
        yield put(routerRedux.replace('/loginBySMS'));
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
        yield put(routerRedux.push('/home/hfc'));
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
        yield put(routerRedux.push('/home/hfc'));
      } else {
        alert(data.msg);
        yield put(routerRedux.push('/loginZFB'));
      }
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

    *updateProfiles({ callback }, { call, put }) {
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

    /**
     * 发送验证码
     * @param payload
     * @param showMsg
     * @param call
     * @param put
     */
    *sendSecurityCode({ payload, showMsg }, { call, put }) {
      if (showMsg) showMsg('_LOADING_');
      const { data } = yield call(sendSecurityCode, payload);
      yield put({
        type: 'setState',
        payload: {
          second: Global.Config.global.authCodeResendInterval,
          sendButtonDisabled: true,
        },
      });
      if (data && data.success) {
        if (showMsg) showMsg('验证码发送成功，请注意查收手机短信！');
      } else if (data && data.msg) {
        if (showMsg) showMsg(data.msg);
      } else {
        yield put({
          type: 'setState',
          payload: {
            second: 0,
            sendButtonDisabled: false,
          },
        });
      }
    },

    /**
     * 校验验证码
     * @param payload
     * @param showMsg
     * @param call
     * @param put
     * @param select
     */
    *verifySecurityCode({ payload, showMsg, afterVerify, afterVerifyText }, { call, put, select }) {
      const { data } = yield call(verifySecurityCode, payload);
      if (showMsg) showMsg('_LOADING_');
      yield put({
        type: 'setState',
        payload: {
          verifyButtonDisabled: true,
          sendButtonDisabled: true,
        },
      });
      const { smsData } = yield select(state => state.base);
      if (data && data.success) {
        // console.log('result', data.result);
        if (showMsg) showMsg(afterVerifyText);
        afterVerify({ ...smsData, token: data.result.token });
      } else {
        if (showMsg && data && data.msg) showMsg(data.msg);
        yield put({
          type: 'setState',
          payload: {
            second: Global.Config.global.authCodeResendInterval,
            verifyButtonDisabled: false,
            sendButtonDisabled: false,
          },
        });
      }
    },

    /**
     * 短信校验成功后登录
     */
    *loginAfterVerify({ payload, showMsg, loginDown }, { call, put, select }) {
      if (showMsg) showMsg('_LOADING_');
      yield put({
        type: 'setState',
        payload: {
          loginButtonDisabled: true,
        },
      });
      // 验证通过后调用登录，获取用户信息
      const { openid, userId } = yield select(state => state.base);
      // console.log(payload);
      // console.log('openid in loginAfterVerify():', openid);
      // console.log('userId in loginAfterVerify():', userId);
      let loginResponse = {};
      if (openid) {
        loginResponse = yield call(loginAfterVerifySecurityCode, {
          ...payload,
          openid,
        });
      } else {
        loginResponse = yield call(loginAfterVerifySecurityCode, {
          ...payload,
          userId,
        });
      }
      // console.log('loginResponse.data:', loginResponse.data);
      const { data } = loginResponse;
      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: {
            user: data.result,
            loginButtonDisabled: false,
          },
        });
        // 从当前登录用户的patients设置当前就诊人
        yield put({ type: 'setCurrInfoFromPatients' });
        if (showMsg) showMsg('登录成功！');
        if (loginDown) loginDown(data.result);
        // 转向到首页菜单
        yield put(routerRedux.push('/home/hfc'));
      } else {
        if (data && data.msg && showMsg) showMsg(data.msg);
        yield put({
          type: 'setState',
          payload: {
            loginButtonDisabled: false,
          },
        });
      }
    },

    /**
     * 重载用户信息
     * @param payload
     * @param callback
     * @param call
     * @param put
     */
    *reloadUserInfo({ payload, callback, reloadDown }, { call, put }) {
      Toast.loading('重新载入用户信息...');
      const { data } = yield call(reloadUserInfo, payload);
      // console.log('responseData of sendSecurityCode:', data);
      if (data && data.success) {
        const { result } = data;
        yield put({
          type: 'setState',
          payload: {
            user: result,
          },
        });
        Toast.hide();
        // if (callback) callback(result);
        if (typeof reloadDown === 'function') reloadDown(result);
      } else if (data && data.msg) {
        Toast.hide();
        if (callback) callback(data.msg);
      }
    },

    /**
     * 从当前登录用户设置当前就诊人及当前档案
     * @param user
     * @param put
     */
    *setCurrInfoFromPatients(arg1, { put, select }) {
      const { user } = yield select(state => state.base);
      if (user.map && user.map.userPatients && user.map.userPatients.length > 0) {
        const { userPatients } = user.map;
        let currPatient = {};
        let currProfile = {};
        for (let j = 0; j < userPatients.length; j++) {
          const p = userPatients[j];
          const { profiles } = p;
          if (profiles && profiles.length > 0) {
            currPatient = p;
            currProfile = profiles[0];
            break;
          }
        }
        console.log('currPatient & currProfile in setCurrInfoFromPatients:', currPatient, currProfile);
        yield put({
          type: 'setState',
          payload: {
            currPatient,
            currProfile,
          },
        });
      }/* else {
        // 转向到常用就诊人
        Toast.info('您还未设置就诊人，请先添加就诊人信息！');
        yield put(routerRedux.replace('/stack/patients'));
      }*/
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    setState(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
