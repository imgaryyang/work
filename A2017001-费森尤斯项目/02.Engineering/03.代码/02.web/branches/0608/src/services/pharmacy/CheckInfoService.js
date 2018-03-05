import ajax from '../../utils/ajax';

import { apiRoot } from '../../utils/config';

export async function loadAdjust() {
  return ajax.GET(`${apiRoot.checkInfo}list`);
}

export async function loadCheckPage(start, limit, query) {
  return ajax.GET(`${apiRoot.checkInfo}page/check/${start}/${limit}`, query || {});
}

export async function loadCheckInfoPage(start, limit, query) {
  return ajax.GET(`${apiRoot.checkInfo}page/record/${start}/${limit}`, query || {});
}

export async function updateCheckInfo(data) {
  return ajax.POST(`${apiRoot.checkInfo}update`, data);
}
export async function finishCheck(data) {
  return ajax.POST(`${apiRoot.checkInfo}finish`, data);
}
export async function addCheckInfo(bill) {
  return ajax.GET(`${apiRoot.checkInfo}create/${bill}`);
}

export async function deleteCheck() {
  return ajax.POST(`${apiRoot.checkInfo}removeCheck`);
}
export async function getBill() {
	return ajax.GET(`${apiRoot.checkInfo}getBill`);
}
