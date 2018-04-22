import { loadRoles } from '../../services/base/RoleService';
import { loadMachinePage, } from '../../services/base/MachineService';
import { clientMenuList } from '../../services/base/MenuService';

import { loadRoleMachines, assignMachine, unAssignMachine } from '../../services/base/AuthService';
import { loadRoleMenus, assignMenu } from '../../services/base/AuthService';
export default {
	
	namespace: 'clientAuth',
	
	state: {
		spin : false,
		roles : [],
		machine : {
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
	    	const { machine, roleId } =  yield select(state => state.clientAuth);
	    	var { page } = ( payload || {} );
	    	var newPage = { ...machine.page, ...page };
	    	var { pageNo, pageSize } = newPage;
	    	var start = (pageNo-1) * pageSize;
	    	
	    	yield put({ type: 'setState', payload:{spin : true}});
	    	const { data } = yield call( loadMachinePage, start, pageSize);
	    	yield put({ type: 'setState', payload:{spin: false}});
	    	
	    	if ( data && data.success ) {
	    		var { result, total, pageSize, start } = data;
				var p = { ...machine.page, ...newPage, total : total };
				var newMachine = {...machine, data: result||[],page:p};
	    		yield put({
	    			type : 'setState',
	    			payload : { machine: newMachine },
	    		})
	    	}
	    	if(roleId)yield put({type : 'loadMachineKeys',});
	    },
	    *loadMachineKeys({ payload }, { select, call, put }) {
	    	const { machine, roleId } =  yield select(state => state.clientAuth);
	    	if(!roleId)return;
	    	
	    	yield put({ type: 'setState', payload:{spin : true}});
	    	const { data } = yield call( loadRoleMachines,roleId);
	    	yield put({ type: 'setState', payload:{spin: false}});
	    	
	    	if (data && data.success) {
	    		var selectedRowKeys = data.result||[];
				var newMachine = {...machine,selectedRowKeys:selectedRowKeys};
	    		yield put({
	    			type : 'setState',
	    			payload : { machine: newMachine },
	    		})
	    	}
	    },
	    *clearMachines({}, { select, call, put }) {
	    	const page = { total: 0, pageSize: 10 , pageNo: 1 };
	    	const maichne = { data:[], selectedRowKeys: [], page : page};
    		yield put({
    			type : 'setState',
    			payload : { maichne: maichne },
    		})
	    },
	    *assignMachine({ machineId }, { select, call, put }) {
	    	const { roleId } =  yield select(state => state.clientAuth);
	    	if(!roleId)return;
	    	
	    	yield put({type: 'setState', payload:{spin : true}});
	    	const { data } = yield call( assignMachine,roleId,machineId);
	    	yield put({type: 'setState',payload:{spin:false}});
	    	if (data && data.success) {
	    		yield put({
	    			type : 'loadMachines',
	    			roleId:roleId,
	    		})
	    	}
	    },
	    *unAssignMachine({ machineId }, { select, call, put }) {
	    	const { roleId } =  yield select(state => state.clientAuth);
	    	yield put({type: 'setState', payload:{spin : true}});
	    	const { data } = yield call( unAssignMachine,roleId,machineId);
	    	yield put({type: 'setState',payload:{spin:false}});
	    	if (data && data.success) {
	    		yield put({
	    			type : 'loadMachines',
	    			roleId:roleId,
	    		})
	    	}
	    },
	    *loadMenus({ payload }, { select, call, put }) {
	    	const { menu, roleId } =  yield select(state => state.clientAuth);
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
	    			if(parent)parent.children.push(m);
	    			else roots.push(m);
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
	    	const { menu, roleId } =  yield select(state => state.clientAuth);
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
	    	const { roleId, menu } =  yield select(state => state.clientAuth);
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
