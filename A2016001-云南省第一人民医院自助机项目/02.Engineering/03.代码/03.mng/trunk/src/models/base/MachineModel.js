import dva from 'dva';
import { loadMachinePage, saveMachine,deleteMachine,deleteAllMachines,getOptions,getCashboxOptions} from '../../services/base/MachineService';
export default {
	
	namespace: 'machine',
	
	state: {
		info : {},
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
	    	var defaultPage = yield select(state => state.machine.page);
	    	var newPage = { ...defaultPage, ...page };
	    	var { pageNo, pageSize } = newPage;
	    	var start = (pageNo-1) * pageSize;
	    	yield put({
	    		type: 'setState', 
	    		payload:{spin : true}
	    	});
	    	const { data } = yield call( loadMachinePage, start, pageSize, query);
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
		    console.info('save',arguments);
	    	yield put({
	    		type: 'setState',
	    		payload:{spin : true}
	    	});
	    	const {data} = yield call( saveMachine, params );
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
	    *delete({ payload }, { call, put }) {
	    	const {id} = payload;
	        yield put({ type: 'setState', payload: { spin: true } });
	        const { data } = yield call(deleteMachine, id);
	        yield put({ type: 'setState', payload: { spin: false } });
	        if (data && data.success) {
	          yield put({ type: 'loadTypes' });
	          yield put({ type: 'load' });
	        }
	     },

	     *deleteSelected({ payload }, { select, call, put }) {
	        const selectedRowKeys = yield select(state => state.role.selectedRowKeys);
	        yield put({ type: 'setState', payload: { spin: true } });
	        const { data } = yield call(deleteAllMachines, selectedRowKeys);
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
	     /**
	      * 获取有钱箱的机器
	      */
	     *initCashboxDicts({ payload }, { call, put }) {
		       const { data } = yield call(getCashboxOptions, payload);
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
			var machines = result || [];
			return {...state, data : machines, page : p };
		},
		"setState"( oldState, { payload } ){
			return {...oldState,...payload}
		},
	},
};
