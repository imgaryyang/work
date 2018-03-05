import { notification } from 'antd';
import { getRegInfo } from '../../services/appointment/RegInfoService';
import { loadDiagnosis } from '../../services/odws/DiagnoseService';
import { loadMedicalRecord } from '../../services/odws/MedicalRecordService';
import { loadOrders, loadOrdersDetail, withDrawal } from '../../services/odws/OrderService';
import { loadHistoryFeeItem } from '../../services/odws/HistoryService';

export default {
  namespace: 'visitRecord',
  state: {
    page: { total: 0, pageSize: 10, pageNo: 1 },
    query: {},
    listIdx: -1,
    historyRecords: [],
    spin: false,
    // 挂号
    reg: {},
    // 诊断
    diagnosis: [],
    // 病历 | 问诊
    medicalRecord: {},
    // 医嘱
    orders: [],
    totalAmt: 0,
    visible: false,
    temOrder: [],
  },
  effects: {
     /**
     * 保存退药信息
     */
    *save({ payload }, { select, call, put }) {
      yield put({ type: 'addSpin' });
      const { newOrders } = yield select(state => state.visitRecord);
      if (newOrders.length === 0) {
        return;
      }
      const query = [];
      for (let i = 0; i < newOrders.length; i++) {
        if (newOrders[i].itemId === undefined) {
          continue;
        } else {
          const qty = newOrders[i].qty - newOrders[i].backqty;
          newOrders[i].qty = qty;
          query.push(newOrders[i]);
        }
      }
      const data = yield call(withDrawal, query);
      yield put({ type: 'removeSpin' });
      if (data.data.success) {
        notification.info({ message: '提示信息：', description: '医生站退药成功！' });
        yield put({ type: 'setState', payload: { visible: false } });
        yield put({ type: 'loadHistoryFeeItem', payload: { } });
      } else {
        notification.error({ message: '错误 ', description: data.data.msg || '后台程序错误', duration: 0 });
      }
    },
     /**
     * 拆分医嘱信息
     */
    *splitOrders({ payload }, { select, call, put }) {
      const { newOrders } = yield select(state => state.visitRecord);
      if (newOrders.length === 0) {
        return;
      }
      const query = [];
      for (let i = 0; i < newOrders.length; i++) {
        if (newOrders[i].itemId === undefined) {
          continue;
        } else {
          if (!newOrders[i].backqty) {
            newOrders[i].backqty = 0;
          }
          query.push(newOrders[i]);
        }
      }
      yield put({
        type: 'setState',
        payload: {
          temOrder: query,
        },
      });
    },
      /**
     * 载入已收费的挂号记录
     */
    *loadHistoryFeeItem({ payload }, { select, call, put }) {
      // 显示载入指示器
      yield put({ type: 'addSpin' });
        // 清空当前数据
      yield put({
        type: 'setState',
        payload: {
          record: {},
          listIdx: '-1',
          orders: [],
          totalAmt: 0,
        },
      });
      const { page, query, search } = (payload || {});

      const defaultPage = yield select(state => state.visitRecord.page);
      const p = { ...defaultPage, ...page };

      const start = search ? 0 : (p.pageNo - 1) * p.pageSize;
      // 显示载入指示器
      // yield put({ type: 'addSpin' });
      const { data } = yield call(loadHistoryFeeItem, start, p.pageSize, query);
      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: {
            page: { ...p, ...{ total: data.total } },
            query: query || {},
            historyRecords: data.result,
          },
        });
      } else {
        notification.error({
          message: '错误',
          description: '载入诊疗历史信息出错，请稍后再试！',
        });
      }

      // 移除载入指示器
      yield put({ type: 'removeSpin' });
    },
    /**
     * 载入诊疗历史记录详情
     */
    *loadDetail({ payload }, { select, call, put }) {
      // 显示载入指示器
      yield put({ type: 'addSpin' });

      // 当前诊疗记录 | 完成的挂号信息
      const { record } = payload;
      if (record.id) {
        // 载入挂号信息 getPatientRegInfo
        const regData = yield call(getRegInfo, record.id);
        // 载入诊断信息
        const diagnosisData = yield call(loadDiagnosis, record.id);
        // 载入病历信息
        const medicalRecordData = yield call(loadMedicalRecord, record.id);
        // 载入医嘱信息
        const orderData = yield call(loadOrders, record.id);

        if (diagnosisData.data && diagnosisData.data.success
          && medicalRecordData.data && medicalRecordData.data.success
          && orderData.data && orderData.data.success
        ) {
          // 按照处方号组合数据
          const orders = [];
          const itemCount = {};
          let totalAmt = 0;
          let recipeId;
          for (let i = 0; i < orderData.data.result.length; i++) {
            const theOrder = orderData.data.result[i];
            // 增加处方号空行
            if (theOrder.recipeId !== recipeId) {
              orders.push({
                id: `${theOrder.recipeId}_${i}`,
                recipeId: theOrder.recipeId,
                drugFlag: theOrder.drugFlag,
              });
              recipeId = theOrder.recipeId;
            }
            orders.push(theOrder);
            totalAmt += theOrder.salePrice * theOrder.qty;
            // 记录处方对应的明细项数量
            itemCount[theOrder.recipeId] = (itemCount[theOrder.recipeId] || 0) + 1;
          }
          yield put({
            type: 'setState',
            payload: {
              reg: regData.data.result || {},
              diagnosis: diagnosisData.data.result || [],
              medicalRecord: medicalRecordData.data.result || {},
              orders,
              totalAmt,

            },
          });
        }
      }
      // 移除载入指示器
      yield put({ type: 'removeSpin' });
    },
    // 退药界面加载具体的医嘱明细
    *loadDetailOrders({ payload }, { select, call, put }) {
      // 显示载入指示器
      yield put({ type: 'addSpin' });
      const { record } = payload;
        // 载入医嘱信息
      const orderData = yield call(loadOrdersDetail, record.id);

      if (orderData.data && orderData.data.success) {
          // 按照处方号组合数据
        const orders = [];
        const itemCount = {};
        let totalAmt = 0;
        let recipeId;
        for (let i = 0; i < orderData.data.result.length; i++) {
          const theOrder = orderData.data.result[i];
          // 增加处方号空行
          if (theOrder.recipeId !== recipeId) {
            orders.push({
              id: `${theOrder.recipeId}_${i}`,
              recipeId: theOrder.recipeId,
              drugFlag: theOrder.drugFlag,
            });
            recipeId = theOrder.recipeId;
          }
          theOrder.comm = theOrder.qty;
          orders.push(theOrder);
          totalAmt += theOrder.salePrice * theOrder.qty;
          // 记录处方对应的明细项数量
          itemCount[theOrder.recipeId] = (itemCount[theOrder.recipeId] || 0) + 1;
        }
        yield put({
          type: 'setState',
          payload: {
            orders,
            totalAmt,
          },
        });
        yield put({ type: 'removeSpin' });
      } else {
        notification.info({
          message: '提示信息：',
          description: orderData.data.msg || '',
        });
        yield put({ type: 'removeSpin' });
      }
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
