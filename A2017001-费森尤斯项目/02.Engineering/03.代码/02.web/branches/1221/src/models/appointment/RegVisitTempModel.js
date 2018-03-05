import { merge, isEmpty } from 'lodash';
import { notification } from 'antd';
import * as RegVisitTempService from '../../services/appointment/RegVisitTempService';

export default {
  namespace: 'regVisitTemp',

  state: {
    namespace: 'regVisitTemp',
    defaultPage: {
      total: 0,
      pageSize: 10,
      pageNo: 1,
    },
    selectedRowKeys: [],
    data: [],
    selectedType: {},
    treeData: [],
    result: {},
    isSpin: false,
    searchObjs: {},
    activeWeek: '1',
    controlParam: 1,
    visible: false,
    formCache: {},
    verifyVal: true,
  },

  effects: {
    *load({ payload }, { select, call, put }) {
      let { query, page } = (payload || {});
      const searchObjs = yield select(state => state.regVisitTemp.searchObjs);
      const defaultPage = yield select(state => state.regVisitTemp.defaultPage);
      query = { ...query, ...searchObjs };
      page = { ...defaultPage, ...page };
      const { pageNo, pageSize } = page;
      const start = (pageNo - 1) * pageSize;

      yield put({ type: 'toggleSpin' });
      const { data } = yield call(RegVisitTempService.loadInfoPage, start, pageSize, query);
      yield put({ type: 'toggleSpin' });

      if (data) {
        yield put({ type: 'init', data, page });
      }
    },
    *save({ params }, { select, call, put }) {
      const verifyVal = yield select(state => state.regVisitTemp.verifyVal);
      if (!verifyVal) {
        notification.info({ message: '提示信息：', description: '请先维护此号别的费用明细！' });
        return;
      }
      yield put({ type: 'toggleSpin' });
      const record = yield select(state => state.utils.record);
      const searchObjs = yield select(state => state.regVisitTemp.searchObjs);
      const { data } = yield call(RegVisitTempService.saveInfo, params);
      /* isEmpty(record) ? create : update */
      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: {
            visible: isEmpty(record),
            result: data,
          },
        });
        yield put({ type: 'load', payload: { query: searchObjs } });
      }
      yield put({ type: 'toggleSpin' });
    },
    *delete({ id }, { select, call, put }) {
      const query = yield select(state => state.regVisitTemp.searchObjs);
      yield put({ type: 'toggleSpin' });
      const { data } = yield call(RegVisitTempService.deleteInfo, id);
      yield put({ type: 'toggleSpin' });
      if (data && data.success) {
        yield put({ type: 'load', payload: { query } });
      }
    },
    *deleteSelected({ payload }, { select, call, put }) {
      const query = yield select(state => state.regVisitTemp.searchObjs);
      const selectedRowKeys = yield select(state => state.regVisitTemp.selectedRowKeys);
      yield put({ type: 'toggleSpin' });
      const { data } = yield call(RegVisitTempService.deleteAllInfos, selectedRowKeys);
      yield put({ type: 'toggleSpin' });
      if (data && data.success) {
        yield put({ type: 'load', payload: { query } });
      }
    },
    *loadDictByType({ dictType }, { call, put }) {
      const { data } = yield call(RegVisitTempService.loadDictByType, dictType);
      if (data && data.success) {
        yield put({ type: 'initTypes', data });
      }
    },
    *verify({ payload }, { call, put }) {
      const data = yield call(RegVisitTempService.verifyInfo, payload);
      if (data.data.result <= 0) {
        notification.info({ message: '提示信息：', description: '请先维护此号别的费用明细！' });
        yield put({
          type: 'setState',
          payload: {
            verifyVal: false,
          },
        });
      } else {
        yield put({
          type: 'setState',
          payload: {
            verifyVal: true,
          },
        });
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
        if (pathname === '/appointment/settings/regVisitTemp') {
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
