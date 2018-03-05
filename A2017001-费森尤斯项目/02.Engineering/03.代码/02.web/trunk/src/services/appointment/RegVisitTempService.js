import ajax from '../../utils/ajax';

import { apiRoot } from '../../utils/config';

export async function loadInfo() {
  return ajax.GET(`${apiRoot.regVisitTemp}/list`);
}

export async function loadDictByType() {
  return ajax.GET(`${apiRoot.regVisitTemp}/get/deptType`);
}

export async function loadInfoPage(start, limit, query) {
  return ajax.GET(`${apiRoot.regVisitTemp}/page/${start}/${limit}`, query || {});
}

export async function saveInfo(data) {
  return data.id
    ? ajax.POST(`${apiRoot.regVisitTemp}/update`, data)
    : ajax.POST(`${apiRoot.regVisitTemp}/create`, data);
}

export async function deleteInfo(id) {
  return ajax.DELETE(`${apiRoot.regVisitTemp}/remove/${id}`);
}

export async function deleteAllInfos(ids) {
  return ajax.DELETE(`${apiRoot.regVisitTemp}/removeAll`, ids);
}

export async function verifyInfo(regLevel) {
  return ajax.GET(`${apiRoot.regVisitTemp}/verify/${regLevel}`);
}