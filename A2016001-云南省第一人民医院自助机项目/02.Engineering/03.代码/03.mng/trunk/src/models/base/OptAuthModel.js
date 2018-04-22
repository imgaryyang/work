import { loadRoles } from '../../services/base/RoleService';
import { loadOperatorPage, } from '../../services/base/OperatorService';
import { operatorMenuList } from '../../services/base/MenuService';

import { loadRoleOperators, assignOperator, unAssignOperator } from '../../services/base/AuthService';
import { loadRoleMenus, assignMenu } from '../../services/base/AuthService';
export default {
	
	namespace: 'operatorAuth',
	
	state: {
		spin : false,
		roles : [],
		operator : {
			page : { total: 0, pageSize: 10 , pageNo: 1 },
			data : [],
			selectedRowKeys : [],
		},
		menu:{
			tree:[],
			data:{},
			selectedKeys : [],
		},
		roleId : null,
	},
	
	effects: {
		*loadRoles({ payload }, { select, call, put }) {
	    	yield put({type: 'setState', payload:{spin : true}});
	    	const { data } = yield call( loadRoles,{type:'operator'});
	    	yield put({type: 'setState',payload:{spin:false}});
	    	if (data && data.success) {
	    		yield put({
	    			type : 'setState',
	    			payload : {roles:data.result||[]},
	    		})
	    	}
	    },
	    *loadOperators({ payload }, { select, call, put }) {
	    	const { operator, roleId } =  yield select(state => state.operatorAuth);
	    	var { page } = ( payload || {} );
	    	var newPage = { ...operator.page, ...page };
	    	var { pageNo, pageSize } = newPage;
	    	var start = (pageNo-1) * pageSize;
	    	
	    	yield put({ type: 'setState', payload:{spin : true}});
	    	const { data } = yield call( loadOperatorPage, start, pageSize);
	    	yield put({ type: 'setState', payload:{spin: false}});
	    	
	    	if ( data && data.success ) {
	    		var { result, total, pageSize, start } = data;
				var p = { ...operator.page, ...newPage, total : total };
				var newOperator = {...operator, data: result||[],page:p};
	    		yield put({
	    			type : 'setState',
	    			payload : { operator: newOperator },
	    		})
	    	}
	    	if(roleId)yield put({type : 'loadOperatorKeys',});
	    },
	    *loadOperatorKeys({ payload }, { select, call, put }) {
	    	const { operator, roleId } =  yield select(state => state.operatorAuth);
	    	if(!roleId)return;
	    	
	    	yield put({ type: 'setState', payload:{spin : true}});
	    	const { data } = yield call( loadRoleOperators,roleId);
	    	yield put({ type: 'setState', payload:{spin: false}});
	    	
	    	if (data && data.success) {
	    		var selectedRowKeys = data.result||[];
				var newOperator = {...operator,selectedRowKeys:selectedRowKeys};
	    		yield put({
	    			type : 'setState',
	    			payload : { operator: newOperator },
	    		})
	    	}
	    },
	    *clearOperators({}, { select, call, put }) {
	    	const page = { total: 0, pageSize: 10 , pageNo: 1 };
	    	const maichne = { data:[], selectedRowKeys: [], page : page};
    		yield put({
    			type : 'setState',
    			payload : { maichne: maichne },
    		})
	    },
	    *assignOperator({ operatorId }, { select, call, put }) {
	    	const { roleId } =  yield select(state => state.operatorAuth);
	    	if(!roleId)return;
	    	
	    	yield put({type: 'setState', payload:{spin : true}});
	    	const { data } = yield call( assignOperator,roleId,operatorId);
	    	yield put({type: 'setState',payload:{spin:false}});
	    	if (data && data.success) {
	    		yield put({
	    			type : 'loadOperators',
	    			roleId:roleId,
	    		})
	    	}
	    },
	    *unAssignOperator({ operatorId }, { select, call, put }) {
	    	const { roleId } =  yield select(state => state.operatorAuth);
	    	yield put({type: 'setState', payload:{spin : true}});
	    	const { data } = yield call( unAssignOperator,roleId,operatorId);
	    	yield put({type: 'setState',payload:{spin:false}});
	    	if (data && data.success) {
	    		yield put({
	    			type : 'loadOperators',
	    			roleId:roleId,
	    		})
	    	}
	    },
	    *loadMenus({ payload }, { select, call, put }) {
	    	const { menu, roleId } =  yield select(state => state.operatorAuth);
	    	yield put({ type: 'setState', payload:{spin : true}});
	    	const { data } = yield call( operatorMenuList);
	    	yield put({ type: 'setState', payload:{spin: false}});
	    	 
	    	if (data && data.success) {
	    		var menus = data.result||[];
	    		var menuMap={},roots=[];
	    		for(var m of menus){
	    			menuMap[m.id] = m;
	    			m.children=[];
	    			if(!m.parent)roots.push(m);
	    		}
	    		for(var m of menus){
	    			if(!m.parent)continue;
	    			var parent = menuMap[m.parent];
	    			parent.children.push(m);
	    		}
	    		
				var newMenu = {...menu, tree : roots,data:menuMap};
	    		yield put({
	    			type : 'setState',
	    			payload : {menu: newMenu },
	    		})
	    	}
	    	if(roleId)yield put({type : 'loadMenuKeys',});
	    },
	    *loadMenuKeys({ payload }, { select, call, put }) {
	    	const { menu, roleId } =  yield select(state => state.operatorAuth);
	    	if(!roleId)return;
	    	yield put({ type: 'setState', payload:{spin : true}});
	    	const { data } = yield call( loadRoleMenus,roleId);
	    	yield put({ type: 'setState', payload:{spin: false}});
	    	
	    	if (data && data.success) {
	    		var selectedKeys = data.result||[];
				var newMenu = {...menu,selectedKeys:selectedKeys};
	    		yield put({
	    			type : 'setState',
	    			payload : { menu: newMenu },
	    		})
	    	}
	    },
	    *clearMenu({}, { select, call, put }) {
	    	const page = { total: 0, pageSize: 10 , pageNo: 1 };
	    	const menu = { data:[], selectedKeys: [] };
    		yield put({
    			type : 'setState',
    			payload : { menu: menu },
    		})
	    },
	    *assignMenu({ menus }, { select, call, put }) {
	    	const { roleId, menu } =  yield select(state => state.operatorAuth);
	    	if(!roleId)return;
	    	
	    	yield put({type: 'setState', payload:{spin : true}});
	    	const { data } = yield call( assignMenu,roleId,menu.selectedKeys||[]);
	    	yield put({type: 'setState',payload:{spin:false}});
	    	if (data && data.success) {
	    		yield put({
	    			type : 'loadMenus',
	    			roleId:roleId,
	    		})
	    	}
	    },
	},
	
	reducers: {
		"setState"( oldState, { payload } ){
			return {...oldState,...payload}
		},
		
	},
};
