

import ajax from '../../utils/ajax';
const _API_ROOT = "/api/hcp/base/auth";

export async function loadRoleUsers(roleId) {
	return ajax.GET(_API_ROOT+'/user/list/'+roleId);
}
export async function assignUser(roleId,userId) {
	return ajax.PUT(_API_ROOT+'/user/assign/'+roleId+"/"+userId);
}
export async function unAssignUser(roleId,userId) {
	return ajax.PUT(_API_ROOT+'/user/unassign/'+roleId+"/"+userId);
}


export async function loadRoleMenus(roleId) {
	return ajax.GET(_API_ROOT+'/menu/list/'+roleId);
}
export async function assignMenu(roleId,menuIds) {
	return ajax.PUT(_API_ROOT+'/menu/assign/'+roleId+"/",menuIds);
}
/*export async function unAssignMenu(roleId,userId) {
	return ajax.GET(_API_ROOT+'/menu/unassign/'+roleId+"/"+menuId);
}*/
