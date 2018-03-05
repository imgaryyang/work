import ajax from '../../utils/ajax';
import { apiRoot } from '../../utils/config';

export async function saveRegInfo(data) {
  return data.id
    ? ajax.POST(`${apiRoot.register}/update`, data)
    : ajax.POST(`${apiRoot.register}/create`, data);
}

export async function deleteRegInfo(id) {
  return ajax.DELETE(`${apiRoot.register}/remove/${id}`);
}

export async function deleteAllRegInfos(ids) {
  return ajax.DELETE(`${apiRoot.register}/removeAll`, ids);
}

export async function updateRegInfo(id) {
  return ajax.POST(`${apiRoot.register}/update/${id}`);
}

export async function loadRegInfo() {
  return ajax.GET(`${apiRoot.register}/list`);
}

export async function loadRegInfoPage(start, limit, query) {
  return ajax.GET(`${apiRoot.register}/page/${start}/${limit}`, query || {});
}

export async function getPatientRegInfo(regId) {
  return ajax.GET(`${apiRoot.register}/getPatientRegInfo/${regId}`);
}

export async function getCancelInfo(id) {
  return ajax.GET(`${apiRoot.register}/get/getCancelInfo/${id}`);
}
