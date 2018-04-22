import { loadTroubleDetailPage, saveTroubleDetail, deleteTroubleDetail } from '../../services/troubles/TroubleDetailService';
import { troubleList } from '../../services/troubles/TroubleService';
function arrayToTree(array){
	var map={},root=[];
	for(var obj of array){
		obj.children=[];
		map[obj.id] = obj; 
	}
	console.info('map : ',map);
	for(var obj of array){
		if(obj.parent){
			var parent = map[obj.parent];
			if(parent){
				parent.children.push(obj);
				obj.parent=parent;
			}else{root.push(obj);}
		}else{
			root.push(obj);
		}
	}
	console.info('root ',root);
	return root;
}

export default {

  namespace: 'troubleDetail',

  state: {
    info: {},
    page: { total: 0, pageSize: 10, pageNo: 1 },
    data: [],
    selectedRowKeys: [],
    record: {},
    spin: false,
    troubles: [],
    outVisible: false,
    visible: false,
    visible2: false,
    account: '',
  },

  effects: {
    /**
     * 获取所有信息
     */
    *load({ payload }, { select, call, put }) {
      const { page, query } = (payload || {});
      const defaultPage = yield select(state => state.troubleDetail.page);
      const newPage = { ...defaultPage, ...page };
      const { pageNo, pageSize } = newPage;
      const start = (pageNo - 1) * pageSize;
      yield put({
        type: 'setState',
        payload: { spin: true },
      });
      console.log('loadTroubleDetailPage',loadTroubleDetailPage);
      var { data } = yield call(loadTroubleDetailPage, start, pageSize, query);
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
      var { data } = yield call( troubleList );
      console.log('data明细=>',data);
      if (data) {
          yield put({
            type: 'inits',
            data
          });
        }
	  	/*if (data && data.success) {
	          yield put({
	            type: 'setState',
	            payload: {
	            	troubles: data.result || [],
	            },
	        });
	    }*/
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
     * 新增材料
     */
    *save({ params }, { call, put }) {
      yield put({
        type: 'setState',
        payload: { spin: true },
      });
      const { data } = yield call(saveTroubleDetail, params);
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
	      const { data } = yield call(deleteTroubleDetail, record);
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
	  inits(state, { data }) {
	      const { result = result || [] } = data;
	      const tree = arrayToTree(result);
	      const troubles = tree || [];
	      return {
	        ...state,
	        troubles,
	      };
	    },
	
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
