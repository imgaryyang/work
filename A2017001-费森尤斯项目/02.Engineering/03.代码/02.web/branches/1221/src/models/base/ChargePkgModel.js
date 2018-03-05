
import { notification } from 'antd';
import { loadTreeData, savePkg, saveItem, loadGroupPage, loadItems, deleteGroup, deleteItem, makeGroup, deleteFromGroup, sortItems } from '../../services/base/ChargePkgService';

export default {
  namespace: 'chargePkg',
  state: {
    spin: false,
    query: {},
    page: { total: 0, pageSize: 10, pageNo: 1 },
    /* 组套树 */
    pkgs: {
      1: {
        1: [],
        2: [],
        3: [],
      },
      2: {
        1: [],
        2: [],
        3: [],
      },
    },
    order: {
      drugFlag: '1',
    },
    /* 组套列表 */
    groups: [],
    groupListIdx: -1,
    /* 组套信息 */
    groupRecord: {},
    groupEditVisible: false,
    /* 项目 */
    items: [],
    selectedItemRowKeys: [],
    /* 组套项目信息 */
    itemRecord: {},
    /* 被选中项序号 */
    listIdx: -1,
  },
  effects: {

    /**
     * 载入组套树数据
     */
    *loadTreeData({ payload }, { call, put }) {
      // console.log('payload in loadTreeData():', payload);
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(loadTreeData, payload);
      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: {
            pkgs: data.result,
          },
        });
      }
      yield put({ type: 'setState', payload: { spin: false } });
    },

    /**
     * 载入组套列表
     */
    *loadGroupPage({ payload }, { select, call, put }) {
      const { page, query, search } = (payload || {});
      const defaultPage = yield select(state => state.chargePkg.page);
      const chanel = yield select(state => state.chargePkg.chanel);
      const p = { ...defaultPage, ...page };
      // 当重新发起查询时将页码置为 1
      if (search) p.pageNo = 1;
      const start = (p.pageNo - 1) * p.pageSize;
      yield put({ type: 'addSpin' });
      const { data } = yield call(loadGroupPage, start, p.pageSize, query, chanel);
      if (data) {
        yield put({ type: 'initRecord', data, p });
      } else {
        notification.error({
          message: '错误',
          description: '载入组套列表出错，请稍后再试！',
        });
      }
      // 移除载入指示器
      yield put({ type: 'removeSpin' });
    },

    /**
     * 保存组套信息
     */
    *savePkg({ payload }, { select, call, put }) {
      yield put({ type: 'addSpin' });
      // 保存对象
      const { data } = yield call(savePkg, payload);
      if (data && data.success) {
        const saved = data.result;
        yield put({
          type: 'setState',
          payload: {
            groupRecord: saved,
          },
        });

        const { page, query } = yield select(state => state.chargePkg);
        // 原条件重新载入组套列表
        yield put({
          type: 'loadGroupPage',
          payload: {
            page,
            query,
          },
        });
        // 重新载入明细列表
        yield put({ type: 'loadItems', comboId: saved.id });
      } else {
        notification.error({
          message: '错误',
          description: '保存组套信息出错，请稍后再试！',
        });
      }
      // 移除载入指示器
      yield put({ type: 'removeSpin' });
    },

    /**
     * 保存组套明细信息
     */
    *saveItem({ payload }, { select, call, put }) {
      const { items, groupRecord } = yield select(state => state.chargePkg);

      // 组合组套当前明细信息
      const newItem = payload;
      newItem.comboSort = newItem.comboSort || (items.length + 1);

      // 显示载入指示器
      yield put({ type: 'addSpin' });

      // 保存对象
      const { data } = yield call(saveItem, newItem);
      if (data && data.success) {
        const saved = data.result;
        yield put({
          type: 'setState',
          payload: {
            itemRecord: {
              ...{},
              comboId: groupRecord.id,
              drugFlag: groupRecord.drugFlag,
            },
          },
        });
        // 重新载入列表
        yield put({ type: 'loadItems', comboId: saved.comboId });
      } else {
        notification.error({
          message: '错误',
          description: '保存组套明细信息出错，请稍后再试！',
        });
      }
      // 移除载入指示器
      yield put({ type: 'removeSpin' });
    },

    *loadItems({ comboId }, { call, put }) {
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(loadItems, comboId);
      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: {
            spin: false,
            items: data.result,
            itemRecord: {},
            listIdx: -1,
          },
        });
      } else {
        notification.error({
          message: '错误',
          description: '载入组套明细信息出错，请稍后再试！',
        });
      }
    },

    /**
     * 根据id删除组套信息
     */
    *deleteGroup({ id }, { select, call, put }) {
      // 显示载入指示器
      yield put({ type: 'addSpin' });
      const { data } = yield call(deleteGroup, id);
      if (data && data.success) {
        const { page, query } = yield select(state => state.chargePkg);
        // 原条件重新载入组套列表
        yield put({
          type: 'loadGroupPage',
          payload: {
            page,
            query,
          },
        });
        // 清空数据
        yield put({
          type: 'setState',
          payload: {
            items: [],
            groupRecord: {},
            itemRecord: {},
            groupListIdx: -1,
            listIdx: -1,
          },
        });
      } else {
        notification.error({
          message: '错误',
          description: '删除组套出错，请稍后再试！',
        });
      }
      // 移除载入指示器
      yield put({ type: 'removeSpin' });
    },

    /**
     * 根据id删除选中的组套明细
     */
    *deleteItem({ id }, { select, call, put }) {
      // 显示载入指示器
      yield put({ type: 'addSpin' });
      const { data } = yield call(deleteItem, id);
      if (data && data.success) {
        const { groupRecord } = yield select(state => state.chargePkg);
        // 重新载入列表
        yield put({ type: 'loadItems', comboId: groupRecord.id });
      } else {
        notification.error({
          message: '错误',
          description: '删除组套明细出错，请稍后再试！',
        });
      }
      // 移除载入指示器
      yield put({ type: 'removeSpin' });
    },

    /**
     * 成组
     */
    *makeGroup({ payload }, { select, call, put }) {
      // 显示载入指示器
      yield put({ type: 'addSpin' });
      const { groupRecord, selectedItemRowKeys } = yield select(state => state.chargePkg);
      const { data } = yield call(makeGroup, selectedItemRowKeys);
      if (data && data.success) {
        yield put({ type: 'setState', payload: { selectedItemRowKeys: [] } });
        // 重新载入列表
        yield put({ type: 'loadItems', comboId: groupRecord.id });
      } else {
        notification.error({
          message: '错误',
          description: '组合明细出错，请稍后再试！',
        });
      }
      // 移除载入指示器
      yield put({ type: 'removeSpin' });
    },

    /**
     * 从组中删除
     */
    *deleteFromGroup({ payload }, { select, call, put }) {
      // 显示载入指示器
      yield put({ type: 'addSpin' });
      const { groupRecord, selectedItemRowKeys } = yield select(state => state.chargePkg);
      const { data } = yield call(deleteFromGroup, selectedItemRowKeys);
      if (data && data.success) {
        yield put({ type: 'setState', payload: { selectedItemRowKeys: [] } });
        // 重新载入列表
        yield put({ type: 'loadItems', comboId: groupRecord.id });
      } else {
        notification.error({
          message: '错误',
          description: '从组合中移除明细出错，请稍后再试！',
        });
      }
      // 移除载入指示器
      yield put({ type: 'removeSpin' });
    },

    /**
     * 明细排序
     */
    *sortItems({ payload }, { select, call, put }) {
      // 显示载入指示器
      yield put({ type: 'addSpin' });
      const { record, idx, direction } = payload;
      const { groupRecord, items } = yield select(state => state.chargePkg);
      // 如果是通过上/下按钮触发，则先调整前端数组顺序
      if (typeof idx === 'number') {
        // 删除所选行
        items.splice(idx, 1);
        // 隔位插入行
        if (direction === 'up') items.splice(idx - 1, 0, record);
        if (direction === 'down') items.splice(idx + 1, 0, record);
      }
      // 如果是通过“更新排序”按钮触发，则不做操作，按照现有顺序更新数据库中的 COMBO_SORT

      const itemIds = [];
      for (let i = 0; i < items.length; i++) {
        itemIds.push(items[i].id);
      }
      // 调用后台排序
      const { data } = yield call(sortItems, itemIds);
      if (data && data.success) {
        // 重新载入列表
        yield put({ type: 'loadItems', comboId: groupRecord.id });
      } else {
        notification.error({
          message: '错误',
          description: '明细排序出错，请稍后再试！',
        });
      }
      // 移除载入指示器
      yield put({ type: 'removeSpin' });
    },

  },

  reducers: {

    setState(state, { payload }) {
      return { ...state, ...payload };
    },

    addSpin(state) {
      return { ...state, spin: true };
    },

    removeSpin(state) {
      return { ...state, spin: false };
    },
    initRecord(state, { data, p }) {
      const { result, total } = data;
      const resPage = { ...state.page, ...p, total };
      const resData = result || [];
      return { ...state, groups: resData, page: resPage };
    },
  },
};

