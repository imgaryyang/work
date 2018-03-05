import ajax from '../../utils/ajax';

import { apiRoot } from '../../utils/config';

export async function loadInfo() {
  return ajax.GET(`${apiRoot.regVisit}/list`);
}

export async function loadDictByType() {
  return ajax.GET(`${apiRoot.regVisitTemp}/get/deptType`);
}

export async function loadInfoPage(start, limit, query) {
  return ajax.GET(`${apiRoot.regVisit}/page/${start}/${limit}`, query || {});
}

export async function saveInfo(data) {
  return data.id
    ? ajax.POST(`${apiRoot.regVisit}/update`, data)
    : ajax.POST(`${apiRoot.regVisit}/create`, data);
}

export async function deleteInfo(id) {
  return ajax.DELETE(`${apiRoot.regVisit}/remove/${id}`);
}

export async function deleteAllInfos(ids) {
  return ajax.DELETE(`${apiRoot.regVisit}/removeAll`, ids);
}
