

import ajax from '../../utils/ajax';
const _API_ROOT = "/api/ssm/base/machine";

export async function loadMyMachines() {
  return ajax.GET(_API_ROOT+'/mylist');
}
export async function loadMachinePage(start,limit,query) {
	return ajax.GET(_API_ROOT+'/page/'+start+'/'+limit,query||{});
}
export async function saveMachine(data) {
	  if(data.id)return ajax.POST(_API_ROOT+'/update',data);
	  else return ajax.POST(_API_ROOT+'/create',data);
}
export async function deleteMachine(id) {
	  return ajax.DELETE(_API_ROOT+'/remove/'+id);
}
export async function deleteAllMachines(ids) {
	  return ajax.DELETE(_API_ROOT+'/removeAll/',ids);
}
