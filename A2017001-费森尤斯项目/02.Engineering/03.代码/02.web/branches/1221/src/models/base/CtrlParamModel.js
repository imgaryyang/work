import { notification } from 'antd';
import { saveCtrlParam, deleteCtrlParam, deleteAllCtrlParams, loadTypes, loadCtrlParamPage } from '../../services/base/CtrlParamService';

export default {
  namespace: 'ctrlParam',
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
      }
    },

    *load({ payload }, { select, call, put }) {
      const { page, query, onSearch } = (payload || {});
      const defaultPage = yield select(state => state.dict.page);
      const defaultQuery = yield select(state => state.dict.query);

      const newPage = { ...defaultPage, ...page };
      const { pageNo, pageSize } = newPage;
      const start = onSearch ? 0 : (pageNo - 1) * pageSize;

      const newQuery = query || defaultQuery;

      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(
        loadCtrlParamPage, start, pageSize, newQuery,
      );
      yield put({
        type: 'setState',
        payload: {
          spin: false,
          query: newQuery,
        },
      });

      if (data) {
        yield put({
          type: 'init',
          data,
          page: newPage,
          query: newQuery,
        });
      }
    },

    *save({ params }, { select, call, put }) {
      // console.info('save', arguments);
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(saveCtrlParam, params);
      const selectedType = yield select(state => state.ctrlParam.selectedType);
      const values = {
        controlClass: selectedType.type === '2' ? selectedType.code : '',
      };
      if (data && data.success) {
        yield put({ type: 'setState', payload: { record: null } });
        yield put({ type: 'loadTypes' });
        yield put({ type: 'load', payload: { query: values } });
      }
      else {
         // TODO: 提示错误
        notification.info({
          message: '提示',
          description: data.msg,
        });
      }
      yield put({ type: 'setState', payload: { spin: false } });
    },

    *delete({ id }, { call, put }) {
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(deleteCtrlParam, id);
      if (data && data.success) {
        yield put({ type: 'loadTypes' });
        yield put({ type: 'load' });
      }
      yield put({ type: 'setState', payload: { spin: false } });
    },

    *deleteSelected({ payload }, { select, call, put }) {
      const selectedRowKeys = yield select(state => state.ctrlParam.selectedRowKeys);
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(deleteAllCtrlParams, selectedRowKeys);
      if (data && data.success) {
        yield put({ type: 'loadTypes' });
        yield put({ type: 'load' });
      }
      yield put({ type: 'setState', payload: { spin: false } });
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
          const dis = result[i][2];
          if (typeof treeTmp[grp] === 'undefined') {
            treeTmp[grp] = tree.length;
            tree.push({ code: grp, dis: grp, type: '1', group: grp, children: [] });
          }
          tree[treeTmp[grp]].children.push({ code, dis, type: '2', group: grp, children: [] });
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
