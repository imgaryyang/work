import ajax from '../../utils/ajax';

const apiRoot = '/api/hcp/base/hospital/';

export async function loadTypes() {
  return ajax.GET(`${apiRoot}type/list`);
}

export async function loadHospital() {
  return ajax.GET(`${apiRoot}list`);
}
export async function loadHospitalPage(start, limit, query) {
  return ajax.GET(`${apiRoot}page/${start}/${limit}`, query || {});
}
export async function saveHospital(data) {
  if (data.id) return ajax.POST(`${apiRoot}update`, data);
  else return ajax.POST(`${apiRoot}create`, data);
}
export async function deleteHospital(id) {
  return ajax.DELETE(`${apiRoot}remove/${id}`);
}
export async function deleteAllHospitals(ids) {
  return ajax.DELETE(`${apiRoot}removeAll/`, ids);
}
export async function editHospital() {
	console.info('tiger 3 ');
	  return ajax.GET(`${apiRoot}listEdit`);
}
