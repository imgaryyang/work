

import ajax from '../../utils/ajax';
const _API_ROOT = "/api/ssm/base/org";

export async function loadMyOrgs() {
  return ajax.GET(_API_ROOT+'/mylist');
}
export async function loadOrgPage(start,limit,query) {
	return ajax.GET(_API_ROOT+'/page/'+start+'/'+limit,query||{});
}
export async function loadOrgs() {
	return ajax.GET(_API_ROOT+'/list');
}
export async function saveOrg(data) {
	  if(data.id)return ajax.POST(_API_ROOT+'/update',data);
	  else return ajax.POST(_API_ROOT+'/create',data);
}
export async function deleteOrg(id) {
	  return ajax.DELETE(_API_ROOT+'/remove/'+id);
}
export async function deleteAllOrgs(ids) {
	  return ajax.DELETE(_API_ROOT+'/removeAll/',ids);
}
