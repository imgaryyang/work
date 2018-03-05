

import ajax from '../../utils/ajax';
const _API_ROOT = "/api/hcp/base/resource";

export async function loadMyResources() {
  return ajax.GET(_API_ROOT+'/myList');
}
export async function loadMyResourcePage(start,limit,query) {
	return ajax.GET(_API_ROOT+'/myPage/'+start+'/'+limit,query||{});
}
export async function saveResource(data) {
	  if(data.id)return ajax.POST(_API_ROOT+'/update',data);
	  else return ajax.POST(_API_ROOT+'/create',data);
}
export async function deleteResource(id) {
	  return ajax.DELETE(_API_ROOT+'/remove/'+id);
}
export async function deleteAllResources(ids) {
	  return ajax.DELETE(_API_ROOT+'/removeAll/',ids);
}
