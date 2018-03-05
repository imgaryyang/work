import ajax from '../../utils/ajax';
import { apiRoot } from '../../utils/config';

const IN_API_ROOT = "/api/hcp/pharmacy/phaStoreMng/phaOutput"
	
export async function saveOutputInfo(list) {
	return ajax.POST(`${apiRoot.outputInfo}create`, list);
}

export async function saveOutput(list) {
	return ajax.POST(IN_API_ROOT, list);
}

export async function receiveOutBill() {
	return ajax.GET(`${apiRoot.outputInfo}receiveOutBill`);
}

export async function loadOutputDetailPage(start, limit, query) {
	return ajax.GET(`${apiRoot.outputInfo}page/${start}/${limit}`, query || {});
}

export async function loadTotalSum(query) {
	return ajax.GET(`${apiRoot.outputInfo}totalSum`, query || {});
}

export async function loadOutputSummaryPage(start, limit, query) {
	return ajax.GET(`${apiRoot.outputInfo}outputSummaryPage/${start}/${limit}`, query || {});
}

export async function loadOutputSummarySum(query) {
	return ajax.GET(`${apiRoot.outputInfo}outputSummarySum`, query || {});
}

export async function getOutputList(query) {
	return ajax.GET(`${apiRoot.outputInfo}list`, query);
}

export async function getOutputDetail(query) {
	return ajax.GET(`${apiRoot.outputInfo}detail`, query);
}

export async function saveOutputDetail(detail) {
	return ajax.POST(`${apiRoot.outputInfo}instock`, detail);
}