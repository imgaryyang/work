import ajax from '../../utils/ajax';
import { apiRoot } from '../../utils/config';

export async function loadPatients() {
  return ajax.GET(`${apiRoot.patient}list`);
}

export async function getPatient(id) {
  return ajax.GET(`${apiRoot.patient}info/${id}`);
}

export async function loadPatientPage(start, limit, query) {
  return ajax.GET(`${apiRoot.patient}page/${start}/${limit}`, query || {});
}

export async function savePatient(data) {
  return data.id ? ajax.POST(`${apiRoot.patient}update`, data) : ajax.POST(`${apiRoot.patient}create`, data);
}

export async function deletePatient(id) {
  return ajax.DELETE(`${apiRoot.patient}remove/${id}`);
}

export async function deleteAllPatients(ids) {
  return ajax.DELETE(`${apiRoot.patient}removeAll/`, ids);
}
