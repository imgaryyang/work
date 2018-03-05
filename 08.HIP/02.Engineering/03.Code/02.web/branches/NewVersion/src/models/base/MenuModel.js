import { notification } from 'antd';
import { loadMenuPage, saveMenu, deleteAll } from '../../services/base/MenuService';

export default {
  namespace: 'mngMenu',
  state: {
    tabs: [],
    activeKey: '',
    page: { total: 0, pageSize: 1000, pageNo: 1 },
    menus: [],

    checkedKeys: [],
    selectedNode: {},
    menu: {},

    showIconSelecter: false,
    spin: false,
    chanel: '',
  },
  effects: {

    *load({ payload }, { select, call, put }) {
      const { page, query } = (payload || {});
      const chanel = yield select(state => state.mngMenu.chanel);
      console.log(chanel);
      const defaultPage = yield select(state => state.mngMenu.page);
      const p = { ...defaultPage, ...page };
      const start = (p.pageNo - 1) * p.pageSize;

      yield put({ type: 'addSpin' });

      const { data } = yield call(loadMenuPage, start, p.pageSize, query, chanel);
      console.log(data);
      if (data && data.success) {
        yield put({
          type: 'init',
          data,
          page: p,
        });
        // 移除载入指示器
        yield put({ type: 'removeSpin' });
      } else {
        notification.error({ message: '错误：', description: data.msg || '查询菜单信息出错！' });
        yield put({ type: 'setState', payload: { spin: false } });
      }
    },

    *save({ params }, { select, call, put }) {
      // console.log(params);
      yield put({ type: 'addSpin' });
      const { data } = yield call(saveMenu, params);

      if (data && data.success) {
        notification.success({ message: '提示：', description: '保存菜单信息成功！' });
        // 重新载入菜单数据
        yield put({
          type: 'load',
        });

        // 如果是新增，新增后将被选树状菜单节点设置为新增节点
        if (!params.id) {
          const { selectedNode } = yield select(state => state.mngMenu);
          // console.log('current selectedNode:', {...selectedNode});
          const node = { ...data.result };
          // console.log('node from server:', {...node});
          if (!node.parent) { // 当前被选为1级
            node.parent = {};
          } else if (node.parent === selectedNode.id) { // 当前被选是父节点
            node.parent = selectedNode;
          } else {
            node.parent = selectedNode.parent;
          }
          // console.log('new node:', node);
          // 将当前被选设置为新node
          yield put({
            type: 'setState',
            state: {
              selectedNode: node,
              menu: node,
              spin: false,
            },
          });
        } else {
          // 移除载入指示器
          yield put({ type: 'removeSpin' });
        }
      } else {
        notification.error({ message: '错误：', description: data.msg || '保存菜单信息出错！' });
        yield put({ type: 'setState', payload: { spin: false } });
      }
    },

    *deleteSelected({ payload }, { select, call, put }) {
      const checkedKeys = yield select(state => state.mngMenu.checkedKeys);
      yield put({ type: 'addSpin' });
      const { data } = yield call(deleteAll, checkedKeys);
      yield put({ type: 'removeSpin' });

      if (data && data.success) {
        notification.success({ message: '提示：', description: '删除菜单信息成功！' });
        yield put({
          type: 'setState',
          state: {
            checkedKeys: [],
            selectedNode: {},
            menu: {},
          },
        });
        yield put({ type: 'load' });
      } else {
        notification.error({ message: '错误：', description: data.msg || '删除菜单信息出错！' });
        yield put({ type: 'setState', payload: { spin: false } });
      }
    },
  },
  reducers: {

    init(state, { data, page }) {
      const { result = result || [], total } = data;
      // result = result || [];
      const p = { ...state.page, ...page, total };

      const tree = result.arrayToTree();
      console.log(tree);
      // tree.splice(tree.indexOf(tree[0]), 1);
      // console.log(tree);
      const menus = tree || [];

      return {
        ...state,
        menus,
        checkedKeys: [],
        page: p,
      };
    },

    setState(oldState, { state }) {
      return { ...oldState, ...state };
    },

    addSpin(state) {
      return { ...state, spin: true };
    },

    removeSpin(state) {
      return { ...state, spin: false };
    },
  },
};
