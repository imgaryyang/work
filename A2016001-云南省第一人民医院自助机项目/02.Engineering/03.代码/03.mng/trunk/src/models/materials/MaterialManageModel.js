import { loadMaterialPage, saveMaterial, deleteMaterial, loadMaterials } from '../../services/materials/MaterialManageService';

export default {

  namespace: 'material',

  state: {
    info: {},
    page: { total: 0, pageSize: 10, pageNo: 1 },
    data: [],
    accounts: [],
    selectedRowKeys: [],
    record: {},
    spin: false,
    visible: false,
  },

  effects: {
    /**
     * 获取所有材料信息分页
     */
    *load({ payload }, { select, call, put }) {
      const { page, query } = (payload || {});
      const defaultPage = yield select(state => state.material.page);
      const newPage = { ...defaultPage, ...page };
      const { pageNo, pageSize } = newPage;
      const start = (pageNo - 1) * pageSize;
      yield put({
        type: 'setState',
        payload: { spin: true },
      });
      const { data } = yield call(loadMaterialPage, start, pageSize, query);
      console.log("data",data);
      yield put({
        type: 'setState', payload: { spin: false },
      });
      if (data && data.success) {
        yield put({
          type: 'init',
          data,
          page: newPage,
        });
      }
    },
    /**
     * 加载所有材料信息
     */
    *loadMaterial({ params }, { call, put }) {
    	yield put({
            type: 'setState',
            payload: {
            	inVisible: true,
            },
        });
    	const { data } = yield call(loadMaterials);
    	if (data && data.success) {
            yield put({
              type: 'setState',
              payload: {
            	  materials: data.result || [],
              },
            });
        }
    },
    *loadUserInfo({ payload }, { call, put }) {
      const { record } = payload;
      yield put({
        type: 'setState',
        payload: {
          spin: true,
          visible: true,
        },
      });
      yield put({
        type: 'setState',
        payload: {
          record,
          spin: false,
        },
      });
    },

    /**
     * 新增材料
     */
    *save({ params }, { call, put }) {
      yield put({
        type: 'setState',
        payload: { spin: true },
      });
      const { data } = yield call(saveMaterial, params);
      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: {
            spin: false,
            visible: false,
            record: {},
          },
        });
        yield put({ type: 'load' });
      }
      yield put({
        type: 'setState', payload: { spin: false },
      });
    },
    /**
     * 删除
     */
    *delete({ record }, { call, put }) {
      const { data } = yield call(deleteMaterial, record);
      if (data && data.success) {
        yield put({ type: 'load' });
      }
    },
    /**
     * 修改
     */
    *onUpdate({ payload }, { call, put }) {
      const {record} = payload;
      yield put({
        type: 'setState', payload: { record: record },
      });
    },
  },

  reducers: {

    init(state, { data, page }) {
      const { result, total } = data;
      const p = { ...state.page, ...page, total };
      const users = result || [];
      return { ...state, data: users, page: p };
    },

    setState(oldState, { payload }) {
    	return { ...oldState, ...payload };
    },

  },
};
