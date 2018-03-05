

import ajax from '../../utils/ajax';
const _API_ROOT = "/api/hcp/base/";

export async function userLogin(user) {
  return ajax.POST(_API_ROOT+'auth/login',user);
}
export async function userLogout(user) {
	return ajax.GET(_API_ROOT+'auth/logout',user);
}
export async function userInfo(user) {
	return ajax.GET(_API_ROOT+'auth/userInfo',user);
}
export async function mySystems() {
	  return ajax.GET(_API_ROOT+'system/mylist');
}
export async function myMenus() {
	  return ajax.GET(_API_ROOT+'menu/mylist');
}
export async function mySystemMenus(system) {console.info('mySystemMenus ',system);
	  return ajax.GET(_API_ROOT+'menu/mylist/'+system.code);
}
export async function chooseLoginDept(id) {
    return ajax.PUT(_API_ROOT+'auth/chooseLoginDept/' + id);
}
