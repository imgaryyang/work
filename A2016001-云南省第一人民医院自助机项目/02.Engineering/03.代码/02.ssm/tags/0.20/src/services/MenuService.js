

import ajax from '../utils/ajax';

const _API_ROOT = "/api/ssm/client/";

export async function loadMenus() {
  return ajax.GET(_API_ROOT+'menu/mylist');
}



/*import request from '../utils/request';
export async function loadMenus(params) {
  return request('api/menu/list');
}*/