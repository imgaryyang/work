import dva from 'dva';
import { loadMenus } from '../services/MenuService';
export default {
	namespace: 'home',
	state: {
		menus:[]
	},
	subscriptions: {
	},
	effects: {
	    *load({ payload }, { select, call, put }) {
	    	const {data} = yield call(loadMenus);
	    	if (data && data.success ) {yield put({
    			type: 'init',
    			payload:data.result,
	        })}
	    },
	    *create(){},
	    *'delete'(){},
	    *update(){}
	},
	reducers: {
		"init"(state,{payload}){
			return {...state,menus:payload};
		},
	},
};