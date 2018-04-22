

import ajax from '../utils/ajax';
const _API_ROOT = "/api/ssm/mng/";

export async function loadMenus() {
  return ajax.GET(_API_ROOT + 'menu/list');
}
export async function loadMenuPage(start, limit, query) {
	return ajax.GET(_API_ROOT + 'menu/get/' + start + '/' + limit, query || {});
}
export async function saveMenu(data) {
	  return ajax.POST(_API_ROOT + 'menu/create', data);
}
export async function deleteMenu(id) {
	  return ajax.DELETE(_API_ROOT + 'menu/remove/' + id);
}
export async function deleteAll(ids) {
	  return ajax.DELETE(_API_ROOT + 'menu/removeAll/', ids);
}
