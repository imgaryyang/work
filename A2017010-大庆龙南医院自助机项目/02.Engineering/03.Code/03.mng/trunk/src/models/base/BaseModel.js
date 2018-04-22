import dva from 'dva';
import ajax from '../../utils/ajax';
import { userLogin, userLogout, userInfo, myMenus } from '../../services/base/BaseService';
import baseUtil from '../../utils/baseUtil';
export default {
  namespace: 'base',
  state: {
    user: {},
    login: {
      msg: '',
      redirect: false,
      modal: false,
    },
    menuList: [],
    menuTree: [],
    spin: false,
    visible: false,
    wsHeight: 0,
    noticeProvider: null,
    alertProvider: null,
  },
  subscriptions: {
    errorTip({ dispatch, history }) {
      baseUtil.addAlertProvider((type, title, msg) => {
        dispatch({ type: 'alert', payload: { type, title, msg } });
      });
    },

    ajaxError({ dispatch, history }) { // 监听ajax错误
      ajax.addErrorHandler('401', (status, reponse) => { // 401未登录
        history.push('/login');
      });
      ajax.addErrorHandler('403', (status, reponse) => { // 403未授权
        history.push('/login');
      });
      ajax.addErrorHandler('400+', (status, reponse) => { // 其他400
        dispatch({ type: 'notice',
          payload: {
            type: 'error', title: '通信错误', msg: '与服务器通信错误！',
          },
        });
      });
      ajax.addErrorHandler('500+', (status, reponse) => { // 500服务错误
        dispatch({ type: 'notice',
          payload: {
            type: 'error', title: '服务错误', msg: '服务器出现错误！',
          },
        });
      });
    },
  },

  effects: {
    *notice({ payload }, { select, call, put }) {
      const errorProvider = yield select(state => state.base.errorProvider);
      const { msg } = payload;
      if (errorProvider) errorProvider(msg);
    },
    *alert({ payload }, { select, call, put }) {
      const alertProvider = yield select(state => state.base.alertProvider);
      const { type, title, msg } = payload;
      if (alertProvider) alertProvider(type, title, msg);
    },
    *login({ payload }, { call, put }) {
      const { user } = (payload || {});
      
      yield put({type: 'setState', payload: {spin: true,},});
      const { data } = yield call(userLogin, user);
      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: {
            user: data.result,
          },
        });
        yield put({
          type: 'loadMenus',
        });
      } else if (data && data.msg) { // TODO 登录报错
      }
      yield put({type: 'setState', payload: {spin: false,},});
    },

    *logout({ payload }, { call, put }) {
      const { data } = yield call(userLogout);
      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: { user: {} },
        });
      } else if (data && data.msg) { // TODO 退出
      }
    },

    *loadUserInfo({ payload }, { call, put }) {
      const { data } = yield call(userInfo);
      console.info('loadUserInfo : ', data);
      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: { user: data.result },
        });
      }
    },
    *loadMenus({ payload }, { call, put }) {
      const { data } = yield call(myMenus);
      if (data && data.success) {
        const result = data.result || [];
        const tree = result.arrayToTree();
        console.log(tree);
        yield put({
          type: 'setState',
          payload: { menuList: result, menuTree: tree },
        });
      }
    },
  },
  reducers: {
    setState(oldState, { payload }) {
      return { ...oldState, ...payload };
    },

    // 下面的暂时没有用到
    init(oldState, { payload }) {
      return { ...oldState, ...payload };
    },
    closeLoginWin(oldState, { payload }) {
      const login = { ...oldState.login, ...payload };
      return { ...oldState, login };
    },
    openLoginWin(oldState) {
      return { ...oldState, login: { redirect: false, modal: true, msg: '' } };
    },
    redirectToLogin(oldState) {
      return { ...oldState, login: { redirect: true, modal: false, msg: '' } };
    },
  },
};
