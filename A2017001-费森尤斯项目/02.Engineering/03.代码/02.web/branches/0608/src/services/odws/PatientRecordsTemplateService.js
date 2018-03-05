
import ajax from '../../utils/ajax';

const apiRoot = '/api/hcp/odws/patientRecordsTemplate/';

export async function loadPatientRecordsTemplate() {
  return ajax.GET(`${apiRoot}list`);
}
export async function loadMyPatientRecordsTemplate() {
  return ajax.GET(`${apiRoot}mylist`);
}
export async function loadPatientRecordsTemplatePage(start, limit, query) {
  return ajax.GET(`${apiRoot}get/${start}/${limit}`, query || {});
}

export async function savePatientRecordsTemplate(data) {
  return ajax.POST(`${apiRoot}create`, data);
}

export async function deletePatientRecordsTemplate(id) {
  return ajax.DELETE(`${apiRoot}remove/${id}`);
}

export async function deleteAll(ids) {
  return ajax.DELETE(`${apiRoot}removeAll/`, ids);
}
