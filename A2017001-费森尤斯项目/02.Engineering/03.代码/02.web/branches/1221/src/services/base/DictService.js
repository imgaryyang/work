

import ajax from '../../utils/ajax';
const _API_ROOT = "/api/hcp/base/dictionary/";

export async function loadDicts() {
  return ajax.GET(_API_ROOT+'list');
}
export async function loadDictPage(start,limit,query) {
	return ajax.GET(_API_ROOT+'page/'+start+'/'+limit,query||{});
}
export async function saveDict(data) {
	  if(data.id)return ajax.POST(_API_ROOT+'update',data);
	  else return ajax.POST(_API_ROOT+'create',data);
}
export async function deleteDict(id) {
	  return ajax.DELETE(_API_ROOT+'remove/'+id);
}
export async function deleteAllDicts(ids) {
	  return ajax.DELETE(_API_ROOT+'removeAll/',ids);
}
