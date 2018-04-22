import dva from 'dva';
import { loadLoggerPage } from '../../services/base/LoggerService';
export default {
	
	namespace: 'logger',
	
	state: {
		info : {},
		page : { total: 0, pageSize: 10 , pageNo: 1 },
		data: [],
		loggers: [],
		logger: {},
		selectedRowKeys : [],
		record: null,
		spin: false,
		visible: false,
		showSpin: false
	},
	effects: {
		*load({ payload }, { select, call, put }) {
	    	var { page, query } = ( payload || {} );
	    	var defaultPage = yield select(state => state.logger.page);
	    	var newPage = { ...defaultPage, ...page };
	    	var { pageNo, pageSize } = newPage;
	    	var start = (pageNo-1) * pageSize;
	    	yield put({
	    		type: 'setState', 
	    		payload:{spin : true}
	    	});
	    	const { data } = yield call( loadLoggerPage, start, pageSize, query);
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
			var loggers = result || [];
			return {...state, data : loggers, page : p };
		},
		"setState"( oldState, { payload } ){
			return {...oldState,...payload}
		},
	},
};
