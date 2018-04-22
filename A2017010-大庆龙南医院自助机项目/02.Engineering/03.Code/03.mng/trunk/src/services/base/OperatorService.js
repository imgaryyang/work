

import ajax from '../../utils/ajax';
const _API_ROOT = "/api/ssm/base/operator";

export async function loadMyOperators() {
  return ajax.GET(_API_ROOT+'/mylist');
}
export async function loadOperatorPage(start,limit,query) {
	return ajax.GET(_API_ROOT+'/page/'+start+'/'+limit,query||{});
}
export async function saveOperator(data) {
	  if(data.id)return ajax.POST(_API_ROOT+'/update',data);
	  else return ajax.POST(_API_ROOT+'/create',data);
}
export async function deleteOperator(id) {
	  return ajax.DELETE(_API_ROOT+'/remove/'+id);
}
export async function deleteAllOperators(ids) {
	  return ajax.DELETE(_API_ROOT+'/removeAll/',ids);
}
