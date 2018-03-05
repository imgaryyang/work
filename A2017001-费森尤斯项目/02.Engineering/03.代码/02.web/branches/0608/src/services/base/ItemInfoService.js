import ajax from '../../utils/ajax';

const apiRoot = '/api/hcp/base/itemInfo/';

// export async function loadTypes() {
//   return ajax.GET(`${apiRoot}type/list`);
// }

export async function loadItemInfo() {
  return ajax.GET(`${apiRoot}list`);
}

export async function loadItemInfoPage(start, limit, query) {
  return ajax.GET(`${apiRoot}page/${start}/${limit}`, query || {});
}

export async function saveItemInfo(data) {
  if (data.id) return ajax.POST(`${apiRoot}update`, data);
  else return ajax.POST(`${apiRoot}create`, data);
}
export async function deleteItemInfo(id) {
  return ajax.DELETE(`${apiRoot}remove/${id}`);
}
export async function deleteAllItemInfo(ids) {
  return ajax.DELETE(`${apiRoot}removeAll/`, ids);
}
