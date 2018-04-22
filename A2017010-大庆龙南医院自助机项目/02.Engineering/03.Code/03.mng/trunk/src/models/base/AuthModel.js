import { loadRoles } from '../../services/base/RoleService';
import { loadMachinePage, } from '../../services/base/MachineService';
import { clientMenuList } from '../../services/base/MenuService';

import { loadRoleUsers, assignUser, unAssignUser } from '../../services/base/AuthService';
import { loadRoleMenus, assignMenu } from '../../services/base/AuthService';

export default {
	
	namespace: 'auth',
	
	state: {
		spin : false,
		roles : [],
		machine : {
			page : { total: 0, pageSize: 10 , pageNo: 1 },
			data : [],
			selectedRowKeys : [],
		},
		mngMenu:{
			tree:[],
			data:{},
			selectedKeys : [],
		},
		clientMenu:{
			tree:[],
			data:{},
			selectedKeys : [],
		},
		roleId : null,
	},
	
	effects: {
		*loadRoles({ payload }, { select, call, put }) {
	    	yield put({type: 'setState', payload:{spin : true}});
	    	const { data } = yield call( loadRoles,{type:'client'});
	    	yield put({type: 'setState',payload:{spin:false}});
	    	if (data && data.success) {
	    		yield put({
	    			type : 'setState',
	    			payload : {roles:data.result||[]},
	    		})
	    	}
	    },
	    *loadMachines({ payload }, { select, call, put }) {
	    	const { user, roleId } =  yield select(state => state.auth);
	    	var { page } = ( payload || {} );
	    	var newPage = { ...user.page, ...page };
	    	var { pageNo, pageSize } = newPage;
	    	var start = (pageNo-1) * pageSize;
	    	
	    	yield put({ type: 'setState', payload:{spin : true}});
	    	const { data } = yield call( loadUserPage, start, pageSize);
	    	yield put({ type: 'setState', payload:{spin: false}});
	    	
	    	if ( data && data.success ) {
	    		var { result, total, pageSize, start } = data;
				var p = { ...user.page, ...newPage, total : total };
				var newUser = {...user, data: result||[],page:p};
	    		yield put({
	    			type : 'setState',
	    			payload : { user: newUser },
	    		})
	    	}
	    	if(roleId)yield put({type : 'loadUserKeys',});
	    },
	    *loadUserKeys({ payload }, { select, call, put }) {
	    	const { user, roleId } =  yield select(state => state.auth);
	    	if(!roleId)return;
	    	
	    	yield put({ type: 'setState', payload:{spin : true}});
	    	const { data } = yield call( loadRoleUsers,roleId);
	    	yield put({ type: 'setState', payload:{spin: false}});
	    	
	    	if (data && data.success) {
	    		var selectedRowKeys = data.result||[];
				var newUser = {...user,selectedRowKeys:selectedRowKeys};
	    		yield put({
	    			type : 'setState',
	    			payload : { user: newUser },
	    		})
	    	}
	    },
	    *clearUsers({}, { select, call, put }) {
	    	const page = { total: 0, pageSize: 10 , pageNo: 1 };
	    	const user = { data:[], selectedRowKeys: [], page : page};
    		yield put({
    			type : 'setState',
    			payload : { user: user },
    		})
	    },
	    *assignUser({ userId }, { select, call, put }) {
	    	const { roleId } =  yield select(state => state.auth);
	    	if(!roleId)return;
	    	
	    	yield put({type: 'setState', payload:{spin : true}});
	    	const { data } = yield call( assignUser,roleId,userId);
	    	yield put({type: 'setState',payload:{spin:false}});
	    	if (data && data.success) {
	    		yield put({
	    			type : 'loadUsers',
	    			roleId:roleId,
	    		})
	    	}
	    },
	    *unAssignUser({ userId }, { select, call, put }) {
	    	const { roleId } =  yield select(state => state.auth);
	    	yield put({type: 'setState', payload:{spin : true}});
	    	const { data } = yield call( unAssignUser,roleId,userId);
	    	yield put({type: 'setState',payload:{spin:false}});
	    	if (data && data.success) {
	    		yield put({
	    			type : 'loadUsers',
	    			roleId:roleId,
	    		})
	    	}
	    },
	    *loadMngMenus({ payload }, { select, call, put }) {
	    	const { mngMenu, roleId } =  yield select(state => state.auth);
	    	yield put({ type: 'setState', payload:{spin : true}});
	    	const { data } = yield call( mngMenuList);
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
	    		
				var newMenu = {...mngMenu, tree : roots,data:menuMap};
	    		yield put({
	    			type : 'setState',
	    			payload : { mngMenu: newMenu },
	    		})
	    	}
	    	if(roleId)yield put({type : 'loadMenuKeys',});
	    },
	    *loadClientMenus({ payload }, { select, call, put }) {
	    	const { clientMenu, roleId } =  yield select(state => state.auth);
	    	yield put({ type: 'setState', payload:{spin : true}});
	    	const { data } = yield call( clientMenuList);
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
	    		
				var newMenu = {...clientMenu, tree : roots,data:menuMap};
	    		yield put({
	    			type : 'setState',
	    			payload : { clientMenu: newMenu },
	    		})
	    	}
	    	//if(roleId)yield put({type : 'loadMenuKeys',});
	    },
	    *loadMenuKeys({ payload }, { select, call, put }) {
	    	const { menu, roleId } =  yield select(state => state.auth);
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
	    	const { roleId, menu } =  yield select(state => state.auth);
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
