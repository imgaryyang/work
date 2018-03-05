import ajax from '../../utils/ajax';
import { apiRoot } from '../../utils/config';

export async function loadStoreSumInfoPage(start, limit, query) {
  return ajax.GET(`${apiRoot.storeSumInfo}page/${start}/${limit}`, query || {});
}

// 获取库存预警数据
export async function loadStoreSumWarnInfoPage(start, limit, query) {
  return ajax.GET(`${apiRoot.storeSumInfo}pageInventWarn/${start}/${limit}/` + "1/", query || {});
}

// 获取滞留预警数据
export async function loadStoreSumDetentWarnInfoPage(start, limit, query) {
  return ajax.GET(`${apiRoot.storeSumInfo}pageDetentWarn/${start}/${limit}/`, query || {});
}

export async function saveStoreSumInfo(data) {
  return ajax.POST(`${apiRoot.storeSumInfo}update`, data);
}

export async function saveEditStoreSumInfo(data) {
  return ajax.POST(`${apiRoot.storeSumInfo}saveEdit`, data);
}

export async function listStoreSumInfo(data) {
  return ajax.GET(`${apiRoot.storeSumInfo}list`, data || {});
}

export async function loadStoreSumInfo(data) {
  return ajax.GET(`${apiRoot.storeSumInfo}loadHosSum`, data || {});
}
