import ajax from '../../utils/ajax';

import { apiRoot } from '../../utils/config';

export async function loadInfo() {
  return ajax.GET(`${apiRoot.register}/list`);
}

export async function loadInfoPage(start, limit, query) {
  return ajax.GET(`${apiRoot.regVisitTemp}/page/${start}/${limit}`, query || {});
}

export async function getTotalFee(regLevel) {
  return ajax.GET(`${apiRoot.register}/get/getTotalFee/${regLevel}`);
}

export async function loadRegInfoPage(tabType, start, limit, query) {
  return ajax.GET(`${apiRoot.register}/page/${tabType}/${start}/${limit}`, query || {});
}

export async function saveInfo(data) {
  return data.id
    ? ajax.POST(`${apiRoot.register}/update`, data)
    : ajax.POST(`${apiRoot.register}/create`, data);
}
