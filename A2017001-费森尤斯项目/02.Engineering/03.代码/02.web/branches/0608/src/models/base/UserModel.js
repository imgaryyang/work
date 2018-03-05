import { notification } from 'antd';

import { loadUserPage, loadUserDepts, saveUser, enableUser, disableUser, loadUserDeptsByIds } from '../../services/base/UserService';

import { loadUserAccounts, saveAccount, resetAccountPwd, deleteAccount } from '../../services/base/AccountService';

export default {

  namespace: 'user',

  state: {
    info: {},
    page: { total: 0, pageSize: 10, pageNo: 1 },
    query: {},
    data: [],
    loginDepts: {},
    accounts: [],
    selectedRowKeys: [],
    record: {},
    spin: false,
    visible: false,
    editorSpin: false,
  },

  effects: {
    /**
     * 载入用户登录账户
     */
    *loadUserAccounts({ payload }, { select, call, put }) {
      const record = yield select(state => state.user.record);

      yield put({ type: 'setState', payload: { spin: true } });

      const { data } = yield call(loadUserAccounts, record.id);

      yield put({ type: 'setState', payload: { spin: false } });

      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: { accounts: data.result },
        });
      } else {
        notification.error({ message: '错误：', description: data.msg || '获取用户登录账户列表发生未知错误！' });
      }
    },

    /**
     * 保存用户登录账户
     */
    *saveUserAccount({ payload }, { select, call, put }) {
      const user = yield select(state => state.user.record);
      const account = { ...payload.account, userId: user.id };
      yield put({ type: 'setState', payload: { editorSpin: true } });

      const { data } = yield call(saveAccount, account);

      if (data && data.success) {
        /* yield put({
          type: 'setState',
          payload: {
            editorSpin: false,
            // record: {},
          },
        });*/
        yield put({
          type: 'loadUserAccounts',
        });
        notification.success({ message: '提示：', description: '保存用户登录账户成功！' });
      } else {
        notification.error({ message: '错误：', description: data.msg || '未知错误！' });
      }
      yield put({ type: 'setState', payload: { editorSpin: false } });
    },

    /**
     * 删除用户登录账户
     */
    *deleteUserAccount({ id }, { call, put }) {
      yield put({ type: 'setState', payload: { editorSpin: true } });
      const { data } = yield call(deleteAccount, id);
      if (data && data.success) {
        yield put({ type: 'loadUserAccounts' });
        notification.success({ message: '提示：', description: '删除用户登录账户成功！' });
      } else {
        notification.error({ message: '错误：', description: data.msg || '未知错误！' });
      }
      yield put({ type: 'setState', payload: { editorSpin: false } });
    },

    /**
     * 重置用户密码
     */
    *resetAccountPwd({ id }, { call, put }) {
      yield put({ type: 'setState', payload: { editorSpin: true } });
      const { data } = yield call(resetAccountPwd, id);
      if (data && data.success) {
        yield put({ type: 'loadUserAccounts' });
        notification.success({ message: '提示：', description: '重置用户密码成功！' });
      } else {
        notification.error({ message: '错误：', description: data.msg || '未知错误！' });
      }
      yield put({ type: 'setState', payload: { editorSpin: false } });
    },

    /**
     * 获取所有用户列表
     */
    *load({ payload }, { select, call, put }) {
      const { page, query } = (payload || {});
      const defaultPage = yield select(state => state.user.page);
      const newPage = { ...defaultPage, ...page };
      const { pageNo, pageSize } = newPage;
      const start = (pageNo - 1) * pageSize;
      yield put({
        type: 'setState',
        payload: { spin: true },
      });
      const { data } = yield call(loadUserPage, start, pageSize, query);
      if (data && data.success) {
        const { result, total } = data;
        newPage.total = total;
        const users = result || [];
        const ids = [];
        const loginDepts = {};
        users.forEach((user) => {
          ids.push(user.id);
          loginDepts[user.id] = [];
        });
        if (ids.length > 0) {
          const deptsData = yield call(loadUserDeptsByIds, ids);
          if (deptsData.data && deptsData.data.success) {
            deptsData.data.result.forEach((loginDept) => {
              loginDepts[loginDept.userId].push(loginDept);
            });
          }
        }
        yield put({
          type: 'setState',
          payload: {
            data: users,
            loginDepts,
            page: newPage,
            query,
          },
        });
      }
      yield put({
        type: 'setState', payload: { spin: false },
      });
    },

    /**
     * 根据用户id载入用户信息
     */
    *loadUserInfo({ payload }, { call, put }) {
      const { record } = payload;
      yield put({
        type: 'setState',
        payload: {
          editorSpin: true,
          visible: true,
        },
      });
      const { data } = yield call(loadUserDepts, { userId: record.id });
      if (data && data.success && data.result.length) {
        const loginDepts = [];
        let loginDeptsCode = ';';
        let loginDeptsName = ';';
        for (let i = 0; i < data.result.length; i += 1) {
          loginDepts.push(data.result[i].deptId);
          loginDeptsCode = `${data.result[i].deptCode};${loginDeptsCode}`;
          loginDeptsName = `${data.result[i].deptName};${loginDeptsName}`;
        }
        record.loginDepts = loginDepts;
        record.loginDeptsCode = loginDeptsCode;
        record.loginDeptsName = loginDeptsName;
      }
      // console.log(record);
      yield put({
        type: 'setState',
        payload: {
          record,
          editorSpin: false,
        },
      });
    },

    /**
     * 新增用户
     */
    *save({ params }, { call, put }) {
      // console.info('save', params);
      yield put({
        type: 'setState',
        payload: { editorSpin: true },
      });
      const { data } = yield call(saveUser, params);
      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: {
            editorSpin: false,
            visible: false,
            record: {},
          },
        });
        yield put({ type: 'load' });
        notification.success({ message: '提示：', description: '保存用户信息成功！' });
      } else {
        notification.error({ message: '错误：', description: data.msg || '未知错误！' });
      }
      yield put({
        type: 'setState', payload: { editorSpin: false },
      });
    },

    /**
     * 将用户状态设为可用
     */
    *enable({ id }, { call, put }) {
      yield put({
        type: 'setState', payload: { spin: true },
      });
      const { data } = yield call(enableUser, id);
      if (data && data.success) {
        yield put({ type: 'load' });
        notification.success({ message: '提示：', description: '已启用该用户！' });
      } else {
        notification.error({ message: '错误：', description: data.msg || '未知错误！' });
      }
      yield put({
        type: 'setState', payload: { spin: false },
      });
    },

    /**
     * 禁用用户
     */
    *disable({ id }, { call, put }) {
      yield put({
        type: 'setState', payload: { spin: true },
      });
      const { data } = yield call(disableUser, id);
      yield put({
        type: 'setState', payload: { spin: false },
      });
      if (data && data.success) {
        yield put({ type: 'load' });
        notification.success({ message: '提示：', description: '已禁用该用户！' });
      } else {
        notification.error({ message: '错误：', description: data.msg || '未知错误！' });
      }
    },
  },

  reducers: {

    setState(oldState, { payload }) {
      return { ...oldState, ...payload };
    },

  },
};
