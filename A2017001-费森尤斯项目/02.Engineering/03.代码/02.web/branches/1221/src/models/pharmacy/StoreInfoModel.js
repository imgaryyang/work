import _ from 'lodash';
import baseUtil from '../../utils/baseUtil';
import { loadStoreInfoPage, saveEditStoreInfo } from '../../services/pharmacy/StoreInfoService';
import { loadStoreSumInfoPage, saveEditStoreSumInfo } from '../../services/pharmacy/StoreSumInfoService';

export default {
  namespace: 'storeInfo',

  state: {
    page: { total: 0, pageSize: 10, pageNo: 1 },
    searchObjs: {},
    data: [],
    spin: false,
    record: null,
    activeKey: '1',
    tabArray: [{ key: 1, tab: '库存汇总' }, { key: 2, tab: '库存明细' }],
    updateRow: [],
  },

  effects: {
    *load({ payload }, { select, call, put }) {
      const { page, query } = (payload || {});
      const activeKey = yield select(state => state.storeInfo.activeKey);
      const searchObjs = yield select(state => state.storeInfo.searchObjs);
      const defaultPage = yield select(state => state.storeInfo.page);
      const newPage = { ...defaultPage, ...page };
      const { pageNo, pageSize } = newPage;
      const start = (pageNo - 1) * pageSize;
      const newQuery = { ...searchObjs, ...query };
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = activeKey === '1' ? yield call(loadStoreSumInfoPage, start, pageSize, newQuery) :
        yield call(loadStoreInfoPage, start, pageSize, newQuery);

      if (data) {
        yield put({ type: 'init', data, page: newPage });
      }

      yield put({ type: 'setState', payload: { spin: false, updateRow: [] } });
    },

    *save({ payload }, { select, call, put }) {
      const activeKey = yield select(state => state.storeInfo.activeKey);
      const updateRow = yield select(state => state.storeInfo.updateRow);
      const updateData = yield select(state => state.storeInfo.data);
      let i;
      let j;
      let params = [];

      for (i in updateRow) {
        j = updateRow[i];
        params = params.concat(updateData[j]);
      }

      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = activeKey === '1' ? yield call(saveEditStoreSumInfo, params) : yield call(saveEditStoreInfo, params);

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
};
