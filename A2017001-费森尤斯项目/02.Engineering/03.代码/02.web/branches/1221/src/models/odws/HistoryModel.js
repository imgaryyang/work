import { notification } from 'antd';
import { loadHistory, loadHistoryFeeItem } from '../../services/odws/HistoryService';
import { loadDiagnosis } from '../../services/odws/DiagnoseService';
import { loadMedicalRecord } from '../../services/odws/MedicalRecordService';
import { loadOrders } from '../../services/odws/OrderService';

export default { 
  namespace: 'odwsHistory',
  state: {
    page: { total: 0, pageSize: 10, pageNo: 1 },
    query: {},
    listIdx: -1,
    historyRecords: [],
    record: {},
    spin: false,

    // 诊断
    diagnosis: [],
    // 病历 | 问诊
    medicalRecord: {},
    // 医嘱
    orders: [],
    totalAmt: 0,
  },
  effects: {
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
          diagnosis: [],
          medicalRecord: {},
          orders: [],
          totalAmt: 0,
        },
      });

      const { page, query, search } = (payload || {});

      const defaultPage = yield select(state => state.odwsHistory.page);
      const p = { ...defaultPage, ...page };

      const start = search ? 0 : (p.pageNo - 1) * p.pageSize;
      // 显示载入指示器
      yield put({ type: 'addSpin' });
      const { data } = yield call(loadHistoryFeeItem, start, p.pageSize, query);
      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: {
            page: { ...p, ...{ total:data.total } },
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
     * 载入诊疗历史列表
     */
    *loadHistory({ payload }, { select, call, put }) {
      // 显示载入指示器
      yield put({ type: 'addSpin' });
      // 清空当前数据
      yield put({
        type: 'setState',
        payload: {
          record: {},
          listIdx: '-1',
          diagnosis: [],
          medicalRecord: {},
          orders: [],
          totalAmt: 0,
        },
      });

      const { page, query, search } = (payload || {});

      const defaultPage = yield select(state => state.odwsHistory.page);
      const p = { ...defaultPage, ...page };

      const start = search ? 0 : (p.pageNo - 1) * p.pageSize;
      // 显示载入指示器
      yield put({ type: 'addSpin' });
      const { data } = yield call(loadHistory, start, p.pageSize, query);
      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: {
            page: { ...p, ...{ total:data.total } },
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
      const { record } = yield select(state => state.odwsHistory);
      if (record.id) {

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
              diagnosis: diagnosisData.data.result || [],
              medicalRecord: medicalRecordData.data.result || {},
              orders,
              totalAmt,

            },
          });
        }
        // 移除载入指示器
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
