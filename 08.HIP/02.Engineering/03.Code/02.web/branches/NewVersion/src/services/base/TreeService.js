
import ajax from '../../utils/ajax';

const apiRoot = '/api/hcp/base/tree/';

export async function load(query) {
  return ajax.GET(`${apiRoot}list`, query || {});
}

export async function loadTreeItemPage(start, limit, query) {
  return ajax.GET(`${apiRoot}page/${start}/${limit}`, query || {});
}

export async function saveItem(data) {
  return data.id ? ajax.POST(`${apiRoot}update`, data) : ajax.POST(`${apiRoot}create`, data);
}

export async function deleteItem(id) {
  return ajax.DELETE(`${apiRoot}remove/${id}`);
}

export async function deleteItems(ids) {
  return ajax.DELETE(`${apiRoot}remove/`, ids);
}
