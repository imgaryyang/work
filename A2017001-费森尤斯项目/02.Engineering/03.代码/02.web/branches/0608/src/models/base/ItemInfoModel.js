import { merge, isEmpty } from 'lodash';
import baseUtil from '../../utils/baseUtil';

import { loadItemInfoPage, saveItemInfo, deleteItemInfo, deleteAllItemInfo } from '../../services/base/ItemInfoService';

export default {
  namespace: 'itemInfo',

  state: {
    namespace: 'itemInfo',
    selectedTag: '',
    query: {},

    page: { total: 0, pageSize: 10, pageNo: 1 },
    selectedRowKeys: [],
    data: [],
    record: null,
    spin: false,
    visible: false,
  },

  effects: {
    *load({ payload }, { select, call, put }) {
      const { page, query } = (payload || {});
      const defaultPageSize = yield select(state => state.itemInfo.page.pageSize);
      const newPage = page || { total: 0, pageSize: defaultPageSize, pageNo: 1 };
      const defaultQuery = yield select(state => state.itemInfo.query);
      const newQuery = query || defaultQuery;
      const start = (newPage.pageNo - 1) * newPage.pageSize;

      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(loadItemInfoPage, start, newPage.pageSize, newQuery);
      yield put({ type: 'setState', payload: { spin: false }, query: newQuery });

      if (data) {
        yield put({ type: 'init', data, page: newPage });
      }
    },

    *save({ params }, { select, call, put }) {
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(saveItemInfo, params);
      if (data && data.success) {
        // yield put({ type: 'setState', payload: { record: null } });
        const record = yield select(state => state.itemInfo.record);
        yield put({ type: 'setState', payload: { visible: isEmpty(record), record: {} } });
        yield put({ type: 'load' });
      } else if (data && data.msg) {
        baseUtil.alert(data.msg);
      } else {
        baseUtil.alert('不明错误');
      }
      yield put({ type: 'setState', payload: { spin: false } });
    },

    *delete({ id }, { call, put }) {
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(deleteItemInfo, id);
      yield put({ type: 'setState', payload: { spin: false } });
      if (data && data.success) {
        yield put({ type: 'load' });
      } else if (data && data.msg) {
        baseUtil.alert(data.msg);
      } else {
        baseUtil.alert('不明错误');
      }
    },

    *deleteSelected({ payload }, { select, call, put }) {
      const selectedRowKeys = yield select(state => state.itemInfo.selectedRowKeys);
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(deleteAllItemInfo, selectedRowKeys);
      yield put({ type: 'setState', payload: { spin: false } });
      if (data && data.success) {
        yield put({ type: 'load' });
      } else if (data && data.msg) {
        baseUtil.alert(data.msg);
      } else {
        baseUtil.alert('不明错误');
      }
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

    setSearchObjs(state, { payload: searchObj }) {
      if (searchObj) {
        const query = merge(state.query, searchObj);
        return { ...state, query };
      } else {
        return { ...state, query: {} };
      }
    },
  },
};
