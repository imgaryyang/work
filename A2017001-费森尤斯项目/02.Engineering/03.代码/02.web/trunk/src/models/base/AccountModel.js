
import { notification } from 'antd';
import { loadAccountPage, saveAccount, deleteAccount, deleteAllAccounts } from '../../services/base/AccountService';

export default {

  namespace: 'account',

  state: {
    info: {},
    page: { total: 0, pageSize: 10, pageNo: 1 },
    selectedRowKeys: [],
    data: [],
    record: null,
    spin: false,
  },

  effects: {
    /**
     * 获取所有用户信息
     */
    *load({ payload }, { select, call, put }) {
      const { page, query } = (payload || {});
      const defaultPage = yield select(state => state.Account.page);
      const newPage = { ...defaultPage, ...page };
      const { pageNo, pageSize } = newPage;
      const start = (pageNo - 1) * pageSize;
      yield put({
        type: 'setState',
        payload: {
          spin: true,
        },
      });
      const { data } = yield call(loadAccountPage, start, pageSize, query);
      yield put({
        type: 'setState',
        payload: {
          spin: false,
        },
      });
      if (data && data.success) {
        yield put({
          type: 'init',
          data,
          page: newPage,
        });
      } else {
        notification.error({ message: '错误：', description: data.msg || '未知错误！' });
      }
    },
    /**
     * 新增账户
     */
    *save({ params }, { select, call, put }) {
      console.info('save', arguments);
      yield put({
        type: 'setState',
        payload: {
          spin: true,
        },
      });
      const { data } = yield call(saveAccount, params);
      console.log('data:', data);
      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: {
            record: null,
          },
        });
        yield put({
          type: 'load',
        });
      } else {
        notification.error({ message: '错误：', description: data.msg || '未知错误！' });
      }
      yield put({
        type: 'setState',
        payload: {
          spin: false,
        },
      });
    },
    /**
     * 删除单个账户
     */
    *delete({ id }, { select, call, put }) {
      yield put({
        type: 'setState',
        payload: {
          spin: true,
        },
      });
      const { data } = yield call(deleteAccount, id);
      yield put({
        type: 'setState',
        payload: {
          spin: false,
        },
      });
      if (data && data.success) {
        yield put({
          type: 'load',
        });
      } else {
        notification.error({ message: '错误：', description: data.msg || '未知错误！' });
      }
    },
    /**
     * 批量删除账户
     */
    *deleteSelected({}, { select, call, put }) {
      const selectedRowKeys = yield select(state => state.Account.selectedRowKeys);
      yield put({
        type: 'setState',
        payload: {
          spin: true,
        },
      });
      const { data } = yield call(deleteAllAccounts, selectedRowKeys);
      yield put({
        type: 'setState',
        payload: {
          spin: false,
        },
      });
      if (data && data.success) {
        yield put({
          type: 'load',
        });
      } else {
        notification.error({ message: '错误：', description: data.msg || '未知错误！' });
      }
    },
  },

  reducers: {

    init(state, { data, page }) {
      const { result, total, pageSize, start } = data;
      const p = { ...state.page, ...page, total };
      const Accounts = result || [];
      return {
        ...state,
        Accounts,
        page: p,
      };
    },

    setState(oldState, { state }) {
      return {
        ...oldState,
        ...state,
      };
    },

  },
};
