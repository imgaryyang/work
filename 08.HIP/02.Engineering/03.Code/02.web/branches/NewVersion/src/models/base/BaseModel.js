import { notification } from 'antd';
import _ from 'lodash';
import ajax from '../../utils/ajax';
import {
  userLogin, userLogout, userInfo, myMenus, mySystems, mySystemMenus, chooseLoginDept, loadNotificationMsg,
} from '../../services/base/BaseService';
import { loadUserDepts } from '../../services/base/UserService';
import { changeAccountPwd } from '../../services/base/AccountService';
import baseUtil from '../../utils/baseUtil';
// import print from '../../utils/print';

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
    loginDeptSpin: false,
    toHome: false,
    visible: false,
    changeVisible: false,
    userDepts: [],
    docHeight: 0,
    wsHeight: 0,
    errorProvider: desc => notification.error({
      message: '提示信息：',
      description: desc,
    }),
    noticeProvider: null,
    alertProvider: null,
    changeLoginDept: false,
    isPrintAlert: false,
    /**
     * 错误码及对应公共提示信息
     */
    statusMsg: {
      0: '看来服务器闹情绪了，请您稍等片刻再试吧！',
      400: '服务器无法处理此请求',
      401: '请求未授权',
      403: '禁止访问此请求',
      404: '请求的资源不存在',
      405: '不允许此请求',
      406: '不可接受的请求',
      407: '您发送的请求需要代理身份认证',
      412: '请求的前提条件失败',
      414: '请求URI超长',
      500: '服务器内部错误',
      501: '服务器不支持此请求所需的功能',
      502: '网关错误',
    },
    notifyMsg: [],
  },
  subscriptions: {
    errorTip({ dispatch }) {
      baseUtil.addAlertProvider((type, title, msg) => {
        dispatch({ type: 'alert', payload: { type, title, msg } });
      });
    },

    ajaxError({ dispatch, history }) { // 监听ajax错误
      ajax.addErrorHandler('401', () => { // 401未登录
        history.push('/login');
      });
      ajax.addErrorHandler('403', () => { // 403未授权
        history.push('/login');
      });
      ajax.addErrorHandler('400+', (status, response) => { // 其他400
        dispatch({
          type: 'notice',
          payload: { status, response },
        });
      });
      ajax.addErrorHandler('500+', (status, response) => { // 500服务错误
        dispatch({
          type: 'notice',
          payload: { status, response },
        });
      });
    },

    // setup({ dispatch, history }) {
    //   history.listen(({ pathname }) => {
    //     if (pathname === '/' || pathname === '/login') {
    //       dispatch({ type: 'checkPrintAlert' });
    //     }
    //   });
    // },
  },

  effects: {
    *notice({ payload }, { select }) {
      const errorProvider = yield select(state => state.base.errorProvider);
      const statusMsg = yield select(state => state.base.statusMsg);
      const { status } = payload;

      if (errorProvider) {
        errorProvider(statusMsg[status]);
      }
    },
    *alert({ payload }, { select }) {
      const alertProvider = yield select(state => state.base.alertProvider);
      const statusMsg = yield select(state => state.base.statusMsg);
      const { status } = payload;

      if (alertProvider) {
        if (typeof status === 'undefined') {
          alertProvider('', '', payload.msg);
        } else {
          alertProvider('', '', statusMsg[status]);
        }
      }
    },

    *login({ payload }, { call, put }) {
      const { user } = (payload || {});
      yield put({
        type: 'setState',
        payload: {
          spin: true,
        },
      });
      const { data } = yield call(userLogin, user);
      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: {
            user: data.result,
            toHome: false,
          },
        });
        yield put({
          type: 'loadUserDepts',
        });
        yield put({
          type: 'loadMenus',
        });
        yield put({
          type: 'setState',
          payload: {
            spin: false,
          },
        });
      } else { // TODO 登录报错
        yield put({
          type: 'setState',
          payload: {
            spin: false,
          },
        });
        notification.error({ message: '登录错误：', description: data.msg || '未知登录错误！' });
      }
    },

    *logout({ payload }, { call, put }) {
      const { data } = yield call(userLogout);
      if (data && data.success) {
        notification.success({ message: '提示：', description: data.msg || '您已退出系统！' });
        yield put({
          type: 'setState',
          payload: { user: {}, toHome: false },
        });
      } else if (data && data.msg) { // TODO 退出
        notification.error({ message: '错误', description: data.msg });
      }
    },

    *loadChangePwd({ payload }, { call, put }) {
      const { query } = payload;
      const { data } = yield call(changeAccountPwd, query);
      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: { changeVisible: false },
        });
        notification.success({ message: '修改成功', description: '密码修改成功，请牢记新密码！' });
      } else {
        notification.error({ message: '失败', description: `密码修改失败：${data.msg}` });
      }
    },

    *loadUserInfo({ payload }, { call, put }) {
      const { data } = yield call(userInfo);
      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: { user: data.result, toHome: false },
        });
      }
    },

    *loadUserDepts({ payload }, { select, call, put }) {
      const user = yield select(state => state.base.user);
      yield put({
        type: 'setState',
        payload: {
          loginDeptSpin: true,
          toHome: false,
        },
      });
      const { data } = yield call(loadUserDepts, { userId: user.id });
      const userDepts = [];
      userDepts.push({
        deptId: user.deptId,
        deptCode: user.deptCode,
        deptName: user.deptName,
      });
      if (data && data.success && data.result.length) {
        for (let i = 0; i < data.result.length; i += 1) {
          const dept = data.result[i];
          if (dept.deptId !== user.deptId) {
            userDepts.push({
              deptId: dept.deptId,
              deptCode: dept.deptCode,
              deptName: dept.deptName,
            });
          }
        }
      }
      const visible = userDepts.length > 1 || false;
      yield put({
        type: 'setState',
        payload: {
          userDepts,
          loginDeptSpin: false,
          visible,
        },
      });
    },

    *chooseLoginDept({ payload }, { call, put }) {
      const { loginDept } = payload;
      yield put({
        type: 'setState',
        payload: {
          loginDeptSpin: true,
        },
      });
      const { data } = yield call(chooseLoginDept, loginDept.deptId);
      yield put({
        type: 'setState',
        payload: {
          loginDeptSpin: false,
          visible: false,
          changeLoginDept: false,
          user: data.result,
          toHome: true,
        },
      });
    },

    *loadMenus({ payload }, { call, put }) {
      const { data } = yield call(myMenus);
      if (data && data.success) {
        const result = data.result || [];
        const tree = result.arrayToTree();
        yield put({
          type: 'setState',
          payload: { menuList: result, menuTree: tree },
        });
      }
    },
    /**
     * @Deprecated
     */
    *loadSystems({ payload }, { call, put }) { //
      const { data } = yield call(mySystems);
      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: { systems: data.result || [] },
        });
      }
    },
    /**
     * @Deprecated
     */
    *loadSystemMenus({ payload }, { call, put }) {
      const { system } = payload;
      const { data } = yield call(mySystemMenus, system);
      if (data && data.success) {
        const tree = data.result.arrayToTree();
        yield put({
          type: 'setState',
          payload: { menuList: tree },
        });
      }
    },

    *checkPrintAlert({ payload }, { put }) {
      // const lodop = yield print.getLodop();
      // console.log(lodop);
      // yield put({
      //   type: 'setState',
      //   payload: { isPrintAlert: _.isUndefined(lodop) },
      // });
    },

    *getNotificationMsg({ payload = {} }, { call, put }) {
      const { query } = payload;
      const { data } = yield call(loadNotificationMsg, query);
      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: { notifyMsg: data.result },
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
