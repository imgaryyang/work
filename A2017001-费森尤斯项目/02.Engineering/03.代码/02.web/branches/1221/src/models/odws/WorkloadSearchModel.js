import dva from 'dva';
import { merge } from 'lodash';
import moment from 'moment';
import { loadDeptByIsRegDept } from '../../services/base/DeptService';
import { loadWorkloadList } from '../../services/odws/OdwsService';


export default {
  namespace: 'workloadSearch',
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
    data: [],
    deptData: [], // 科室信息
    query: {},
    spin: false,
  },
  effects: {
    // 1、加载页面初始信息（查询条件）
    *load({ payload }, { call, put }) {
      // 获取科室名称【是否是挂号科室 1 是 0 不是】
      const types = { isRegdept: '1' };
      const deptData = [];
      const data = yield call(loadDeptByIsRegDept, types);
      if (data && data.data) {
        for (const item of data.data.result) {
          deptData.unshift(item);
        }
      }

      const newState = { deptData };
      yield put({ type: 'setState', payload: newState });
    },

    // 2、加载出库信息
    *loadWordloadListDetail({ payload }, { select, call, put }) {
      yield put({ type: 'setState', payload: { spin: true } });

      const { pageNew, queryCon } = payload || {};

      const workloadSearch = yield select(state => state.workloadSearch);
      const { defaultPage, query } = workloadSearch;
      const newPage = { ...defaultPage, ...pageNew };
      const { pageNo, pageSize } = newPage;
      const start = (pageNo - 1) * pageSize;
      const queryTem = { ...query, ...queryCon };
      const { data } = yield call(loadWorkloadList, queryTem);
      if (data && data.success) {
        yield put({
          type: 'init',
          query: queryTem,
          data,
          page: newPage,
        });
      }
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
