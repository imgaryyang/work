import { merge } from 'lodash';
import * as matInfoService from '../../services/material/MaterialInfoService';
import * as buyBillService from '../../services/material/BuyBillService';
import * as directInService from '../../services/material/DirectInService';
import * as buyDetailService from '../../services/material/BuyDetailService';
import * as storeInfo from '../../services/material/StoreInfoService';
import * as storeSumInfo from '../../services/material/StoreSumInfoService';
import { getOptions } from '../../services/UtilsService';
import baseUtil from '../../utils/baseUtil';

export default { 
  namespace: 'matProcureAuitdSearch',

  state: { 
    isSpin: false,
    buyState: [],
    selectedRowKeys: [],
    defaultPage: {
      total: 0,
      pageSize: 10,
      pageNo: 1,
    },
    buyList: {
      page: {
        total: 0,
        pageSize: 10,
        pageNo: 1,
      },
      data: [],
    },
    buyDetail: {
      page: {
        total: 0,
        pageSize: 40,
        pageNo: 1,
      },
      data: [],
      isSpin: false,
    },
  },

  effects: {
    // 0、加载页面初始信息（查询条件）
    *load({ payload }, { call, put }) {
        // 获取采购计划状态
      const colName = ['BUY_STATE'];
      const data = yield call(getOptions, colName);
      let buyState = [];
      if (data) {
        buyState = { buyState: data.BUY_STATE };
      }
      const newState = { ...buyState };
      yield put({ type: 'setState', payload: newState });
    },
// 1、加载采购单列表
    *loadBuyList({ payload }, { select, call, put }) {
      yield put({ type: 'toggleSpin' });
      const { page, query } = (payload || {});
      const defaultPage = yield select(state => state.matProcureAuitdSearch.defaultPage);
      const queryTem = yield select(state => state.matProcureAuitdSearch.buyList.query);
      const qt = { ...queryTem, ...query };
      let newPage = { ...defaultPage, ...page };
      const { pageNo, pageSize } = newPage;
      const start = (pageNo - 1) * pageSize;
      // 获取采购单列表信息，翻页
      const { data } = yield call(buyBillService.loadBuyBillPage, start, pageSize, qt);
      newPage = { ...newPage, ...{ total: data.total } };
      if (data) {
        yield put({ type: 'setState', payload: { buyList: { data: data.result, page: newPage, query: qt } } });
      }
      yield put({ type: 'toggleSpin' });
    },
    // 2、查询采购单明细
    *loadBuyDetail({ payload }, { select, call, put }) {
      yield put({ type: 'toggleSpin' });
      const { page, query, record } = (payload || {});
      const { buyDetail, defaultPage } = yield select(state => state.matProcureAuitdSearch);
      const queryTem = yield select(state => state.matProcureAuitdSearch.buyDetail.query);
      const qt = { ...queryTem, ...query };
      const detailPage = buyDetail.page;
      const newPage = { ...defaultPage, ...detailPage, ...page };
      const { pageNo, pageSize } = newPage;
      const start = (pageNo - 1) * pageSize;

      const { data } = yield call(buyDetailService.loadBuyDetail, start, pageSize, qt);
      const newDetail = { ...buyDetail, data: data.result, query: qt, page: newPage };
      yield put({ type: 'setState', payload: { buyDetail: newDetail } });
      yield put({ type: 'toggleSpin' });
    },
  },

  reducers: {
    updateBuyList(state, { data, page }) {
      const { buyList } = state;
      const { total } = page;
      const newPage = { ...buyList.page, total };
      const newBuyList = { ...buyList, data, page: newPage };
      return {
        ...state,
        buyList: newBuyList,
      };
    },
    delete(state, { id }) {
      const { buy } = state;
      const index = buy.data.findIndex(value => value.id === id);
      buy.data.splice(index, 1);
      return { ...state, buy };
    },
    setState(state, { payload }) {
      return { ...state, ...payload };
    },
    toggleSpin(state) {
      const { isSpin } = state;
      return { ...state, isSpin: !isSpin };
    },
  },
};
