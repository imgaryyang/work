import ajax from '../../utils/ajax';
import { apiRoot } from '../../utils/config';

const IN_API_ROOT = "/api/hcp/hrp/insStoreMng/insOutput";

export async function saveOutputInfo(list) {
  return ajax.POST(`${apiRoot.hrpOutputInfo}create`, list);
}

export async function saveOutput(list) {
  return ajax.POST(IN_API_ROOT, list);
}

export async function receiveOutBill() {
  return ajax.GET(`${apiRoot.hrpOutputInfo}receiveOutBill`);
}

export async function loadOutputDetailPage(start, limit, query) {
  return ajax.GET(`${apiRoot.hrpOutputInfo}page/${start}/${limit}`, query || {});
}

export async function loadTotalSum(query) {
  return ajax.GET(`${apiRoot.hrpOutputInfo}totalSum`, query || {});
}

export async function loadOutputSummaryPage(start, limit, query) {
  return ajax.GET(`${apiRoot.hrpOutputInfo}outputSummaryPage/${start}/${limit}`, query || {});
}

export async function loadOutputSummarySum(query) {
  return ajax.GET(`${apiRoot.hrpOutputInfo}outputSummarySum`, query || {});
}

export async function getOutputList(query) {
  return ajax.GET(`${apiRoot.hrpOutputInfo}list`, query);
}

export async function getOutputDetail(query) {
  return ajax.GET(`${apiRoot.hrpOutputInfo}detail`, query);
}

export async function saveOutputDetail(detail) {
  return ajax.POST(`${apiRoot.hrpOutputInfo}instock`, detail);
}
