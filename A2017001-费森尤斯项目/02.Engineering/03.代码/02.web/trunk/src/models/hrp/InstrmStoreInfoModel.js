import _ from 'lodash';
import baseUtil from '../../utils/baseUtil';
import { loadStoreInfoPage, saveEditStoreInfo } from '../../services/hrp/StoreInfoService';

export default {
  namespace: 'instrmStoreInfo',

  state: {
    page: { total: 0, pageSize: 10, pageNo: 1 },
    searchObjs: {},
    data: [],
    spin: false,
    record: null,
    updateRow: [],
  },

  effects: {
    *load({ payload }, { select, call, put }) {
      const { page, query } = (payload || {});
      const defaultPage = yield select(state => state.instrmStoreInfo.page);
      let searchObjs = yield select(state => state.instrmStoreInfo.searchObjs);
      searchObjs = { ...searchObjs, ...query };
      const newPage = { ...defaultPage, ...page };
      const { pageNo, pageSize } = newPage;
      const start = (pageNo - 1) * pageSize;
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(loadStoreInfoPage, start, pageSize, searchObjs);
      if (data) {
        yield put({ type: 'init', data, page: newPage });
      }

      yield put({ type: 'setState', payload: { spin: false, updateRow: [] } });
    },

    *save({ payload }, { select, call, put }) {
      const updateRow = yield select(state => state.instrmStoreInfo.updateRow);
      const updateData = yield select(state => state.instrmStoreInfo.data);
      let i;
      let j;
      let params = [];

      for (i in updateRow) {
        j = updateRow[i];
        params = params.concat(updateData[j]);
      }

      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(saveEditStoreInfo, params);

      if (data && data.success) {
        yield put({ type: 'setState', payload: { record: null } });
        yield put({ type: 'load' });
      } else if (data && data.msg) {
        baseUtil.alert(data.msg);
      } else {
        baseUtil.alert('不明错误');
      }

      yield put({ type: 'setState', payload: { spin: false } });
    },
  },

  reducers: {
    init(state, { data, page }) {
      const { result, total } = data;
      const p = { ...state.page, ...page, total };
      const datatmp = result || [];
      return { ...state, data: datatmp, page: p };
    },

    setState(state, { payload }) {
      return { ...state, ...payload };
    },

    resetPage(state) {
      // return { ...state, page: { ...page, pageNo: 1 } };
      const page = { total: 0, pageSize: state.page.pageSize, pageNo: 1 };
      return { ...state, page };
    },

    updateRow(state, { row }) {
      const updateRow = (!_.isNumber(row) || _.includes(state.updateRow, row)) ? state.updateRow : state.updateRow.concat(row);
      return { ...state, updateRow };
    },

    setSearchObjs(state, { payload: searchObj }) {
      if (searchObj) {
        const searchObjs = _.merge(state.searchObjs, searchObj);
        return { ...state, searchObjs };
      } else {
        return { ...state, searchObjs: {} };
      }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/hrp/instrmStoreInfo') {
          dispatch({
            type: 'utils/initDictTrees',
            payload: ['ASSETS_TYPE'],
          });
        }
      });
    },
  },
};
