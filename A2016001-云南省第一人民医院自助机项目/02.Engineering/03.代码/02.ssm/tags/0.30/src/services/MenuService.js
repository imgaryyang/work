

import ajax from '../utils/ajax';

const _API_ROOT = "/api/ssm/base/menu";

export async function loadMenus() {
  return ajax.GET(_API_ROOT+'/client/mylist');
}
export async function loadOperatorMenus() {
  return ajax.GET(_API_ROOT+'/operator/mylist');
}

/*import request from '../utils/request';
export async function loadMenus(params) {
  return request('api/menu/list');
}*/