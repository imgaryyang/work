import dva from 'dva';
import { merge } from 'lodash';
import moment from 'moment';
import { getOptions } from '../../services/UtilsService';
import { loadDeptByTypes } from '../../services/base/DeptService';
import { loadOutputDetailPage } from '../../services/hrp/OutputInfoService';
import baseUtil from '../../utils/baseUtil';

export default {
  namespace: 'hrpOutputDetailInfo',
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
    instrmType: [], // 物资分类
    typeData: [], // 出库类型
    deptData: [], // 出科科室
    query: {},
    totalSum: {},
    pageSum: '',
    spin: false,
  },
  effects: {
    // 1、加载页面初始信息（查询条件）
    *load({ payload }, { call, put }) {
        // 获取固资分类
      // const colNames1 = ['INSTRM_TYPE'];
      // const dataDrug = yield call(getOptions, colNames1);
      // let instrmType = [];
      // if (dataDrug) {
      //   instrmType = { instrmType: dataDrug.INSTRM_TYPE };
      // }
      // 获取出库类型
      const colNames2 = ['OUT_TYPE'];
      let data = yield call(getOptions, colNames2);
      let typeData = [];
      if (data) {
        typeData = { typeData: data.OUT_TYPE };
      }
      // 获取目的科室
      const types = ['001', '002', '003', '004', '005', '006', '007', '008', '009', '010', '011'];
      const deptData = [];
      data = yield call(loadDeptByTypes, types);
      if (data && data.data) {
        for (const item of data.data.result) {
          deptData.unshift(item);
        }
      }

      const newState = { ...typeData, deptData };
      yield put({ type: 'setState', payload: newState });
    },

    // 2、加载出库信息
    *loadOutputDetail({ payload }, { select, call, put }) {
      yield put({ type: 'setState', payload: { spin: true } });
      const { pageNew, queryCon } = payload || {};
      const hrpOutputDetailInfo = yield select(state => state.hrpOutputDetailInfo);
      const { defaultPage, query } = hrpOutputDetailInfo;
      const newPage = { ...defaultPage, ...pageNew };
      const { pageNo, pageSize } = newPage;
      const start = (pageNo - 1) * pageSize;
      const queryTem = { ...query, ...queryCon };
      const { data } = yield call(loadOutputDetailPage, start, pageSize, queryTem);
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
