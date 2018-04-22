

import ajax from '../../utils/ajax';
const _API_ROOT = "/api/ssm/base/user/";

export async function loadUsers() {
  return ajax.GET( _API_ROOT + 'list' );
}
export async function loadUserPage(start, limit, query) {
	return ajax.GET( _API_ROOT + 'page/' + start + '/' + limit, query || {} );
}
export async function saveUser(data) {
	if(data.id)return ajax.POST( _API_ROOT + 'update', data );
	return ajax.POST( _API_ROOT + 'create', data );
}
export async function enableUser(id) {
	  return ajax.PUT( _API_ROOT + 'enable/' + id );
}
export async function disableUser(id) {
	  return ajax.PUT( _API_ROOT + 'disable/' + id );
}
export async function enableAllUsers(ids) {
	  return ajax.PUT( _API_ROOT + 'enableAll', ids );
}
export async function disableAllUsers(ids) {
	  return ajax.PUT( _API_ROOT + 'disableAll', ids );
}