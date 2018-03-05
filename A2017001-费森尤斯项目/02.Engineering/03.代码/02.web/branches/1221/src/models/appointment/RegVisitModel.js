import { merge } from 'lodash';
import * as RegVisitService from '../../services/appointment/RegVisitService';
import { getOptions } from '../../services/UtilsService';

export default {
  namespace: 'regVisit',

  state: {
    defaultPage: {
      total: 0,
      pageSize: 10,
      pageNo: 1,
    },
    selectedRowKeys: [],
    data: [],
    selectedType: {},
    treeData: [],
    dicts: {},
    record: null,
    isSpin: false,
    searchObjs: {},
    activeWeek: '',
    activeDay: '',
    weekArray: [],
  },

  effects: {
    *load({ payload }, { select, call, put }) {
      let { query, page } = (payload || {});
      const searchObjs = yield select(state => state.regVisit.searchObjs);
      const defaultPage = yield select(state => state.regVisit.defaultPage);
      query = { ...query, ...searchObjs };
      page = { ...defaultPage, ...page };
      const { pageNo, pageSize } = page;
      const start = (pageNo - 1) * pageSize;

      yield put({ type: 'toggleSpin' });
      const { data } = yield call(RegVisitService.loadInfoPage, start, pageSize, query);
      yield put({ type: 'toggleSpin' });

      if (data) {
        yield put({ type: 'init', data, page });
      }
    },
    *save({ params }, { select, call, put }) {
      const query = yield select(state => state.regVisit.searchObjs);
      yield put({ type: 'toggleSpin' });
      const { data } = yield call(RegVisitService.saveInfo, params);
      if (data && data.success) {
        yield put({ type: 'setState', payload: { record: null } });
        yield put({ type: 'load', payload: { query } });
      }
      yield put({ type: 'toggleSpin' });
    },
    *delete({ id }, { select, call, put }) {
      const query = yield select(state => state.regVisit.searchObjs);
      yield put({ type: 'toggleSpin' });
      const { data } = yield call(RegVisitService.deleteInfo, id);
      yield put({ type: 'toggleSpin' });
      if (data && data.success) {
        yield put({ type: 'load', payload: { query } });
      }
    },
    *update({ id }, { call, put }) {
      yield put({ type: 'toggleSpin' });
      const { data } = yield call(RegVisitService.updateInfo, id);
      yield put({ type: 'toggleSpin' });
      if (data && data.success) {
        yield put({ type: 'load' });
      }
    },
    *deleteSelected({ payload }, { select, call, put }) {
      const selectedRowKeys = yield select(state => state.regVisit.selectedRowKeys);
      const query = yield select(state => state.regVisit.searchObjs);
      yield put({ type: 'toggleSpin' });
      const { data } = yield call(RegVisitService.deleteAllInfos, selectedRowKeys);
      yield put({ type: 'toggleSpin' });
      if (data && data.success) {
        yield put({ type: 'load', payload: { query } });
      }
    },
    *loadDicts({ payload }, { call, put }) {
      const dicts = yield call(getOptions, [
        'REG_LEVEL', 'DEPT_TYPE',
      ]);
      if (dicts) {
        yield put({ type: 'setState', payload: { dicts } });
      }
    },
    *loadDictByType({ dictType }, { call, put }) {
      const { data } = yield call(RegVisitService.loadDictByType, dictType);
      if (data && data.success) {
        yield put({ type: 'initTypes', data });
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

    initTypes(state, { data }) {
      const treeData = [];
      if (data && data.success) {
        const result = data.result;
        for (const key of Object.keys(result)) {
          treeData.push({ key, val: result[key] });
        }
      }
      return { ...state, treeData };
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
        if (pathname === '/appointment/settings/regVisit') {
          dispatch({
            type: 'utils/initDicts',
            payload: ['REG_LEVEL', 'DEPT_TYPE', 'NOON_TYPE'],
          });
          dispatch({
            type: 'loadDictByType',
            dictType: 'DEPT_TYPE',
          });
        }
      });
    },
  },
};
