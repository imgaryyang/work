

import ajax from '../../utils/ajax';
const _API_ROOT = "/api/hcp/base/role";

export async function loadMyRoles() {
  return ajax.GET(_API_ROOT+'/mylist');
}
export async function loadMyRolePage(start,limit,query) {
  return ajax.GET(_API_ROOT+'/myPage/'+start+'/'+limit,query||{});
}
export async function saveRole(data) {
    if(data.id)return ajax.POST(_API_ROOT+'/update',data);
    else return ajax.POST(_API_ROOT+'/create',data);
}
export async function deleteRole(id) {
    return ajax.DELETE(_API_ROOT+'/remove/'+id);
}
export async function deleteAllRoles(ids) {
    return ajax.DELETE(_API_ROOT+'/removeAll/',ids);
}
