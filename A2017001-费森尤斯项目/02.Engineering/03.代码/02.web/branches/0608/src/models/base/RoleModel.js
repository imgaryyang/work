import { loadMyRoles, loadMyRolePage, saveRole, deleteRole, deleteAllRoles } from '../../services/base/RoleService';
export default {

  namespace: 'role',

  state: {
    info: {},
    page: { total: 0, pageSize: 10, pageNo: 1 },
    data: [],
    selectedRowKeys: [],
    record: null,
    spin: false,
  },

  effects: {
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
      const { data } = yield call(loadMyRolePage, start, pageSize, query);
      // console.log('role data:', data);
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
    /**
     * 新增用户
     */
    *save({ params }, { call, put }) {
      yield put({
        type: 'setState',
        payload: { spin: true },
      });
      const { data } = yield call(saveRole, params);
      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: {
            record: null,
          },
        });
        yield put({ type: 'load' });
      }
      yield put({
        type: 'setState', payload: { spin: false },
      });
    },
    *delete({ id }, { call, put }) {
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(deleteRole, id);
      yield put({ type: 'setState', payload: { spin: false } });
      if (data && data.success) {
        yield put({ type: 'loadTypes' });
        yield put({ type: 'load' });
      }
    },

    *deleteSelected({ payload }, { select, call, put }) {
      const selectedRowKeys = yield select(state => state.role.selectedRowKeys);
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(deleteAllRoles, selectedRowKeys);
      yield put({ type: 'setState', payload: { spin: false } });
      if (data && data.success) {
        yield put({ type: 'loadTypes' });
        yield put({ type: 'load' });
      }
    },
  },

  reducers: {

    init(state, { data, page }) {
      const { result, total } = data;
      const p = { ...state.page, ...page, total };
      const newData = result || [];
      return { ...state, data: newData, page: p };
    },

    setState(oldState, { payload }) {
      return { ...oldState, ...payload };
    },

  },
};
