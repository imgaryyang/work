import { merge } from 'lodash';
import * as regInfoService from '../../services/appointment/RegInfoService';

export default {
  namespace: 'regInfo',

  state: {
    namespace: 'regInfo',
    defaultPage: {
      total: 0,
      pageSize: 10,
      pageNo: 1,
    },
    selectedRowKeys: [],
    data: [],
    isSpin: false,
    dicts: {},
    searchObjs: {},
    patient: {},
    payWays: [],
    visible: false,
    record: {},
    result: {},
    isModalSpin: false,
  },

  effects: {
    *load({ payload }, { select, call, put }) {
      const { query } = (payload || {});
      let { page } = (payload || {});
      const defaultPage = yield select(state => state.regVisitTemp.defaultPage);
      page = { ...defaultPage, ...page };
      const { pageNo, pageSize } = page;
      const start = (pageNo - 1) * pageSize;

      yield put({ type: 'toggleSpin' });
      const { data } = yield call(regInfoService.loadRegInfoPage, start, pageSize, query);
      yield put({ type: 'toggleSpin' });

      if (data) {
        yield put({ type: 'init', data, page });
      }
    },
    *save({ params }, { call, put }) {
      yield put({ type: 'toggleSpin' });
      const { data } = yield call(regInfoService.saveRegInfo, params);
      yield put({ type: 'toggleSpin' });
      if (data && data.success) {
        yield put({ type: 'load' });
      }
    },
    *delete({ id }, { call, put }) {
      yield put({ type: 'toggleSpin' });
      const { data } = yield call(regInfoService.deleteRegInfo, id);
      yield put({ type: 'toggleSpin' });
      if (data && data.success) {
        yield put({ type: 'load' });
      }
    },
    *update({ id }, { call, put }) {
      yield put({ type: 'toggleModalSpin' });
      const { data } = yield call(regInfoService.updateRegInfo, id);
      yield put({ type: 'toggleModalSpin' });
      if (data && data.success) {
        yield put({ type: 'setState', payload: { result: data } });
        yield put({ type: 'toggleVisible' });
        yield put({ type: 'load' });
      }
    },
    *deleteSelected({ payload }, { select, call, put }) {
      const selectedRowKeys = yield select(state => state.companyInfo.selectedRowKeys);
      yield put({ type: 'toggleSpin' });
      const { data } = yield call(regInfoService.deleteAllRegInfos, selectedRowKeys);
      yield put({ type: 'toggleSpin' });
      if (data && data.success) {
        yield put({ type: 'load' });
      }
    },
    *getCancelInfo({ payload }, { call, put }) {
      const { id } = (payload || {});
      yield put({ type: 'toggleModalSpin' });
      const { data } = yield call(regInfoService.getCancelInfo, id);
      if (data && data.success) {
        const { payWays } = data.result;
        yield put({ type: 'setState', payload: { record: data.result, payWays } });
      }
      yield put({ type: 'toggleModalSpin' });
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

    toggleModalSpin(state) {
      return { ...state, isModalSpin: !state.isModalSpin };
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
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/appointment/regInfo') {
          dispatch({
            type: 'load',
          });
          dispatch({
            type: 'utils/initDicts',
            payload: ['SEX', 'REG_LEVEL', 'DEPT_TYPE', 'REG_STATE', 'FEE_TYPE', 'PAY_MODE'],
          });
        }
      });
    },
  },
};
