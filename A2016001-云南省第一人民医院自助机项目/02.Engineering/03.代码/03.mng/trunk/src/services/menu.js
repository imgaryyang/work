

import ajax from '../utils/ajax';
const _API_ROOT = "/api/ssm/mng/";
export async function loadMenus() {
  return ajax.GET(_API_ROOT+'menu/list');
}


/*import request from '../utils/request';
export async function loadMenus(params) {
  return request('api/menu/list');
}*/