import { loadInMaterialDetailPage, saveMaterialDetail, deleteMaterialDetail } from '../../services/materials/MaterialDetailService';
import { loadMaterials } from '../../services/materials/MaterialManageService';

export default {

  namespace: 'inMaterialDetail',

  state: {
    info: {},
    page: { total: 0, pageSize: 10, pageNo: 1 },
    data: [],
    selectedRowKeys: [],
    record: {},
    materials: [],
    spin: false,
    inVisible: false,
  },

  effects: {
    /**
     * 获取所有信息分页
     */
    *load({ payload }, { select, call, put }) {
      const { page, query } = (payload || {});
      const defaultPage = yield select(state => state.inMaterialDetail.page);
      const newPage = { ...defaultPage, ...page };
      const { pageNo, pageSize } = newPage;
      const start = (pageNo - 1) * pageSize;
      yield put({
          type: 'setState', payload: { spin: true },
        });
      var { data } = yield call(loadInMaterialDetailPage, start, pageSize, query);
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
      var { data } = yield call( loadMaterials );
	  	if (data && data.success) {
	          yield put({
	            type: 'setState',
	            payload: {
	          	  materials: data.result || [],
	            },
	          });
	      }
    },

    /**
     * 加载所有材料信息
     */
    *loadMaterial({ params }, { call, put }) {
    	const { data } = yield call( loadMaterials );
    	if (data && data.success) {
            yield put({
              type: 'setState',
              payload: {
            	  materials: data.result || [],
              },
            });
        }
    },
    /**
     * 新增材料入库
     */
    *save({ params }, { call, put }) {
      yield put({
        type: 'setState',
        payload: { spin: true },
      });
      const { data } = yield call(saveMaterialDetail, params);
      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: {
            spin: false,
            inVisible: false,
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
     * 删除材料
     */
    *delete({ record }, { call, put }) {
      const { data } = yield call(deleteMaterialDetail, record);
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
