

import ajax from '../../utils/ajax';
const _API_ROOT = "/api/ssm/base/area";

export async function loadAllAreas() {
  return ajax.GET(_API_ROOT+'/list');
}
export async function loadAreaPage(start,limit,query) {
	return ajax.GET(_API_ROOT+'/page/'+start+'/'+limit,query||{});
}
export async function saveArea(data) {
	  return ajax.POST(_API_ROOT+'/create',data);
}
export async function deleteArea(id) {
	  return ajax.DELETE(_API_ROOT+'/remove/'+id);
}
export async function deleteAllAreas(ids) {
	  return ajax.DELETE(_API_ROOT+'/removeAll/',ids);
}
