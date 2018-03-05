import { notification } from 'antd';
import { isEmpty, omit } from 'lodash';
import * as planService from '../../services/material/InstockPlanService';
import { loadStoreInfoPage } from '../../services/material/StoreInfoService';

export default {
  namespace: 'instockPlanEdit',
  state: {
    data: [], // 库存
    planData: [], // 请领
    isSpin: false,
    defaultPage: {
      total: 0,
      pageSize: 10,
      pageNo: 1,
    },
    planPage: {
      total: 0,
      pageSize: 10,
      pageNo: 1,
    },
    fromDeptId: null,
    planListData: [],
    currentAppBill: '',

    bizPrintAlertParams: {
      visible: false,
      tmplateCode: '',
      bizCode: '',
      bizCodeLabel: '',
      bizTip: '',
    },
    searchObj: {},
  },
  effects: {
    // 下拉选择询
    *loadPlanListData({ payload = {} }, { call, put }) {
      const { query } = payload;

      const { data } = yield call(planService.loadPlanMainList, query);

      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: { planListData: data.result },
        });
      }
    },
    // 下拉选择药房数据以及库存searchBar查询
    *load({ payload = {} }, { select, call, put }) {
      const { query, page } = payload;
      const defaultPage = yield select(state => state.instockPlanEdit.defaultPage);
      const newPage = { ...defaultPage, ...page };
      const searchObj = yield select(state => state.instockPlanEdit.searchObj);
      const newQuery = { ...searchObj, ...query };
      const { pageNo, pageSize } = newPage;
      const start = (pageNo - 1) * pageSize;

      yield put({ type: 'toggleSpin' });
      const { data } = yield call(loadStoreInfoPage, start, pageSize, newQuery);
      yield put({ type: 'toggleSpin' });

      if (!isEmpty(newQuery)) {
        yield put({ type: 'setState', payload: { searchObj: newQuery } });
      }

      if (data && data.success) {
        yield put({ type: 'init', data, newPage });
      }

      yield put({ type: 'setState', payload: { fromDeptId: query.deptId } });
    },

    // 查询请领单明细
    *loadPlan({ payload = {} }, { call, put }) {
      const { query } = payload;


      yield put({ type: 'toggleSpin' });
      const { data } = yield call(planService.loadPlan, query);
      yield put({ type: 'toggleSpin' });

      const planData = [];
      if (data && data.success) {
        if (data.result && data.result.length > 0) {
          const { result } = data;

          result.forEach((record) => {
            const { matInfo: { companyInfo: { companyName: producerName } } } = record;
            const planRecord = Object.assign(record, { producerName });
            planData.push(planRecord);
          });
        }
      }

      yield put({ type: 'setState', payload: { planData } });
    },

    // 添加请领明细
    *forAddPlan({ record = {} }, { select, put }) {
      // 获取物资信息
      const { planData, fromDeptId, currentAppBill } = yield select(state => state.instockPlanEdit);
      const { user: { name: userName, loginDepartment: { id: deptId } } } = yield select(state => state.base);


      const customColumn = {
        appBill: currentAppBill,
        appNum: 0,
        appState: '1',
        appOper: userName,
        appUnit: record.materialInfo.materialUnit,
        company: record.companySupply
          ? record.companySupply.id
          : '', // 供货商
        deptId,
        fromDeptId,
        matId: record.materialInfo.id,
        matInfo: record.materialInfo,
        materialSpec: record.materialSpecs,
        producer: !isEmpty(planData)
          ?
            record.materialInfo.companyInfo
              ? record.materialInfo.companyInfo.id
              : ''
          : record.producer,
        producerName: record.companyInfo
          ? record.companyInfo.companyName
          : '', // 生产厂商
        isNewRecord: true,
        plusMinus: 1,
        comm: '提交请领药品',
      };

      const newRecord = Object.assign(omit(record, ['createOper', 'createOperId']), customColumn);

      planData.push(newRecord);

      yield put({ type: 'setState', payload: { planData } });
    },

    // 保存请领单
    *savePlan({ appState }, { select, call, put }) {
      yield put({ type: 'toggleSpin' });
      const { planData, currentAppBill } = yield select(state => state.instockPlanEdit);
      const { data } = yield call(planService.savePlan, planData);
      if (data && data.success) {
        yield put({ type: 'setState', payload: { planData } });
        yield put({ type: 'loadPlan', payload: { query: { appBill: currentAppBill } } });
        // 弹出业务单据打印提示
        yield put({
          type: 'setState',
          payload: {
            bizPrintAlertParams: {
              visible: true,
              tmplateCode: '016', // 模版编号
              bizCode: currentAppBill, // 业务单据编号
              bizCodeLabel: '请领单号', // 业务单据编号名称
              bizTip: '请领计划修改提交成功', // 业务操作成功提示
            },
          },
        });
        notification.success({ message: '提示', description: '提交成功！' });
      } else {
        notification.error({ message: '提示', description: '保存失败！' });
      }
      yield put({ type: 'toggleSpin' });
    },

    // 删除请领物资
    *deletePlan({ record, index }, { call, put }) {
      if (record.id && !record.isNewRecord) {
        yield put({ type: 'toggleSpin' });
        const { data } = yield call(planService.deletePlan, record.id);
        if (data && data.success) {
          yield put({ type: 'deleteRow', index });
        } else {
          notification.error({ message: '错误', description: `${data.msg}!` });
        }
        yield put({ type: 'toggleSpin' });
      } else {
        yield put({ type: 'deleteRow', index });
      }
    },
  },
  reducers: {
    init(state, { data, newPage }) {
      const { result, total } = data;
      const resPage = { ...state.page, ...newPage, total };
      const resData = result || [];
      return { ...state, data: resData, page: resPage };
    },

    initPlan(state, { data }) {
      return { ...state, planData: data.result };
    },

    setState(state, { payload }) {
      return { ...state, ...payload };
    },

    toggleSpin(state) {
      return { ...state, isSpin: !state.isSpin };
    },

    deleteRow(state, { index }) {
      const { planData } = state;
      planData.splice(index, 1);
      return { ...state, planData };
    },
  },
};
