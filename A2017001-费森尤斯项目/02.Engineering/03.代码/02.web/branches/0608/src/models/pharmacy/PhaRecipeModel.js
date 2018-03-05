/* eslint linebreak-style: ["error", "windows"]*/
import * as phaRecipeService from '../../services/pharmacy/PhaRecipeService';
import { merge } from 'lodash';
import { getOptions } from '../../services/UtilsService';

export default {
  namespace: 'phaRecipe',

  state: {
    defaultPage: {
      total: 0,
      pageSize: 10,
      pageNo: 1,
    },
    selectedRowKeys: [],
    data: [],
    record: null,
    isSpin: false,
    dicts: {},
    searchObjs: {},
    selectedTag: '',
  },

  effects: {
    *load({ payload }, { select, call, put }) {
      const { query } = (payload || {});
      let { page } = (payload || {});
      const defaultPage = yield select(state => state.phaRecipe.defaultPage);
      page = { ...defaultPage, ...page };
      const { pageNo, pageSize } = page;
      const start = (pageNo - 1) * pageSize;

      yield put({ type: 'toggleSpin' });
      const { data } = yield call(phaRecipeService.loadPage, start, pageSize, query);
      yield put({ type: 'toggleSpin' });

      if (data) {
        yield put({ type: 'init', data, page });
      }
    },
    *save({ params }, { call, put }) {
      yield put({ type: 'toggleSpin' });
      const { data } = yield call(phaRecipeService.save, params);
      if (data && data.success) {
        yield put({ type: 'setState', payload: { record: null } });
        yield put({ type: 'load' });
      }
      yield put({ type: 'toggleSpin' });
    },
    *delete({ id }, { call, put }) {
      yield put({ type: 'toggleSpin' });
      const { data } = yield call(phaRecipeService.delete, id);
      yield put({ type: 'toggleSpin' });
      if (data && data.success) {
        yield put({ type: 'load' });
      }
    },
    *update({ id }, { call, put }) {
      yield put({ type: 'toggleSpin' });
      const { data } = yield call(phaRecipeService.update, id);
      yield put({ type: 'toggleSpin' });
      if (data && data.success) {
        yield put({ type: 'load' });
      }
    },
    *loadDicts({ payload }, { call, put }) {
      const dicts = yield call(getOptions, [
        'REG_LEVEL', 'DEPT_TYPE', 'REG_STATE',
      ]);
      if (dicts) {
        yield put({
          type: 'setState',
          payload: { dicts },
        });
      }
    },
    *deleteSelected({ payload }, { select, call, put }) {
      const selectedRowKeys = yield select(state => state.phaRecip.selectedRowKeys);
      yield put({ type: 'toggleSpin' });
      const { data } = yield call(phaRecipeService.deleteAll, selectedRowKeys);
      yield put({ type: 'toggleSpin' });
      if (data && data.success) {
        yield put({ type: 'load' });
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
        if (pathname === '/dispensary/drugWithdrawal') {
          dispatch({
            type: 'load',
          });
          dispatch({
            type: 'utils/initDicts',
            payload: ['APPLY_STATE', 'INVOICE_TYPE'],
          });
        }
      });
    },
  },
};
