import ajax from '../../utils/ajax';
import { apiRoot } from '../../utils/config';

const apiMatStoreInfo = '/api/hcp/material/matStoreInfo/';

export async function loadStoreInfoPage(start, limit, query) {
  return ajax.GET(`${apiMatStoreInfo}page/${start}/${limit}`, query || {});
}

// 获取有效期预警数据
export async function loadStoreInfoValidWarnPage(start, limit, query) {
  return ajax.GET(`${apiMatStoreInfo}validWarnPage/${start}/${limit}`, query || {});
}

export async function saveStoreInfo(data) {
  return ajax.POST(`${apiMatStoreInfo}update`, data);
}

export async function saveEditStoreInfo(data) {
  return ajax.POST(`${apiMatStoreInfo}saveEdit`, data);
}

export async function listStoreInfo(data) {
  return ajax.GET(`${apiMatStoreInfo}list`, data || {});
}
