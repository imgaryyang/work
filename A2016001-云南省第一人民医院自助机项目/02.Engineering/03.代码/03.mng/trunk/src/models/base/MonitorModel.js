import dva from 'dva';
import { loadMonitorList, loadMonitorMyList} from '../../services/base/MonitorService';
export default {
	
	namespace: 'monitor',
	
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
	    	var defaultPage = yield select(state => state.monitor.page);
	    	var newPage = { ...defaultPage, ...page };
	    	var { pageNo, pageSize } = newPage;
	    	var start = (pageNo-1) * pageSize;
	    	yield put({
	    		type: 'setState', 
	    		payload:{spin : true}
	    	});
	    	const { data } = yield call( loadMonitorList, start, pageSize, query);
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
	},
	
	reducers: {
		"init"( state, { data, page }) {
			var { result, total, pageSize, start } = data;
			var p = { ...state.page, ...page, total : total };
			var monitors = result || [];
			return {...state, data : monitors, page : p };
		},
		"setState"( oldState, { payload } ){
			return {...oldState,...payload}
		},
	},
};
