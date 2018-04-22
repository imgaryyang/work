import { loadOutMaterialDetailPage, saveOutMaterialDetail, deleteOutMaterialDetail } from '../../services/materials/MaterialDetailService';
import { loadMaterials, selectAccount } from '../../services/materials/MaterialManageService';

export default {

  namespace: 'outMaterialDetail',

  state: {
    info: {},
    page: { total: 0, pageSize: 10, pageNo: 1 },
    data: [],
    selectedRowKeys: [],
    record: {},
    spin: false,
    materials: [],
    outVisible: false,
    visible: false,
    account: '',
  },

  effects: {
    /**
     * 获取所有信息
     */
    *load({ payload }, { select, call, put }) {
      const { page, query } = (payload || {});
      const defaultPage = yield select(state => state.outMaterialDetail.page);
      const newPage = { ...defaultPage, ...page };
      const { pageNo, pageSize } = newPage;
      const start = (pageNo - 1) * pageSize;
      yield put({
        type: 'setState',
        payload: { spin: true },
      });
      var { data } = yield call(loadOutMaterialDetailPage, start, pageSize, query);
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

    *loadUserInfo({ payload }, { call, put }) {
      const { record } = payload;
      yield put({
        type: 'setState',
        payload: {
          spin: true,
          outVisible: true,
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
     * 查询材料数量
     */
    *selectAccount({ payload }, { call, put }) {
    	const { data } = yield call(selectAccount, payload);
    	if(data && data.success) {
    		yield put({
    			type: 'setState',
    			payload: {
    				account: data.result || '',
    			},
    		});
    	}
    },
    /**
     * 新增材料
     */
    *save({ params }, { call, put }) {
      yield put({
        type: 'setState',
        payload: { spin: true },
      });
      const { data } = yield call(saveOutMaterialDetail, params);
      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: {
            spin: false,
            outVisible: false,
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
	      const { data } = yield call(deleteOutMaterialDetail, record);
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
	      const details = result || [];
	      return { ...state, data: details, page: p };
    },

    setState(oldState, { payload }) {
    	return { ...oldState, ...payload };
    },

  },
};
