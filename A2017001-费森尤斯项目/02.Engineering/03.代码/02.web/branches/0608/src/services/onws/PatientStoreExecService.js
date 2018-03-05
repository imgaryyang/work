import ajax from '../../utils/ajax';

import { apiRoot } from '../../utils/config';

export async function loadPatientStorePage(start, limit, query) {
  return ajax.GET(`${apiRoot.patientStoreExecl}/page/${start}/${limit}`, query || {});
}

export async function loadDetailPage(start, limit, query) {
  return ajax.GET(`${apiRoot.patientStoreExecl}/detailPage/${start}/${limit}`, query || {});
}

export async function savePatientStore(data) {
  return ajax.POST(`${apiRoot.patientStoreExecl}/create`, data);
}

export async function deletePatientStore(id) {
  return ajax.DELETE(`${apiRoot.patientStoreExecl}/remove/${id}`);
}

export async function deleteAllPatientStore(ids) {
  return ajax.DELETE(`${apiRoot.patientStoreExecl}/removeAll`, ids);
}
