import ajax from '../../utils/ajax';

import { apiRoot } from '../../utils/config';

export async function loadPatientStorePage(start, limit, query) {
  return ajax.GET(`${apiRoot.patientStoreExecl}/page/${start}/${limit}`, query || {});
}

export async function loadDetailPage(start, limit, query) {
  return ajax.GET(`${apiRoot.patientStoreExecl}/detailPage/${start}/${limit}`, query || {});
}

export async function findItemDetailByItemId(query) {
  return ajax.GET(`${apiRoot.patientStoreExecl}/findItemDetailByItemId`, query || {});
}
export async function findMaterialInfoByItemId(query) {
  return ajax.GET(`${apiRoot.patientStoreExecl}/findMaterialInfoByItemId`, query || {});
}

export async function findRecordDetailByExecNo(query) {
  return ajax.GET(`${apiRoot.patientStoreExecl}/findRecordDetailByExecNo`, query || {});
}

export async function savePatientStore(data) {
  return ajax.POST(`${apiRoot.patientStoreExecl}/create`, data);
}

export async function saveDetail(data) {
  return ajax.POST(`${apiRoot.patientStoreExecl}/saveDetail`, data);
}

export async function deletePatientStore(data) {
  return ajax.POST(`${apiRoot.patientStoreExecl}/remove`, data);
}

export async function deleteAllPatientStore(ids) {
  return ajax.DELETE(`${apiRoot.patientStoreExecl}/removeAll`, ids);
}
