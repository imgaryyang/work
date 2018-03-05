import ajax from '../../utils/ajax';

import { apiRoot } from '../../utils/config';
const IN_API_ROOT = "/api/hcp/material/phaStoreMng/phaInput"
const apiRootMatBuyDetail = '/api/hcp/material/buyDetail';

export async function loadBuyDetail(start, limit, query) {
  return ajax.GET(`${apiRootMatBuyDetail}/page/${start}/${limit}`, query || {});
}
export async function loadBuyDetailList(query) {
	  return ajax.GET(`${apiRootMatBuyDetail}/listDetail`, query || {});
}

export async function saveBatch(data) {
  return ajax.POST(`${apiRootMatBuyDetail}/saveBatch`, data?data:[]);
}

export async function UpdInstock(data) {
	  return ajax.POST(`${apiRootMatBuyDetail}/update`, data || {});
}


export async function deleteBuyDetail(id) {
  return ajax.DELETE(`${apiRootMatBuyDetail}/remove/${id}`);
}
//保存入库记录调用汐鸣入库接口
export async function saveBuy(data) {
	  return ajax.POST(IN_API_ROOT,data);
}
//add by jiangyong
export async function MatInstockCommit(data) {
	  return ajax.POST(`${apiRootMatBuyDetail}/matInstockCommit`, data || {});
}

