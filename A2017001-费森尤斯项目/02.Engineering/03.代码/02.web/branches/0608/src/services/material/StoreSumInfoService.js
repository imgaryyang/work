import ajax from '../../utils/ajax';
import { apiRoot } from '../../utils/config';

export async function loadStoreSumInfoPage(start, limit, query) {
  return ajax.GET(`${apiRoot.matStoreSumInfo}page/${start}/${limit}`, query || {});
}

// 获取库存预警数据
export async function loadStoreSumWarnInfoPage(start, limit, query) {
  return ajax.GET(`${apiRoot.matStoreSumInfo}pageInventWarn/${start}/${limit}/` + "1/", query || {});
}

// 获取滞留预警数据
export async function loadStoreSumDetentWarnInfoPage(start, limit, query) {
  return ajax.GET(`${apiRoot.matStoreSumInfo}pageDetentWarn/${start}/${limit}/`, query || {});
}

export async function saveStoreSumInfo(data) {
  return ajax.POST(`${apiRoot.matStoreSumInfo}update`, data);
}

export async function saveEditStoreSumInfo(data) {
  return ajax.POST(`${apiRoot.matStoreSumInfo}saveEdit`, data);
}

export async function listStoreSumInfo(data) {
  return ajax.GET(`${apiRoot.matStoreSumInfo}list`, data || {});
}

export async function loadStoreSumInfo(data) {
  return ajax.GET(`${apiRoot.matStoreSumInfo}loadHosSum`, data || {});
}
