import { merge } from 'lodash';
import * as drugInfoService from '../../services/pharmacy/DrugInfoService';
import * as buyBillService from '../../services/pharmacy/BuyBillService';
import * as directInService from '../../services/pharmacy/DirectInService';
import * as buyDetailService from '../../services/pharmacy/BuyDetailService';
import * as storeInfo from '../../services/pharmacy/StoreInfoService';
import * as storeSumInfo from '../../services/pharmacy/StoreSumInfoService';
import { getOptions } from '../../services/UtilsService';
import baseUtil from '../../utils/baseUtil';

export default {
  namespace: 'procureAuitdSearch',

  state: {
    isSpin: false,
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
    buyHis: {
      page: {
        total: 0,
        pageSize: 40,
        pageNo: 1,
      },
      data: [],
    },
  },

  effects: {
// 1、加载采购单列表
    *loadBuyList({ payload }, { select, call, put }) {
      yield put({ type: 'toggleSpin' });
      const { page, query } = (payload || {});
      const defaultPage = yield select(state => state.procureAuitdSearch.defaultPage);
      const queryTem = yield select(state => state.procureAuitdSearch.buyList.query);
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
      const { buyDetail, defaultPage } = yield select(state => state.procureAuitdSearch);
      const queryTem = yield select(state => state.procureAuitdSearch.buyDetail.query);
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
