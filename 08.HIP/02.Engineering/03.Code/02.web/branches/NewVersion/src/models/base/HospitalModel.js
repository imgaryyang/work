import { editHospital, loadHospitalPage, saveHospital, deleteHospital, deleteAllHospitals, loadTypes } from '../../services/base/HospitalService';

export default {
  namespace: 'hospital',
  state: {
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
    dicts: [],
    tree: [],
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
      const { page, query } = (payload || {});

      const defaultPage = yield select(state => state.hospital.page);
      const defaultQuery = yield select(state => state.dict.query);
      const newPage = { ...defaultPage, ...page };
      const { pageNo, pageSize } = newPage;
      const start = (pageNo - 1) * pageSize;

      yield put({ type: 'setState', payload: { spin: true } });
      //      const { data } = yield call(loadHospitalPage, start, pageSize, query || defaultQuery);
      const { data } = yield call(editHospital);


      yield put({ type: 'setState', payload: { spin: false } });
      if (data) {
        yield put({ type: 'init', data, page: newPage });
      }
    },
    *save({ params }, { call, put }) {
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(saveHospital, params);
      if (data && data.success) {
        yield put({ type: 'setState', payload: { record: null } });
        yield put({ type: 'loadTypes' });
        yield put({ type: 'load' });
      }
      yield put({ type: 'setState', payload: { spin: false } });
    },
    *delete({ id }, { call, put }) {
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(deleteHospital, id);
      yield put({ type: 'setState', payload: { spin: false } });
      if (data && data.success) {
        yield put({ type: 'loadTypes' });
        yield put({ type: 'load' });
      }
    },
    *deleteSelected({ payload }, { select, call, put }) {
      const selectedRowKeys = yield select(state => state.hospital.selectedRowKeys);
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(deleteAllHospitals, selectedRowKeys);
      yield put({ type: 'setState', payload: { spin: false } });
      if (data && data.success) {
        yield put({ type: 'loadTypes' });
        yield put({ type: 'load' });
      }
    },
  },
  reducers: {
    initTypes(state, { data }) {
      const tree = [];
      if (data && data.success) {
        const { result } = data;

        const treeTmp = {};
        for (let i = 0; i < result.length; i += 1) {
          const grp = result[i][0];
          const code = result[i][1];
          const dis = result[i][2];
          if (typeof treeTmp[grp] === 'undefined') {
            treeTmp[grp] = tree.length;
            tree.push({
              code: grp, dis: grp, type: '1', group: grp, children: [],
            });
          }
          tree[treeTmp[grp]].children.push({
            code, dis, type: '2', group: grp, children: [],
          });
        }
      }
      return { ...state, tree };
    },

    init(state, { data, page }) {
      const { result, total } = data;
      const p = { ...state.page, ...page, total };
      const data1 = result || [];
      return { ...state, data: data1, page: p };
    },
    setState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
