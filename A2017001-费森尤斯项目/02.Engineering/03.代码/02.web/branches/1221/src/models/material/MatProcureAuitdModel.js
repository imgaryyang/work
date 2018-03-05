import { merge } from 'lodash';
import { notification } from 'antd';
import * as buyBillService from '../../services/material/BuyBillService';
import * as directInService from '../../services/material/DirectInService';
import * as buyDetailService from '../../services/material/BuyDetailService';
import baseUtil from '../../utils/baseUtil';

export default {
  namespace: 'matProcureAuitd',

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
      const defaultPage = yield select(state => state.matProcureAuitd.defaultPage);
      const queryTem = yield select(state => state.matProcureAuitd.buyList.query);
      const qt = { ...queryTem, ...query };
      let newPage = {
        ...defaultPage,
        ...page,
      };
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
      const { buyDetail, defaultPage } = yield select(state => state.matProcureAuitd);
      const queryTem = yield select(state => state.matProcureAuitd.buyDetail.query);
      const qt = { ...queryTem, ...query };
      const detailPage = buyDetail.page;
      const newPage = { ...defaultPage, ...detailPage, ...page };
      const { pageNo, pageSize } = newPage;
      const start = (pageNo - 1) * pageSize;

      const { data } = yield call(buyDetailService.loadBuyDetailList, qt);
      const newDetail = { ...buyDetail, data: data.result, query: qt, page: newPage };
      yield put({ type: 'setState', payload: { buyDetail: newDetail } });
      yield put({ type: 'toggleSpin' });
    },
      // 3.查询某物资的历史采购单
    *loadBuyHis({ record, payload }, { select, call, put }) {
      yield put({ type: 'toggleSpin' });
      const { buyHis, defaultPage } = yield select(state => state.matProcureAuitd);
      const queryTem = yield select(state => state.matProcureAuitd.buyHis.query);
      const { page, query } = payload || {};
      const qt = { ...queryTem, ...query, inType: 'I1', materialCode: record.materialCode };
      const hisPage = buyHis.page;
      const newPage = { ...defaultPage, ...hisPage, ...page };
      const { pageNo, pageSize } = newPage;
      const start = (pageNo - 1) * pageSize;

      const { data } = yield call(directInService.loadBuyHistory, start, pageSize, qt);

      const newBuyHis = { ...buyHis, data: data.result, query: qt, page: newPage };
      yield put({ type: 'setState', payload: { buyHis: newBuyHis } });
      yield put({ type: 'toggleSpin' });
    },
    // 4、审批同意
    *saveBuy({ payload }, { select, call, put }) {
      yield put({ type: 'toggleSpin' });
      const { buyState, id } = payload || {};
      const buyDetail = yield select(state => state.matProcureAuitd.buyDetail.data);
      const buyList = yield select(state => state.matProcureAuitd.buyList.data);
      let buyCost = 0;
      for (const item of buyDetail) {
        buyCost += item.auitdNum * item.buyPrice;
        const newDetail = {
          id: item.id,
          auitdNum: item.auitdNum,
        };
        const { data: detailRet } = yield call(buyDetailService.UpdInstock, newDetail);
        if (detailRet && detailRet.success) {
          notification.success({
            message: '提示',
            description: '审核通过！',
        });
        } else {
          baseUtil.alert('后台采购计划明细更新失败，请刷新重试');
          yield put({ type: 'toggleSpin' });
          return;
        }
      }
      const newBuy = { id, buyState, buyCost };
      const { data: ret } = yield call(buyBillService.UpdInstock, newBuy);
      if (ret && ret.success) {
        yield put({ type: 'loadBuyList', payload: { query: { buyState: '1' } } });
        yield put({ type: 'setState', payload: { buyDetail: { data: [] } } });
      } else {
        baseUtil.alert('后台采购计划更新失败，请刷新重试');
        yield put({ type: 'toggleSpin' });
        return;
      }
      yield put({ type: 'toggleSpin' });
    },

    // 5、审批退回
    *backBuy({ payload }, { select, call, put }) {
      yield put({ type: 'toggleSpin' });
      const { buyState, id } = payload || {};
      const buyDetail = yield select(state => state.matProcureAuitd.buyDetail.data);
      const newDetail = {
        id,
        buyState,
      };
      const { data: detailRet } = yield call(buyBillService.UpdBackInstock, newDetail);
      if (detailRet && detailRet.success) {
        yield put({ type: 'loadBuyList', payload: { query: { buyState: '1' } } });
        yield put({ type: 'setState', payload: { buyDetail: { data: [] } } });
      } else {
        baseUtil.alert('后台采购计划更新失败，请刷新重试');
        yield put({ type: 'toggleSpin' });
        return;
      }
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
