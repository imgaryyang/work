import moment from 'moment';
import * as storeInfo from '../../services/material/StoreInfoService';
import { loadAppInInfoPage, loadAppInDetailPage, updateAppInDetail, loadApplyInDetailInfo, matOutCheck, matOutCheckBack } from '../../services/material/InstockService';
import { saveOutput, receiveOutBill } from '../../services/material/OutputInfoService';
import baseUtil from '../../utils/baseUtil';


export default {
  namespace: 'matOutStockCheck',
  state: {
    defaultPage: {
      total: 0,
      pageSize: 10,
      pageNo: 1,
    },
    page: {
      total: 0,
      pageSize: 10,
      pageNo: 1,
    },
    pageRight: {
      total: 0,
      pageSize: 10,
      pageNo: 1,
    },
    data: [], // 出库申请
    dataOutStock: [], // 申请明细
    query: { appState: 1, appTime: moment() },
    queryRight: {},
    record: {},
    sum: 0,
    searchSwitch: true,
    spin: false,
  },

  effects: {
// 1、加载请领信息
    *loadAppIn({ payload }, { select, call, put }) {
      const { pageNew, queryCon } = payload || {};

      const matOutStockCheck = yield select(state => state.matOutStockCheck);
      const { defaultPage, query } = matOutStockCheck;
      const newPage = { ...defaultPage, ...pageNew };
      const { pageNo, pageSize } = newPage;
      const start = (pageNo - 1) * pageSize;
      const queryTem = { ...query, ...queryCon };
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(loadAppInInfoPage, start, pageSize, queryTem); // 请领出库查询
      yield put({ type: 'setState', payload: { spin: false } });

      if (data) {
        yield put({
          type: 'init',
          query: queryTem,
          data,
          page: newPage,
        });
      }
    },
   // 2、添加出库明细
    *addOutStockDetail({ record, payload }, { select, call, put }) {
      yield put({ type: 'setState', payload: { spin: true } });
      const recordTem = yield select(state => state.matOutStockCheck.record);
      const rd = { ...recordTem, ...record };
      yield put({ type: 'setState', payload: { record: rd } });
      const appBill = rd[0];

      const { pageRightNew, queryRightCon, tradeName } = payload || {};
      const matOutStockCheck = yield select(state => state.matOutStockCheck);
      const { defaultPage, queryRight } = matOutStockCheck;
      const newPage = { ...defaultPage, ...pageRightNew };
      const { pageNo, pageSize } = newPage;
      const start = (pageNo - 1) * pageSize;
      const queryTem = { ...queryRight, ...queryRightCon, appBill, tradeName };

      const { data } = yield call(loadAppInDetailPage, start, pageSize, queryTem);
      const { user } = yield select(state => state.base);
      const fromdeptId = user.loginDepartment.id;
      let sum = 0;
      if (data && data.result) {
        if (data.result.length > 0) {
          for (const item of data.result) {
            const conditions = {
              drugCode: item.drugCode,
              deptId: fromdeptId,
              batchNo: item.batchNo,
              approvalNo: item.approvalNo,
              hosId: item.hosId,
            };

            const { data: store } = yield call(storeInfo.listStoreInfo, conditions);
            const { result } = store;
            sum += item.buyCost;
            if (result.length > 0) {
              if (result[0].storeSum > 0) {
                item.storeSum = result[0].storeSum;
              } else {
                item.storeSum = 0;
              }
            } else {
              item.storeSum = 0;
            }
          }
        }
      }
      yield put({ type: 'setState', payload: { dataOutStock: data.result, queryRight: queryTem, pageRight: newPage, sum, searchSwitch: false } });
      yield put({ type: 'setState', payload: { spin: false } });
    },
// 3.保存出库信息，调用出库接口
    *saveOutStockInfo({ value }, { select, call, put }) {
      yield put({ type: 'setState', payload: { spin: true } });

      const { dataOutStock, record, data: appData, page } = yield select(state => state.matOutStockCheck);
      if (!(dataOutStock instanceof Array) || dataOutStock.length <= 0) {
        baseUtil.alert('无请领出库物资,请点击申请！');
        yield put({ type: 'setState', payload: { spin: false } });
        return;
      }
      const appBill = record[0];
      const queryTem = { appBill, comm: value.comm };
      const { data: back } = yield call(matOutCheck, queryTem);
      if (!back.success) {
        baseUtil.alert('请领出库失败!' + back.msg);
        yield put({ type: 'setState', payload: { spin: false } });
        return;
      } else {
        dataOutStock.splice(0, dataOutStock.length);
        yield put({ type: 'setState', payload: { dataOutStock } });
      }

      const { query } = yield select(state => state.matOutStockCheck);
      yield put({ type: 'loadAppIn', payload: { query } });
      yield put({ type: 'setState', payload: { record: {}, sum: 0, searchSwitch: true } });
      yield put({ type: 'setState', payload: { spin: false } });
    },

    // 4.出库审批驳回
    *backOutStockInfo({ value }, { select, call, put }) {
      yield put({ type: 'setState', payload: { spin: true } });

      const { dataOutStock, record, data: appData, page } = yield select(state => state.matOutStockCheck);
      if (!(dataOutStock instanceof Array) || dataOutStock.length <= 0) {
        baseUtil.alert('无请领出库物资,请点击申请！');
        yield put({ type: 'setState', payload: { spin: false } });
        return;
      }
      const appBill = record[0];
      const queryTem = { appBill, comm: value.comm };
      const { data: back } = yield call(matOutCheckBack, queryTem);
      if (!back.success) {
        baseUtil.alert('请领出库驳回失败！请重试');
        yield put({ type: 'setState', payload: { spin: false } });
        return;
      } else {
        dataOutStock.splice(0, dataOutStock.length);
        yield put({ type: 'setState', payload: { dataOutStock } });
      }

      const { query } = yield select(state => state.matOutStockCheck);
      yield put({ type: 'loadAppIn', payload: { query } });
      yield put({ type: 'setState', payload: { record: {}, sum: 0, searchSwitch: true } });
      yield put({ type: 'setState', payload: { spin: false } });
    },
  },


  reducers: {
    init(state, { data, page, query }) {
      const { result, total } = data;
      const resPage = { ...state.page, ...page, total };
      const datatem = result || [];
      return { ...state, data: datatem, page: resPage, query };
    },
    setState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
