import dva from 'dva';
import { merge } from 'lodash';
import moment from 'moment';
import { getOptions } from '../../services/UtilsService';
import { loadDeptByTypes } from '../../services/base/DeptService';
import { loadOutputSummaryPage, loadOutputSummarySum } from '../../services/material/OutputInfoService';
import baseUtil from '../../utils/baseUtil';

export default {
  namespace: 'matOutputSummary',
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
    data: [], // 出库明细
    materialType: [], // 物资分类
    typeData: [], // 出库类型
    deptData: [], // 出科科室
    query: {},
    buyTotalSum: '',
    saleTotalSum: '',
    buyPageSum: '',
    salePageSum: '',
    spin: false,
  },
  effects: {
    // 1、加载页面初始信息（查询条件）
    *load({ payload }, { call, put }) {
        // 获取物资分类
      const colNames1 = ['MATERIAL_TYPE'];
      const dataDrug = yield call(getOptions, colNames1);
      let materialType = [];
      if (dataDrug) {
        materialType = { materialType: dataDrug.MATERIAL_TYPE };
      }
      // 获取出库类型
      const colNames2 = ['OUT_TYPE'];
      let data = yield call(getOptions, colNames2);
      let typeData = [];
      if (data) {
        typeData = { typeData: data.OUT_TYPE };
      }
      // 获取出库科室【科室类型  004.药房 005.药库】
      const types = ['001', '002', '003', '004', '005', '010'];
      let deptData = [];
      data = yield call(loadDeptByTypes, types);
      if (data && data.data) {
        for (const item of data.data.result) {
          deptData.unshift(item);
        }
      }

      const newState = { ...typeData, deptData, ...materialType };
      yield put({ type: 'setState', payload: newState });
    },

    // 2、加载出库信息
    *loadOutputDetail({ payload }, { select, call, put }) {
      yield put({ type: 'setState', payload: { spin: true } });

      const { pageNew, queryCon } = payload || {};

      const matOutputSummary = yield select(state => state.matOutputSummary);
      const { defaultPage, query } = matOutputSummary;
      const newPage = { ...defaultPage, ...pageNew };
      const { pageNo, pageSize } = newPage;
      const start = (pageNo - 1) * pageSize;
      const queryTem = { ...query, ...queryCon };
      
      const { data } = yield call(loadOutputSummaryPage, start, pageSize, queryTem);
      
      let buyPageSum = 0;
      let salePageSum = 0;
      if (data && data.result) {
        for (const item of data.result) {
          buyPageSum += item[1];
          salePageSum += item[2];
        }
      }
      yield put({ type: 'setState', payload: { buyPageSum, salePageSum } });
      const { data: totalSum } = yield call(loadOutputSummarySum, queryTem);
      if (totalSum && totalSum.result && totalSum.result[0]) {
        yield put({ type: 'setState', payload: { buyTotalSum: totalSum.result[0][0] } });
        yield put({ type: 'setState', payload: { saleTotalSum: totalSum.result[0][1] } });
      } else {
        yield put({ type: 'setState', payload: { buyTotalSum: 0 } });
        yield put({ type: 'setState', payload: { saleTotalSum: 0 } });
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
