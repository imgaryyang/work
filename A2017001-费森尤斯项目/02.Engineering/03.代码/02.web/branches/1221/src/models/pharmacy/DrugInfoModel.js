import { isEmpty, merge } from 'lodash';
// import key from 'keymaster';
import * as drugInfoService from '../../services/pharmacy/DrugInfoService';

export default {
  namespace: 'drugInfo',

  state: {
    namespace: 'drugInfo',
    page: {
      total: 0,
      pageSize: 10,
      pageNo: 1,
    },
    selectedRowKeys: [],
    data: [],
    result: {},
    isSpin: false,
    visible: false,
    searchObjs: {},
    selectedTag: '',
    formCache: {},
    // 来源标志
    chanel: '',
  },

  effects: {
    *load({ payload }, { select, call, put }) {
      const chanel = yield select(state => state.drugInfo.chanel);

      const { query } = (payload || {});
      let { page } = (payload || {});
      const defaultPage = yield select(state => state.drugInfo.page);
      let searchObjs = yield select(state => state.drugInfo.searchObjs);
      page = { ...defaultPage, ...page };
      searchObjs = { ...searchObjs, ...query };
      const { pageNo, pageSize } = page;
      const start = (pageNo - 1) * pageSize;

      yield put({ type: 'toggleSpin' });
      const { data } = yield call(drugInfoService.loadDrugInfoPage, start, pageSize, searchObjs, chanel);
      yield put({ type: 'toggleSpin' });

      if (data) {
        yield put({ type: 'init', data, page });
      }
    },
    *save({ params }, { select, call, put }) {
      const chanel = yield select(state => state.drugInfo.chanel);
      yield put({ type: 'toggleSpin' });
      const searchObjs = yield select(state => state.drugInfo.searchObjs);
      const record = yield select(state => state.utils.record);
      const { data } = yield call(drugInfoService.saveDrugInfo, params, chanel);
      /* isEmpty(record) ? create : update */
      if (data && data.success) {
        yield put({ type: 'setState', payload: { visible: isEmpty(record), result: data } });
        yield put({ type: 'load', payload: { query: searchObjs } });
      }
      yield put({ type: 'toggleSpin' });
    },
    *delete({ id }, { select, call, put }) {
      const searchObjs = yield select(state => state.drugInfo.searchObjs);
      yield put({ type: 'toggleSpin' });
      const { data } = yield call(drugInfoService.deleteDrugInfo, id);
      yield put({ type: 'toggleSpin' });
      if (data && data.success) {
        yield put({ type: 'load', payload: { query: searchObjs } });
      }
    },
    *deleteSelected({ payload }, { select, call, put }) {
      const selectedRowKeys = yield select(state => state.drugInfo.selectedRowKeys);
      const searchObjs = yield select(state => state.drugInfo.searchObjs);
      yield put({ type: 'toggleSpin' });
      const { data } = yield call(drugInfoService.deleteAllDrugInfos, selectedRowKeys);
      yield put({ type: 'toggleSpin' });
      if (data && data.success) {
        yield put({ type: 'load', payload: { query: searchObjs } });
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

    setState(state, { payload }) {
      return { ...state, ...payload };
    },

    toggleSpin(state) {
      return { ...state, isSpin: !state.isSpin };
    },

    toggleVisible(state) {
      return { ...state, visible: !state.visible };
    },

    setSearchObjs(state, { payload: searchObj }) {
      if (searchObj) {
        const searchObjs = merge(state.searchObjs, searchObj);
        return { ...state, searchObjs };
      } else {
        return { ...state, searchObjs: {} };
      }
    },
  },

  subscriptions: {
    // keyEvent(dispatch) {
    //   key('enter', () => {});
    // },
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/operation/settings/medicineMng/operate' ||pathname === '/finance/settings/medicineMng/finance' || pathname === '/pharmacy/settings/medicineMng/medicine') {
          dispatch({
            type: 'utils/initDicts',
            payload: [
              'DRUG_TYPE', 'PRICE_CASE', 'DRUG_QUALITY',
              'COMPANY_TYPE', 'DOSAGE', 'USAGE',
              'MINI_UNIT', 'PACK_UNIT', 'DOSE_UNIT',
            ],
          });
          
        }
      });
    },
  },
};
