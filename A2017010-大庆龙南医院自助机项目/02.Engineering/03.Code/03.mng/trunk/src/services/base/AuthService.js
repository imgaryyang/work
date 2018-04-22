

import ajax from '../../utils/ajax';
const _API_ROOT = "/api/ssm/base/auth";
/*****************user***************/
export async function loadRoleUsers(roleId) {
	return ajax.GET(_API_ROOT+'/user/list/'+roleId);
}
export async function assignUser(roleId,userId) {
	return ajax.PUT(_API_ROOT+'/user/assign/'+roleId+"/"+userId);
}
export async function unAssignUser(roleId,userId) {
	return ajax.PUT(_API_ROOT+'/user/unassign/'+roleId+"/"+userId);
}

/*****************machine***************/
export async function loadRoleMachines(roleId) {
	return ajax.GET(_API_ROOT+'/machine/list/'+roleId);
}
export async function assignMachine(roleId,machineId) {
	return ajax.PUT(_API_ROOT+'/machine/assign/'+roleId+"/"+machineId);
}
export async function unAssignMachine(roleId,machineId) {
	return ajax.PUT(_API_ROOT+'/machine/unassign/'+roleId+"/"+machineId);
}
/*****************OPERATOR***************/
export async function loadRoleOperators(roleId) {
	return ajax.GET(_API_ROOT+'/operator/list/'+roleId);
}
export async function assignOperator(roleId,OperatorId) {
	return ajax.PUT(_API_ROOT+'/operator/assign/'+roleId+"/"+OperatorId);
}
export async function unAssignOperator(roleId,OperatorId) {
	return ajax.PUT(_API_ROOT+'/operator/unassign/'+roleId+"/"+OperatorId);
}

/*****************menu******************/
export async function loadRoleMenus(roleId) {
	return ajax.GET(_API_ROOT+'/menu/list/'+roleId);
}
export async function assignMenu(roleId,menuIds) {
	return ajax.PUT(_API_ROOT+'/menu/assign/'+roleId+"/",menuIds);
}
/*export async function unAssignMenu(roleId,userId) {
	return ajax.GET(_API_ROOT+'/menu/unassign/'+roleId+"/"+menuId);
}*/
