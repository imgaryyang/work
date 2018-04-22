import dva from 'dva';
import { loadOrgPage, saveOrg,deleteOrg,deleteAllOrgs} from '../../services/base/OrgService';
export default {
	
	namespace: 'org',
	
	state: {
		info : {},
		page : { total: 0, pageSize: 10 , pageNo: 1 },
		data: [],
		selectedRowKeys : [],
		record: null,
		spin: false
	},
	effects: {
		*load({ payload }, { select, call, put }) {
	    	var { page, query } = ( payload || {} );
	    	var defaultPage = yield select(state => state.org.page);
	    	var newPage = { ...defaultPage, ...page };
	    	var { pageNo, pageSize } = newPage;
	    	var start = (pageNo-1) * pageSize;
	    	yield put({
	    		type: 'setState', 
	    		payload:{spin : true}
	    	});
	    	const { data } = yield call( loadOrgPage, start, pageSize, query);
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
	    	const {data} = yield call( saveOrg, params );
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
	    *'delete'({ id }, { call, put }) {
	        yield put({ type: 'setState', payload: { spin: true } });
	        const { data } = yield call(deleteOrg, id);
	        yield put({ type: 'setState', payload: { spin: false } });
	        if (data && data.success) {
	          yield put({ type: 'loadTypes' });
	          yield put({ type: 'load' });
	        }
	     },

	     *deleteSelected({ payload }, { select, call, put }) {
	        const selectedRowKeys = yield select(state => state.role.selectedRowKeys);
	        yield put({ type: 'setState', payload: { spin: true } });
	        const { data } = yield call(deleteAllOrgs, selectedRowKeys);
	        yield put({ type: 'setState', payload: { spin: false } });
	        if (data && data.success) {
	          yield put({ type: 'loadTypes' });
	          yield put({ type: 'load' });
	        }
	     },
	},
	
	reducers: {
		"init"( state, { data, page }) {
			var { result, total, pageSize, start } = data;
			var p = { ...state.page, ...page, total : total };
			var orgs = result || [];
			return {...state, data : orgs, page : p };
		},
		"setState"( oldState, { payload } ){
			return {...oldState,...payload}
		},
	},
};
