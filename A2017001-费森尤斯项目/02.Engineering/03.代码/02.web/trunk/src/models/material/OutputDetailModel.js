import dva from 'dva';
import { merge } from 'lodash';
import moment from 'moment';
import { getOptions } from '../../services/UtilsService';
import { loadDeptByTypes } from '../../services/base/DeptService';
import { loadOutputDetailPage, outputExpertToExcel, loadTotalSum, loadRecord } from '../../services/material/OutputDetailService';

export default {
  namespace: 'outputdetail',
  state: {
    recordPage: {
      total: 0,
      pageSize: 10,
      pageNo: 1,
    },
    page: {
      total: 0,
      pageSize: 10,
      pageNo: 1,
    },
    detailPage: {
      total: 0,
      pageSize: 10,
      pageNo: 1,
    },
    detailSearchObjs: {},
    detailQuery: {},
    data: [], // 出库明细
    drugType: [], // 药品分类
    typeData: [], // 出库类型
    deptData: [], // 出科科室
    recordData: [],
    detailData: [],
    query: {},
    searchObjs: {},
    totalSum: {},
    pageSum: '',
    spin: false,
  },
  effects: {
    // 1、加载页面初始信息（查询条件）
    *load({ payload }, { call, put }) {
        // 获取药品分类
      const colNames1 = ['DRUG_TYPE'];
      const dataDrug = yield call(getOptions, colNames1);
      let drugType = [];
      if (dataDrug) {
        drugType = { drugType: dataDrug.DRUG_TYPE };
      }
      // 获取出库类型
      const colNames2 = ['OUT_TYPE'];
      let data = yield call(getOptions, colNames2);
      let typeData = [];
      if (data) {
        typeData = { typeData: data.OUT_TYPE };
      }
      // 获取出库科室【科室类型  004.药房 005.药库】
      const types = ['001', '002', '003', '004', '005'];
      let deptData = [];
      data = yield call(loadDeptByTypes, types);
      if (data && data.data) {
        for (const item of data.data.result) {
          deptData.unshift(item);
        }
      }

      const newState = { ...typeData, deptData, ...drugType };
      yield put({ type: 'setState', payload: newState });
    },

    /*
    加载出库单
     */
    *loadRecord({ payload }, { select, call, put }) {
      const { query } = (payload || {});
      let { page } = (payload || {});
      const defaultPage = yield select(state => state.outputdetail.recordPage);
      let searchObjs = yield select(state => state.outputdetail.searchObjs);
      searchObjs = { ...searchObjs, ...query };
      page = { ...defaultPage, ...page };
      const { pageNo, pageSize } = page;
      const start = (pageNo - 1) * pageSize;
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(loadRecord, start, pageSize, searchObjs);
      yield put({ type: 'setState', payload: { spin: false } });
      if (data) {
        yield put({ type: 'initRecord', data, page });
      }
    },
    // 2、加载出库信息
    *loadOutputDetail({ payload }, { select, call, put }) {
      const { query, record, page } = payload || {};
      yield put({ type: 'setState', payload: { spin: true, record } });
      const outputDetailInfo = yield select(state => state.outputdetail);
      const oldPage = yield select(state => state.outputdetail.page);
      const { searchObjs } = outputDetailInfo;
      const newPage = { ...oldPage, ...page };
      const { pageNo, pageSize } = newPage;
      const start = (pageNo - 1) * pageSize;
      const queryTem = { ...searchObjs, ...query };
      const { data } = yield call(loadOutputDetailPage, start, pageSize, queryTem);
      let pageSum = 0;
      if (data && data.result) {
        for (const item of data.result) {
          pageSum += item.saleCost;
        }
      }
      yield put({ type: 'setState', payload: { pageSum } });
      const { data: totalSum } = yield call(loadTotalSum, queryTem);
      if (totalSum && totalSum.result) {
        yield put({ type: 'setState', payload: { totalSum: totalSum.result } });
      }
      if (data) {
        yield put({
          type: 'init',
          query: queryTem,
          data,
          page: newPage,
        });
      }
      yield put({ type: 'setState', payload: { spin: false } });
    },
     // 出库明细查询
    *loadOutStockDetail({ payload }, { select, call, put }) {
      const { detailQuery, pageNew } = payload || {};
      yield put({ type: 'setState', payload: { spin: true } });
      const defQuery = yield select(state => state.outputdetail.detailQuery);
      const oldPage = yield select(state => state.outputdetail.page);
      const newPage = { ...oldPage, ...pageNew };
      const { pageNo, pageSize } = newPage;
      const start = (pageNo - 1) * pageSize;
      const queryTem = { ...defQuery, ...detailQuery };
      const { data } = yield call(loadOutputDetailPage, start, pageSize, queryTem);
      let pageSum = 0;
      if (data && data.result) {
        for (const item of data.result) {
          pageSum += item.saleCost;
        }
      }
      yield put({ type: 'setState', payload: { pageSum } });
      const { data: totalSum } = yield call(loadTotalSum, queryTem);
      if (totalSum && totalSum.result) {
        yield put({ type: 'setState', payload: { totalSum: totalSum.result } });
      }
      if (data) {
        yield put({
          type: 'initDetail',
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
    initRecord(state, { data, page, query }) {
      const { result, total } = data;
      const resPage = { ...state.recordPage, ...page, total };
      const datatem = result || [];
      return { ...state, recordData: datatem, recordPage: resPage, query };
    },
    initDetail(state, { data, page, query }) {
      const { result, total } = data;
      const resPage = { ...state.recordPage, ...page, total };
      const datatem = result || [];
      return { ...state, detailData: datatem, detailPage: resPage, detailQuery: query };
    },
    setState(state, { payload }) {
      return { ...state, ...payload };
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/material/outputDetail') {
          dispatch({
            type: 'utils/initDicts',
            payload: [
              'DRUG_TYPE', 'IN_TYPE', 'COMPANY_TYPE',
            ],
          });
        }
      });
    },
  },
};
