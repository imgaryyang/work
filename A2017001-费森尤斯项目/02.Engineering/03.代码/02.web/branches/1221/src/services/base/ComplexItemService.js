import ajax from '../../utils/ajax';
import { apiRoot } from '../../utils/config';

// 左侧收费项目
export function loadItemInfoList(start, limit, query) {
  const defaultQuery = { isgather: false };
  return ajax.GET(`${apiRoot.itemInfo}page/${start}/${limit}`, { ...defaultQuery, ...query });
}

// 下拉查询
export function loadItemList(query) {
  return ajax.GET(`${apiRoot.complexItemInfo}/loadComplexItem`, query);
}

// 右侧列表
export function loadItemDetail(query) {
  return ajax.GET(`${apiRoot.complexItemInfo}/complexItemDetail`, query);
}

// 修改操作
export function saveItem(data) {
  return ajax.POST(`${apiRoot.complexItemInfo}/updateComplexItem`, data);
}
