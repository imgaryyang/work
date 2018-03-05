import ajax from '../../utils/ajax';
import { apiRoot } from '../../utils/config';

export async function loadStoreInfoPage(start, limit, query) {
  return ajax.GET(`${apiRoot.matStoreInfo}page/${start}/${limit}`, query || {});
}

// 获取有效期预警数据
export async function loadStoreInfoValidWarnPage(start, limit, query) {
  return ajax.GET(`${apiRoot.matStoreInfo}validWarnPage/${start}/${limit}`, query || {});
}

export async function saveStoreInfo(data) {
  return ajax.POST(`${apiRoot.matStoreInfo}update`, data);
}

export async function saveEditStoreInfo(data) {
  return ajax.POST(`${apiRoot.matStoreInfo}saveEdit`, data);
}

export async function listStoreInfo(data) {
  return ajax.GET(`${apiRoot.matStoreInfo}list`, data || {});
}
