import { load, loadTreeItemPage, saveItem, deleteItem, deleteItems } from '../../services/base/TreeService';

export default {
  namespace: 'tree',
  state: {
    tree: [],
    query: {},
    page: { total: 0, pageSize: 10, pageNo: 1 },
    data: [],
    selectedRowKeys: [],
    record: null,
    spin: false,
    options: [],
  },

  effects: {

    *loadTree({ payload }, { call, put }) {
      yield put({ type: 'setState', payload: { spin: true } });

      const { data } = yield call(load);

      yield put({ type: 'setState', payload: { spin: false } });

      if (data && data.success) {
        yield put({
          type: 'initTree',
          data,
        });
      }
    },

    *load({ payload }, { select, call, put }) {
      const { page, query } = (payload || {});

      const defaultPage = yield select(state => state.tree.page);
      const defaultQuery = yield select(state => state.tree.query);

      const newPage = { ...defaultPage, ...page };

      const { pageNo, pageSize } = newPage;
      const start = (pageNo - 1) * pageSize;

      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(
        loadTreeItemPage, start, pageSize, query || defaultQuery,
      );
      yield put({
        type: 'setState',
        payload: {
          spin: false,
          query,
        },
      });

      if (data) {
        yield put({
          type: 'init',
          data,
          page: newPage,
        });
      }
    },

    *lazyLoad({ payload }, { select, call, put }) {
      const { query, selectedOptions } = (payload || {});
      const defaultQuery = yield select(state => state.tree.query);
      const { data } = yield call(load, query || defaultQuery);

      if (data) {
        yield put({
          type: 'forCascader',
          data,
          selectedOptions,
        });
      }
    },

    *save({ params }, { call, put }) {
      // console.info('save', arguments);
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(saveItem, params);
      if (data && data.success) {
        // console.log('result in save():', data.result);
        yield put({ type: 'setState', payload: { record: null } });
        yield put({ type: 'loadTree' });
        yield put({ type: 'load' });
      }
      yield put({ type: 'setState', payload: { spin: false } });
    },

    *delete({ id }, { call, put }) {
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(deleteItem, id);
      yield put({ type: 'setState', payload: { spin: false } });
      if (data && data.success) {
        yield put({ type: 'loadTree' });
        yield put({ type: 'load' });
      }
    },

    *deleteSelected({ payload }, { select, call, put }) {
      const selectedRowKeys = yield select(state => state.tree.selectedRowKeys);
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(deleteItems, selectedRowKeys);
      yield put({ type: 'setState', payload: { spin: false } });
      if (data && data.success) {
        yield put({ type: 'loadTree' });
        yield put({ type: 'load' });
      }
    },
  },

  reducers: {

    initTree(state, { data }) {

      const tree = [];
      if (data && data.success) {
        const result = data.result;
      }
      return { ...state, tree };
    },

    init(state, { data, page }) {
      const { result, total } = data;
      const p = { ...state.page, ...page, total };
      const resData = result || [];
      return { ...state, data: resData, page: p };
    },

    forCascader(state, { data, selectedOptions }) {
      const { result } = data;
      const resData = result || [];
      const options = [];
      const targetOption = selectedOptions ? selectedOptions[0] : {};
      targetOption.loading = true;
      console.log('resData:', resData);
      for (let i = 0; i < resData.length; i += 1) {
        const item = {
          id: resData[i].id,
          value: resData[i].key,
          label: resData[i].value,
          isLeaf: resData[i].leaf,
        };
        if (selectedOptions) {
          targetOption.children = [];
          targetOption.children.push(item);
          console.log('targetOption:', targetOption);
        } else {
          options.push(item);
        }
      }
      targetOption.loading = false;
      return { ...state, options: selectedOptions ? { ...(state.options) } : options };
    },

    setState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
