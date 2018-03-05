import ajax from '../../utils/ajax';

import { apiRoot } from '../../utils/config';
const IN_API_ROOT = "/api/hcp/pharmacy/phaStoreMng/phaInput"

export async function loadBuyDetail(start, limit, query) {
  return ajax.GET(`${apiRoot.buyDetail}/page/${start}/${limit}`, query || {});
}
export async function loadBuyDetailList(query) {
	  return ajax.GET(`${apiRoot.buyDetail}/listDetail`, query || {});
}

export async function saveBatch(data) {
  return ajax.POST(`${apiRoot.buyDetail}/saveBatch`, data?data:[]);
}

export async function UpdInstock(data) {
	  return ajax.POST(`${apiRoot.buyDetail}/update`, data || {});
}

export async function deleteBuyDetail(id) {
  return ajax.DELETE(`${apiRoot.buyDetail}/remove/${id}`);
}
//保存入库记录调用汐鸣入库接口
export async function saveBuy(data) {
	  return ajax.POST(IN_API_ROOT,data);
}