import { merge } from 'lodash';
import { inStoreDetailPage, inStoreBillPage, loadTotalSum } from '../../services/pharmacy/DirectInService';

export default {
  namespace: 'inStoreDetail', 

  state: {
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
    detailData: [],
    detailSearchObjs: {},
    selectedRowKeys: [],
    recordData: [],
    totalSum:{},
    pageSum: '',
    recordPage: {
      total: 0,
      pageSize: 10,
      pageNo: 1,
    },
    data: [],
    dicts: {},
    record: '',
    isSpin: false,
    visible: false,
    searchObjs: {},
    selectedTag: '',
    formCache: {},
  },

  effects: {
    /*
    加载入库单记录
     */
    *loadRecord({ payload }, { select, call, put }) {
      const { query } = (payload || {});
      let { page } = (payload || {});
      const defaultPage = yield select(state => state.inStoreDetail.recordPage);
      let searchObjs = yield select(state => state.inStoreDetail.searchObjs);
      searchObjs = { ...searchObjs, ...query };
      page = { ...defaultPage, ...page };
      const { pageNo, pageSize } = page;
      const start = (pageNo - 1) * pageSize;
      yield put({ type: 'setState', payload: { isSpin: true } });
      const { data } = yield call(inStoreBillPage, start, pageSize, searchObjs);
      yield put({ type: 'setState', payload: { isSpin: false } });
      if (data) {
        yield put({ type: 'initRecord', data, page });
      }
    },
    /*
    通过单号加载入库明细
     */
    *loadDetail({ payload }, { select, call, put }) {
      const { query, record } = (payload || {});
      let { page } = (payload || {});
      const defaultPage = yield select(state => state.inStoreDetail.page);
      let searchObjs = yield select(state => state.inStoreDetail.searchObjs);
      searchObjs = { ...searchObjs, ...query };
      page = { ...defaultPage, ...page };
      const { pageNo, pageSize } = page;
      const start = (pageNo - 1) * pageSize;
      yield put({ type: 'setState', payload: { isSpin: true, record } });
      const { data } = yield call(inStoreDetailPage, start, pageSize, searchObjs);
      yield put({ type: 'setState', payload: { isSpin: false } });
      if (data) {
        yield put({ type: 'init', data, page });
      }
    },
    /*
    加载入库明细
     */
    *searchDetail({ payload }, { select, call, put }) {
      const { query } = (payload || {});
      let { detailPage } = (payload || {});
      const defaultdetailPage = yield select(state => state.inStoreDetail.detailPage);
      let detailSearchObjs = yield select(state => state.inStoreDetail.detailSearchObjs);
      detailSearchObjs = { ...detailSearchObjs, ...query };
      detailPage = { ...defaultdetailPage, ...detailPage };
      const { pageNo, pageSize } = detailPage;
      const start = (pageNo - 1) * pageSize;
      yield put({ type: 'setState', payload: { isSpin: true, detailSearchObjs } });
      const { data } = yield call(inStoreDetailPage, start, pageSize, detailSearchObjs);
      console.log(data);
      let pageSum = 0;
      if (data && data.result) {
        for (const item of data.result) {
          pageSum += item.buyCost;
        }
      }
      yield put({ type: 'setState', payload: { pageSum } });
      const { data: totalSum } = yield call(loadTotalSum, detailSearchObjs);
      if (totalSum && totalSum.result) {
        yield put({ type: 'setState', payload: { totalSum: totalSum.result } });
      }
      yield put({ type: 'setState', payload: { isSpin: false } });
      if (data) {
        yield put({ type: 'initDetail', data, detailPage });
      }
    },
  },

  reducers: {
    init(state, { data, page }) {
      const { result, total } = data;
      const resPage = { ...state.page, ...page, total };
      const resData = result || [];
      return { ...state, data: resData, page: resPage };
    },

    initRecord(state, { data, page }) {
      const { result, total } = data;
      const resPage = { ...state.recordPage, ...page, total };
      const resData = result || [];
      return { ...state, recordData: resData, recordPage: resPage };
    },

    initDetail(state, { data, detailPage }) {
      const { result, total } = data;
      const resPage = { ...state.recordPage, ...detailPage, total };
      const resData = result || [];
      return { ...state, detailData: resData, detailPage: resPage };
    },

    setState(state, { payload }) {
      return { ...state, ...payload };
    },

    setSearchObjs(state, { payload: searchObj }) {
      if (searchObj) {
        const searchObjs = merge(state.searchObjs, searchObj);
        return { ...state, searchObjs };
      } else {
        return { ...state, searchObjs: {} };
      }
    },

    setDetailSearchObjs(state, { payload: detailSearchObj }) {
      if (detailSearchObj) {
        const detailSearchObjs = merge(state.detailSearchObjs, detailSearchObj);
        return { ...state, detailSearchObjs };
      } else {
        return { ...state, detailSearchObjs: {} };
      }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/pharmacy/inStoreBillDetail') {
          dispatch({
            type: 'load',
          });
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
