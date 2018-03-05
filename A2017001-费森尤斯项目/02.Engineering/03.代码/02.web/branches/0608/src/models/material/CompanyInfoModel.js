import { isEmpty } from 'lodash';
import * as companyInfoService from '../../services/material/CompanyInfoService';

export default {
  namespace: 'materialCompanyInfo',
  state: {
    namespace: 'materialCompanyInfo',
    defaultPage: {
      total: 0,
      pageSize: 10,
      pageNo: 1,
    },
    selectedRowKeys: [],
    data: [],
    result: {},
    isSpin: false,
    searchObj: {},
    visible: false,
    formCache: {},
  },

  effects: {
    *load({ payload }, { select, call, put }) {
      const { query } = (payload || {});
      let { page } = (payload || {});
      const defaultPage = yield select(state => state.materialCompanyInfo.defaultPage);
      page = { ...defaultPage, ...page };
      let searchObj = yield select(state => state.materialCompanyInfo.searchObj);
      searchObj = { ...searchObj, ...query };
      const { pageNo, pageSize } = page;
      const start = (pageNo - 1) * pageSize;

      yield put({ type: 'toggleSpin' });
      const { data } = yield call(companyInfoService.loadCompanyInfoPage, start, pageSize, searchObj);
      yield put({ type: 'toggleSpin' });

      if (!isEmpty(query)) {
        yield put({ type: 'setState', payload: { searchObj } });
      }

      if (data) {
        yield put({ type: 'init', data, page });
      }
    },
    *save({ params }, { select, call, put }) {
      yield put({ type: 'toggleSpin' });
      const record = yield select(state => state.utils.record);
      const searchObj = yield select(state => state.materialCompanyInfo.searchObj);
      const { data } = yield call(companyInfoService.saveCompanyInfo, params);
      /* isEmpty(record) ? create : update */
      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: {
            visible: isEmpty(record),
            result: data,
          },
        });
        yield put({ type: 'load', payload: { query: searchObj } });
      }
      yield put({ type: 'toggleSpin' });
    },
    *delete({ id }, { select, call, put }) {
      const searchObj = yield select(state => state.materialCompanyInfo.searchObj);
      yield put({ type: 'toggleSpin' });
      const { data } = yield call(companyInfoService.deleteCompanyInfo, id);
      if (data && data.success) {
        yield put({ type: 'load', payload: { query: searchObj } });
      }
      yield put({ type: 'toggleSpin' });
    },
    *deleteSelected({ payload }, { select, call, put }) {
      const selectedRowKeys = yield select(state => state.materialCompanyInfo.selectedRowKeys);
      const searchObj = yield select(state => state.materialCompanyInfo.searchObj);
      yield put({ type: 'toggleSpin' });
      const { data } = yield call(companyInfoService.deleteAllCompanyInfos, selectedRowKeys);
      if (data && data.success) {
        yield put({ type: 'load', payload: { query: searchObj } });
      }
      yield put({ type: 'toggleSpin' });
    },
  },

  reducers: {
    init(state, { data, page }) {
      const { result, total } = data;
      const resPage = { ...state.page, ...page, total };
      const resData = result || [];
      return { ...state, data: resData, page: resPage };
    },

    setState(state, { payload }) {
      return { ...state, ...payload };
    },

    toggleSpin(state) {
      return { ...state, isSpin: !state.isSpin };
    },

    toggleVisible(state) {
      return { ...state, visible: !state.visible };
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/material/settings/manufacturer') {
          dispatch({
            type: 'load',
          });
          dispatch({
            type: 'utils/initDicts',
            payload: ['COMPANY_TYPE', 'HOS_INFO'],
          });
        }
      });
    },
  },
};
