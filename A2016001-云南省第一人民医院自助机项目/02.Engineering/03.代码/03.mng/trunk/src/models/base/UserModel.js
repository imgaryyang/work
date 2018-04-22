import { loadUserPage, saveUser, enableUser, disableUser } from '../../services/base/UserService';

import { loadUserAccounts, saveAccount, resetAccountPwd, deleteAccount } from '../../services/base/AccountService';

export default {

  namespace: 'user',

  state: {
    info: {},
    page: { total: 0, pageSize: 10, pageNo: 1 },
    data: [],
    accounts: [],
    selectedRowKeys: [],
    record: {},
    spin: false,
    visible: false,
  },

  effects: {
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
      }
    },
    *saveUserAccount({ payload }, { select, call, put }) {
      const user = yield select(state => state.user.record);
      const account = { ...payload.account, userId: user.id };
      yield put({ type: 'setState', payload: { spin: true } });

      const { data } = yield call(saveAccount, account);

      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: {
            spin: false,
            record: {},
          },
        });
        yield put({
          type: 'loadUserAccounts',
        });
      }
    },
    *deleteUserAccount({ id }, { call, put }) {
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(deleteAccount, id);
      yield put({ type: 'setState', payload: { spin: false } });
      if (data && data.success) {
        yield put({ type: 'loadUserAccounts' });
      }
    },
    *resetAccountPwd({ id }, { call, put }) {
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(resetAccountPwd, id);
      yield put({ type: 'setState', payload: { spin: false } });
      if (data && data.success) {
        yield put({ type: 'loadUserAccounts' });
      }
    },

    /**
     * 获取所有用户信息
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
      yield put({
        type: 'setState', payload: { spin: false },
      });
      if (data && data.success) {
        yield put({
          type: 'init',
          data,
          page: newPage,
        });
      }
    },

    *loadUserInfo({ payload }, { call, put }) {
      const { record } = payload;
      yield put({
        type: 'setState',
        payload: {
          spin: true,
          visible: true,
        },
      });
      /* const { data } = yield call(loadUserDepts, { userId: record.id });
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
      }*/
      // console.log(record);
      yield put({
        type: 'setState',
        payload: {
          record,
          spin: false,
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
        payload: { spin: true },
      });
      const { data } = yield call(saveUser, params);
      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: {
            spin: false,
            visible: false,
            record: {},
          },
        });
        yield put({ type: 'load' });
      }
      yield put({
        type: 'setState', payload: { spin: false },
      });
    },
    *enable({ id }, { call, put }) {
      yield put({
        type: 'setState', payload: { spin: true },
      });
      const { data } = yield call(enableUser, id);
      yield put({
        type: 'setState', payload: { spin: false },
      });
      if (data && data.success) {
        yield put({ type: 'load' });
      }
    },
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
      }
    },
  },

  reducers: {

    init(state, { data, page }) {
      const { result, total } = data;
      const p = { ...state.page, ...page, total };
      const users = result || [];
      return { ...state, data: users, page: p };
    },

    setState(oldState, { payload }) {
      return { ...oldState, ...payload };
    },

  },
};
