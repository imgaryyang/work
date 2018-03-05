import { notification } from 'antd';
import { loadDictPage, saveDict, deleteDict, deleteAllDicts, loadTypes } from '../../services/base/DictionaryService';

export default {
  namespace: 'dict',
  state: {
    tree: [],
    selectedType: {},
    selectedGroup: '',
    selectedColumnName: '',
    selectedColumnDis: '',

    query: {},

    page: { total: 0, pageSize: 10, pageNo: 1 },
    selectedRowKeys: [],
    data: [],
    record: null,
    spin: false,
  },

  effects: {

    *loadTypes({ payload }, { call, put }) {
      yield put({ type: 'setState', payload: { spin: true } });

      const { data } = yield call(loadTypes);

      yield put({ type: 'setState', payload: { spin: false } });

      if (data && data.success) {
        yield put({
          type: 'initTypes',
          data,
        });
      } else {
        notification.error({ message: '错误：', description: data.msg || '未知错误！' });
        yield put({ type: 'setState', payload: { spin: false } });
      }
    },

    *load({ payload }, { select, call, put }) {
      const { page, query, onSearch } = (payload || {});
      console.log(query, page);
      const defaultPage = yield select(state => state.dict.page);
      const defaultQuery = yield select(state => state.dict.query);

      const newPage = { ...defaultPage, ...page };
      const { pageNo, pageSize } = newPage;
      const start = onSearch ? 0 : (pageNo - 1) * pageSize;

      const newQuery = query || defaultQuery;

      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(
        loadDictPage, start, pageSize, newQuery,
      );
      yield put({
        type: 'setState',
        payload: {
          spin: false,
          query: newQuery,
        },
      });

      if (data && data.success) {
        yield put({
          type: 'init',
          data,
          page: newPage,
          query: newQuery,
        });
      } else {
        notification.error({ message: '错误：', description: data.msg || '查询字典信息出错！' });
        yield put({ type: 'setState', payload: { spin: false } });
      }
    },

    *save({ params }, { call, put }) {
      // console.info('save', arguments);
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(saveDict, params);
      if (data && data.success) {
        notification.success({ message: '提示：', description: '保存字典信息成功！' });
        // console.log('result in save():', data.result);
        yield put({ type: 'setState', payload: { record: null, spin: false } });
        yield put({ type: 'loadTypes' });
        yield put({ type: 'load' });
      } else {
        notification.error({ message: '错误：', description: data.msg || '保存字典信息出错！' });
        yield put({ type: 'setState', payload: { spin: false } });
      }
    },

    *delete({ id }, { call, put }) {
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(deleteDict, id);
      yield put({ type: 'setState', payload: { spin: false } });
      if (data && data.success) {
        notification.success({ message: '提示：', description: '删除字典信息成功！' });
        yield put({ type: 'loadTypes' });
        yield put({ type: 'load' });
      } else {
        notification.error({ message: '错误：', description: data.msg || '删除字典信息出错！' });
        yield put({ type: 'setState', payload: { spin: false } });
      }
    },

    *deleteSelected({ payload }, { select, call, put }) {
      const selectedRowKeys = yield select(state => state.dict.selectedRowKeys);
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(deleteAllDicts, selectedRowKeys);
      yield put({ type: 'setState', payload: { spin: false } });
      if (data && data.success) {
        notification.success({ message: '提示：', description: '删除字典信息成功！' });
        yield put({ type: 'loadTypes' });
        yield put({ type: 'load' });
      } else {
        notification.error({ message: '错误：', description: data.msg || '删除字典信息出错！' });
        yield put({ type: 'setState', payload: { spin: false } });
      }
    },
  },

  reducers: {

    initTypes(state, { data }) {
      const tree = [];
      if (data && data.success) {
        const result = data.result;

        const treeTmp = {};
        for (let i = 0; i < result.length; i += 1) {
          const grp = result[i][0];
          const code = result[i][1];
          const disValue = result[i][2];
          if (typeof treeTmp[grp] === 'undefined') {
            treeTmp[grp] = tree.length;
            tree.push({ code: grp, dis: grp, type: '1', group: grp, children: [] });
          }
          tree[treeTmp[grp]].children.push({ code, dis: disValue, type: '2', group: grp, children: [] });
        }
      }
      return { ...state, tree };
    },

    init(state, { data, page }) {
      const { result, total } = data;
      const p = { ...state.page, ...page, total };
      const resData = result || [];
      return { ...state, data: resData, page: p };
    },

    setState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
