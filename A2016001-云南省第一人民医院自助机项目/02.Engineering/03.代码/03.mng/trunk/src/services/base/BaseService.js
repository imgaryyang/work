import ajax from '../../utils/ajax';
const _API_ROOT = "/api/ssm/base/";

export async function userLogin(user) {
  return ajax.POST(_API_ROOT+'auth/login',user);
}
export async function userLogout(user) {
	return ajax.GET(_API_ROOT+'auth/logout',user);
}
export async function userInfo(user) {
	return ajax.GET(_API_ROOT+'auth/userInfo',user);
}
export async function myMenus() {
	  return ajax.GET(_API_ROOT+'menu/mng/mylist');
}
export async function changePwd(account) {
	return ajax.PUT( _API_ROOT + 'account/changePwd',account);
}