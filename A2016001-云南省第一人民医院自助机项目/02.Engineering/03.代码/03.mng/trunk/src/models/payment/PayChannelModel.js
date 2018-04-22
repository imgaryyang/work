import dva from 'dva';
import { loadChannelPage, saveChannel, deleteChannel, deleteAllChannels, getOptions} from '../../services/payment/PayChannelService';
export default {
	
	namespace: 'payChannel',
	
	state: {
		page : { total: 0, pageSize: 10 , pageNo: 1 },
		data: [],
		selectedRowKeys : [],
		record: null,
		spin: false,
		dicts: [],
	},
	effects: {
		*load({ payload }, { select, call, put }) {
	    	var { page, query } = ( payload || {} );
	    	var defaultPage = yield select(state => state.payChannel.page);
	    	var newPage = { ...defaultPage, ...page };
	    	var { pageNo, pageSize } = newPage;
	    	var start = (pageNo-1) * pageSize;
	    	yield put({
	    		type: 'setState', 
	    		payload:{spin : true}
	    	});
	    	const { data } = yield call( loadChannelPage, start, pageSize, query);
	    	yield put({
	    		type: 'setState',payload:{spin:false}
	    	});
	    	if (data && data.success) {
	    		yield put({
	    			type : 'init',
	    			data : data,
	    			page : newPage
	    		})
	    	}
	    },
	    *save({ params }, { select, call, put }) {
	    	yield put({
	    		type: 'setState',
	    		payload:{spin : true}
	    	});
	    	const {data} = yield call( saveChannel, params );
	    	if (data && data.success) {
	    		yield put({
	    			type: 'setState',
	    			payload:{
	    				record : null 
	    			}
	    		})
	    		yield put({type: 'load',})
	    	}
	    	yield put({
	    		type: 'setState',payload:{spin:false}
	    	});
	    },
	    *'delete'({ payload }, { call, put }) {
	        yield put({ type: 'setState', payload: { spin: true } });
	        console.info("ONDELERTE_id:"+payload);
	        const { id } = payload;
	        const { data } = yield call(deleteChannel, id);
	        yield put({ type: 'setState', payload: { spin: false } });
	        if (data && data.success) {
	          yield put({ type: 'load' });
	        }
	     },

	     *deleteSelected({ payload }, { select, call, put }) {
		        const selectedRowKeys = yield select(state => state.payChannel.selectedRowKeys);
		        yield put({ type: 'setState', payload: { spin: true } });
		        const { data } = yield call(deleteAllChannels, selectedRowKeys);
		        yield put({ type: 'setState', payload: { spin: false } });
		        if (data && data.success) {
		          yield put({ type: 'loadTypes' });
		          yield put({ type: 'load' });
		        }
		     },
	     /**
	      * 初始化需要的字典项
	      */
	     *initDicts({ payload }, { call, put }) {
	       const { data } = yield call(getOptions, payload);
	       if (data && data.success) {
	    		yield put({
	    			type: 'setState',
	    			payload:{
	    				dicts : data.result 
	    			}
	    		})
	    	}
	     },
	},
	
	reducers: {
		"init"( state, { data, page }) {
			var { result, total, pageSize, start } = data;
			var p = { ...state.page, ...page, total : total };
			var payChannels = result || [];
			return {...state, data : payChannels, page : p };
		},
		"setState"( oldState, { payload } ){
			return {...oldState,...payload}
		},
	},
};
