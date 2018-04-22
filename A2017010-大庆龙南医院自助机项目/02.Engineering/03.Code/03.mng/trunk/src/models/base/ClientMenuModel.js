import dva from 'dva';
import { 
	clientMenuPage,
	clientMenuList,
	deleteMenu,
	deleteAllMenu,
	saveMenu,
} from '../../services/base/MenuService';
export default {
	
	namespace: 'clientMenu',
	
	state: {
		page : { total: 0, pageSize: 10 , pageNo: 1 },
		data: [],
		record:null,
		selectedRowKeys:[],
		spin: false
	},
	
	effects: {
		/**
		 * 获取所有用户信息
		 */
		*load({ payload }, { select, call, put }) {
	    	var { page, query } = ( payload || {} );
	    	var defaultPage = yield select(state => state.clientMenu.page);
	    	var newPage = { ...defaultPage, ...page };
	    	var { pageNo, pageSize } = newPage;
	    	var start = (pageNo-1) * pageSize;
	    	yield put({
	    		type: 'setState', 
	    		payload:{spin : true}
	    	});
	    	const { data } = yield call( clientMenuPage, start, pageSize, query);
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
	    /**
	     * 新增用户
	     */
	    *save({ params }, { select, call, put }) {
		    console.info('save',arguments);
	    	yield put({
	    		type: 'setState',
	    		payload:{spin : true}
	    	});
	    	const {data} = yield call( saveMenu, params );
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
	},
	
	reducers: {
		
		"init"( state, { data, page }) {
			var { result, total, pageSize, start } = data;
			var p = { ...state.page, ...page, total : total };
			var users = result || [];
			return {...state, data : users, page : p };
		},
		
		"setState"( oldState, { payload } ){
			return {...oldState,...payload}
		},
		
	},
};
