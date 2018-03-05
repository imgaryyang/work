import { notification } from 'antd';
import { loadOrders, saveItem, deleteItem, makeGroup, deleteFromGroup, sortItems, saveItemsByTmpl } from '../../services/odws/OrderService';

export default {
  namespace: 'odwsOrder',
  state: {
    query: {},
    orders: [],
    itemCount: {},
    totalAmt: 0,
    order: {
      drugFlag: '1',
    },
    listIdx: -1,
    selectedItemRowKeys: [],
    spin: false,
    resetForm: false,
    unitArr: {},
    dept: {},
  },
  effects: {

    /**
     * 载入医嘱
     */
    *loadOrders({ payload }, { call, put }) {
      // 显示载入指示器
      yield put({ type: 'addSpin' });
      const { data } = yield call(loadOrders, payload);
      if (data && data.success) {
        // 按照处方号组合数据
        const orders = [];
        const itemCount = {};
        let totalAmt = 0;
        let recipeId;
        for (let i = 0; i < data.result.length; i++) {
          const theOrder = data.result[i];
          // 增加处方号空行
          if (theOrder.recipeId !== recipeId) {
            orders.push({
              id: `${theOrder.recipeId}_${i}`,
              recipeId: theOrder.recipeId,
              drugFlag: theOrder.drugFlag,
              regId: theOrder.regId,
            });
            recipeId = theOrder.recipeId;
          }
          orders.push(theOrder);
          totalAmt += theOrder.salePrice * theOrder.packQty;
          // 记录处方对应的明细项数量
          itemCount[theOrder.recipeId] = (itemCount[theOrder.recipeId] || 0) + 1;
        }
        // console.log(orders, itemCount);

        yield put({
          type: 'setState',
          payload: {
            orders,
            itemCount,
            totalAmt,
          },
        });
      } else {
        notification.error({
          message: '错误',
          description: '载入医嘱信息出错，请稍后再试！',
        });
      }
      // 移除载入指示器
      yield put({ type: 'removeSpin' });
    },

    /**
     * 保存医嘱明细信息
     */
    *saveItem({ payload }, { select, call, put }) {
      const { order } = yield select(state => state.odwsOrder);
      const { currentReg } = yield select(state => state.odws);
      // 显示载入指示器
      yield put({ type: 'addSpin' });

      // 保存对象
      const { data } = yield call(saveItem, { ...order, ...payload });
      if (data && data.success) {
        // 重置order
        yield put({
          type: 'setState',
          payload: {
            order: {
              ...{},
              drugFlag: data.result.drugFlag,
            },
            resetForm: true,
          },
        });
        // 重新载入列表
        yield put({ type: 'loadOrders', payload: currentReg.id });
      } else {
        notification.error({
          message: '错误',
          description: '保存医嘱明细信息出错，请稍后再试！',
        });
      }
      // 移除载入指示器
      yield put({ type: 'removeSpin' });
    },

    /**
     * 根据组套模板开医嘱
     */
    *saveItemsByTmpl({ payload }, { select, call, put }) {
      const { order } = yield select(state => state.odwsOrder);
      const { currentReg } = yield select(state => state.odws);
      // 显示载入指示器
      yield put({ type: 'addSpin' });
      // 保存对象
      const { data } = yield call(saveItemsByTmpl, payload, currentReg.id, currentReg.patient.id);
      if (data && data.success) {
        // 重置order
        yield put({
          type: 'setState',
          payload: {
            order: {
              drugFlag: order.drugFlag,
            },
          },
        });
        // 重新载入列表
        yield put({ type: 'loadOrders', payload: currentReg.id });
      } else {
        notification.error({
          message: '错误',
          description: data.msg || '保存医嘱明细信息出错，请稍后再试！',
        });
      }
      // 移除载入指示器
      yield put({ type: 'removeSpin' });
    },

    /**
     * 根据id删除选中的明细
     */
    *deleteItem({ id }, { select, call, put }) {
      // 显示载入指示器
      yield put({ type: 'addSpin' });
      const { data } = yield call(deleteItem, id);
      if (data && data.success) {
        const { currentReg } = yield select(state => state.odws);
        // 重新载入列表
        yield put({ type: 'loadOrders', payload: currentReg.id });
      } else {
        notification.error({
          message: '错误',
          description: '删除医嘱明细出错，请稍后再试！',
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
      const { currentReg } = yield select(state => state.odws);
      const { selectedItemRowKeys } = yield select(state => state.odwsOrder);
      const { data } = yield call(makeGroup, selectedItemRowKeys);
      if (data && data.success) {
        yield put({ type: 'setState', payload: { selectedItemRowKeys: [] } });
        // 重新载入列表
        yield put({ type: 'loadOrders', payload: currentReg.id });
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
      const { currentReg } = yield select(state => state.odws);
      const { selectedItemRowKeys } = yield select(state => state.odwsOrder);
      const { data } = yield call(deleteFromGroup, selectedItemRowKeys);
      if (data && data.success) {
        yield put({ type: 'setState', payload: { selectedItemRowKeys: [] } });
        // 重新载入列表
        yield put({ type: 'loadOrders', payload: currentReg.id });
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
      // console.log('sorting...');
      // 显示载入指示器
      yield put({ type: 'addSpin' });
      const { record, idx, direction } = payload;
      const { currentReg } = yield select(state => state.odws);
      const { orders } = yield select(state => state.odwsOrder);
      // 如果是通过上/下按钮触发，则先调整前端数组顺序
      if (typeof idx === 'number') {
        // 删除所选行
        orders.splice(idx, 1);
        // 隔位插入行
        if (direction === 'up') orders.splice(idx - 1, 0, record);
        if (direction === 'down') orders.splice(idx + 1, 0, record);
      }

      const itemIds = [];
      for (let i = 0; i < orders.length; i++) {
        if (orders[i].recipeId === record.recipeId && orders[i].itemName) {
          itemIds.push(orders[i].id);
        }
      }
      // 调用后台排序
      const { data } = yield call(sortItems, itemIds);
      if (data && data.success) {
        // 重新载入列表
        yield put({ type: 'loadOrders', payload: currentReg.id });
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

    setState(oldState, { payload }) {
      return { ...oldState, ...payload };
    },

    addSpin(state) {
      return { ...state, spin: true };
    },

    removeSpin(state) {
      return { ...state, spin: false };
    },
  },
};
