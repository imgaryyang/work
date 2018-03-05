
import ajax from '../../utils/ajax';

const apiRoot = '/api/hcp/base/menu/';

export async function loadMenus() {
  return ajax.GET(`${apiRoot}list`);
}
export async function loadMyMenus() {
  return ajax.GET(`${apiRoot}mylist`);
}
export async function loadMenuPage(start, limit, query, chanel) {
  return ajax.GET(`${apiRoot}get/${chanel}/${start}/${limit}`, query || {});
}

export async function saveMenu(data) {
  return ajax.POST(`${apiRoot}create`, data);
}

export async function deleteMenu(id) {
  return ajax.DELETE(`${apiRoot}remove/${id}`);
}

export async function deleteAll(ids) {
  return ajax.DELETE(`${apiRoot}removeAll/`, ids);
}
