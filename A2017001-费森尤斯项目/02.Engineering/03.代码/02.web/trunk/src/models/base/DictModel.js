import dva from 'dva';
import { loadDictPage,saveDict,deleteDict,deleteAllDicts} from '../../services/base/DictService';

var menu = [];
export default {
	namespace: 'dictionary',
	state: {
		page : {total : 0,pageSize : 10 , pageNo:1 },
		selectedRowKeys : [],
		data :[],
		record : null,
		spin : false,
	},
	effects: {
		*load({ payload }, { select, call, put }) {
	    	var {page,query} = (payload||{});
	    	var defaultPage = yield select(state => state.dictionary.page);
	    	var newPage = {...defaultPage,...page};
	    	var { pageNo, pageSize } = newPage;
	    	var start   = (pageNo-1)*pageSize;
	    	
	    	yield put({type: 'setState',payload:{spin:true}});
	    	const {data} = yield call(loadDictPage,
	    		start, pageSize, query
	    	);
	    	yield put({type: 'setState',payload:{spin:false}});
	    	
	    	if (data) {yield put({
    			type: 'init',
    			data:data,
    			page:newPage
	        })}
	    },
	    *save({ params }, { select, call, put }) {console.info('save',arguments);
	    	yield put({type: 'setState',payload:{spin:true}});
	    	const {data} = yield call(saveDict,params);
	    	if (data&&data.success) {
	    		yield put({type: 'setState',payload:{record : null }})
	    		yield put({type: 'load',})
	    	}
	    	yield put({type: 'setState',payload:{spin:false}});
	    },
	    *'delete'({ id }, { select, call, put }){
	    	yield put({type: 'setState',payload:{spin:true}});
	    	const {data} = yield call(deleteDict,id);
	    	yield put({type: 'setState',payload:{spin:false}});
	    	if (data&&data.success) {
	    		yield put({type: 'load',})
	    	}
	    },
	    *'deleteSelected'({}, { select, call, put }){
	    	var selectedRowKeys = yield select(state => state.dictionary.selectedRowKeys);
	    	yield put({type: 'setState',payload:{spin:true}});
	    	const {data} = yield call(deleteAllDicts,selectedRowKeys);
	    	yield put({type: 'setState',payload:{spin:false}});
	    	if (data&&data.success) {
	    		yield put({type: 'load',})
	    	}
	    }
	},
	reducers: {
		"init"(state,{data,page}) {
			var {result,total,pageSize,start} = data;
			var p = {...state.page,...page,total:total};
			var data=result||[];
			return { ...state,data:data,page:p};
		},
		"setState"(state,{payload}){
			return { ...state,...payload}
		},
	},
};