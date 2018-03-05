import ajax from '../../utils/ajax';
import { apiRoot } from '../../utils/config';

const IN_API_ROOT = "/api/hcp/material/matStoreMng/matOutput";

export async function saveOutputInfo(list) {
  return ajax.POST(`${apiRoot.matOutputInfo}create`, list);
}

export async function saveOutput(list) {
  return ajax.POST(IN_API_ROOT, list);
}

export async function receiveOutBill() {
  return ajax.GET(`${apiRoot.matOutputInfo}receiveOutBill`);
}

export async function loadOutputDetailPage(start, limit, query) {
  return ajax.GET(`${apiRoot.matOutputInfo}page/${start}/${limit}`, query || {});
}

export async function loadTotalSum(query) {
  return ajax.GET(`${apiRoot.matOutputInfo}totalSum`, query || {});
}

export async function loadOutputSummaryPage(start, limit, query) {
  return ajax.GET(`${apiRoot.matOutputInfo}outputSummaryPage/${start}/${limit}`, query || {});
}

export async function loadOutputSummarySum(query) {
  return ajax.GET(`${apiRoot.matOutputInfo}outputSummarySum`, query || {});
}

export async function getOutputList(query) {
  return ajax.GET(`${apiRoot.matOutputInfo}list`, query);
}

export async function getOutputDetail(query) {
  return ajax.GET(`${apiRoot.matOutputInfo}detail`, query);
}

export async function saveOutputDetail(detail) {
  return ajax.POST(`${apiRoot.matOutputInfo}instock`, detail);
}
