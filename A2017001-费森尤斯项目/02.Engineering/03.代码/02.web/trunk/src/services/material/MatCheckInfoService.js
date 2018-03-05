import ajax from '../../utils/ajax';

import { apiRoot } from '../../utils/config';

export async function loadAdjust() {
  return ajax.GET(`${apiRoot.matCheckInfo}list`);
}

export async function loadCheckPage(start, limit, query) {
  return ajax.GET(`${apiRoot.matCheckInfo}page/check/${start}/${limit}`, query || {});
}

export async function loadCheckInfoPage(start, limit, query) {
  return ajax.GET(`${apiRoot.matCheckInfo}page/record/${start}/${limit}`, query || {});
}

export async function loadCheckInfoDetailPage(start, limit, query) {
  return ajax.GET(`${apiRoot.matCheckInfo}page/detail/${start}/${limit}`, query || {});
}

export async function loadCheckInfoBillPage(start, limit, query) {
  return ajax.GET(`${apiRoot.matCheckInfo}page/${start}/${limit}`, query || {});
}

export async function updateCheckInfo(data) {
  return ajax.POST(`${apiRoot.matCheckInfo}update`, data);
}
export async function finishCheck(data) {
  return ajax.POST(`${apiRoot.matCheckInfo}finish`, data);
}
export async function addCheckInfo(bill) {
  return ajax.GET(`${apiRoot.matCheckInfo}create/${bill}`);
}

export async function deleteCheck() {
  return ajax.POST(`${apiRoot.matCheckInfo}removeCheck`);
}
export async function getBill() {
  return ajax.GET(`${apiRoot.matCheckInfo}getBill`);
}
