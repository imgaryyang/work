import _ from 'lodash';
import { notification } from 'antd';
import { loadMyRoles } from '../../services/base/RoleService';
import { loadRoleUsers, assignUser, unAssignUser, assignMenu, loadRoleMenus } from '../../services/base/AuthService';
import { loadUserPage } from '../../services/base/UserService';
import { loadMenus } from '../../services/base/MenuService';

export default {

  namespace: 'auth',

  state: {
    spin: false,
    roles: [],
    user: {
      page: { total: 0, pageSize: 10, pageNo: 1 },
      data: [],
      selectedRowKeys: [],
    },
    menu: {
      tree: [],
      data: {},
      selectedKeys: [],
    },
    roleId: null,
    // 来源标志
    chanel: '',
  },

  effects: {
    *loadRoles({ payload }, { select, call, put }) {
      const chanel = yield select(state => state.auth.chanel);
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(loadMyRoles, chanel);
      yield put({ type: 'setState', payload: { spin: false } });
      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: { roles: data.result || [] },
        });
      }
    },
    *loadUsers({ payload }, { select, call, put }) {
      const { user, roleId } = yield select(state => state.auth);
      const { page } = (payload || {});
      // console.log(page);
      const newPage = { ...user.page, ...page };
      const { pageNo, pageSize } = newPage;
      const start = (pageNo - 1) * pageSize;
      // console.log(start, pageSize);
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(loadUserPage, start, pageSize);
      yield put({ type: 'setState', payload: { spin: false } });

      if (data && data.success) {
        const { result, total } = data;
        const p = { ...user.page, ...newPage, total };
        const newUser = { ...user, data: result || [], page: p };
        yield put({
          type: 'setState',
          payload: { user: newUser },
        });
      }
      if (roleId) yield put({ type: 'loadUserKeys' });
    },
    *loadUserKeys({ payload }, { select, call, put }) {
      const { user, roleId } = yield select(state => state.auth);
      if (!roleId) return;

      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(loadRoleUsers, roleId);
      yield put({ type: 'setState', payload: { spin: false } });

      if (data && data.success) {
        const selectedRowKeys = data.result || [];
        const newUser = { ...user, selectedRowKeys };
        yield put({
          type: 'setState',
          payload: { user: newUser },
        });
      }
    },
    *clearUsers({ payload }, { put }) {
      const page = { total: 0, pageSize: 10, pageNo: 1 };
      const user = { data: [], selectedRowKeys: [], page };
      yield put({
        type: 'setState',
        payload: { user },
      });
    },
    *assignUser({ userId }, { select, call, put }) {
      const { roleId } = yield select(state => state.auth);
      if (!roleId) return;

      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(assignUser, roleId, userId);
      yield put({ type: 'setState', payload: { spin: false } });
      if (data && data.success) {
        notification.success({ message: '操作成功：', description: '为用户授权角色成功！' });
        yield put({
          type: 'loadUsers',
          roleId,
        });
      }
    },
    *unAssignUser({ userId }, { select, call, put }) {
      const { roleId } = yield select(state => state.auth);
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(unAssignUser, roleId, userId);
      yield put({ type: 'setState', payload: { spin: false } });
      if (data && data.success) {
        notification.success({ message: '操作成功：', description: '解除用户角色授权成功！' });
        yield put({
          type: 'loadUsers',
          roleId,
        });
      }
    },
    *loadMenus({ payload }, { select, call, put }) {
      const { menu, roleId } = yield select(state => state.auth);
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(loadMenus);
      yield put({ type: 'setState', payload: { spin: false } });

      if (data && data.success) {
        const menus = data.result || [];
        const menuMap = {};
        const roots = [];
        for (const m of menus) {
          menuMap[m.id] = m;
          m.children = [];
          if (!_.trim(m.parent)) roots.push(m);
        }
      
        for (const m of menus) {
          if (m.parent && _.trim(m.parent)) {
            const parent = menuMap[m.parent];
            parent.children.push(m);
          }
        }
        const chanel = yield select(state => state.auth.chanel);
      
        if (chanel == 'base') {
          roots.splice(0, 1);
        }
        const newMenu = { ...menu, tree: roots, data: menuMap };

        yield put({
          type: 'setState',
          payload: { menu: newMenu },
        });
      }
      if (roleId) yield put({ type: 'loadMenuKeys' });
    },
    *loadMenuKeys({ payload }, { select, call, put }) {
      const { menu, roleId } = yield select(state => state.auth);
      if (!roleId) return;
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(loadRoleMenus, roleId);
      yield put({ type: 'setState', payload: { spin: false } });

      if (data && data.success) {
        const selectedKeys = data.result || [];
        const newMenu = { ...menu, selectedKeys };
        yield put({
          type: 'setState',
          payload: { menu: newMenu },
        });
      }
    },
    *clearMenu({ payload }, { put }) {
      // const page = { total: 0, pageSize: 10, pageNo: 1 };
      const menu = { data: [], selectedKeys: [] };
      yield put({
        type: 'setState',
        payload: { menu },
      });
    },
    *assignMenu({ menus }, { select, call, put }) {
      const { roleId, menu } = yield select(state => state.auth);
      if (!roleId) return;

      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(assignMenu, roleId, menu.selectedKeys || []);
      yield put({ type: 'setState', payload: { spin: false } });
      if (data && data.success) {
        notification.success({ message: '操作成功：', description: '为角色授权菜单成功！' });
        yield put({
          type: 'loadMenus',
          roleId,
        });
      }
    },
  },

  reducers: {
    setState(oldState, { payload }) {
      return { ...oldState, ...payload };
    },

  },
};
