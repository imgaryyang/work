import ajax from '../../utils/ajax';

import { apiRoot } from '../../utils/config';

export async function loadAdjust() {
  return ajax.GET(`${apiRoot.instrmCheckInfo}list`);
}

export async function loadCheckPage(start, limit, query) {
  return ajax.GET(`${apiRoot.instrmCheckInfo}page/check/${start}/${limit}`, query || {});
}

export async function loadCheckInfoPage(start, limit, query) {
  return ajax.GET(`${apiRoot.instrmCheckInfo}page/record/${start}/${limit}`, query || {});
}

export async function updateCheckInfo(data) {
  return ajax.POST(`${apiRoot.instrmCheckInfo}update`, data);
}
export async function finishCheck(data) {
  return ajax.POST(`${apiRoot.instrmCheckInfo}finish`, data);
}
export async function addCheckInfo(bill) {
  return ajax.GET(`${apiRoot.instrmCheckInfo}create/${bill}`);
}
export async function createCheckInfo(bill, instrmCode) {
  return ajax.GET(`${apiRoot.instrmCheckInfo}createCheckInfo/${bill}/${instrmCode}`);
}

export async function deleteCheck() {
  return ajax.POST(`${apiRoot.instrmCheckInfo}removeCheck`);
}
export async function getBill() {
  return ajax.GET(`${apiRoot.instrmCheckInfo}getBill`);
}
