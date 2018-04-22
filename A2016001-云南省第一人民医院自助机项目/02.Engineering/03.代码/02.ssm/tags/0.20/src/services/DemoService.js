

import ajax from '../utils/ajax';

export async function loadMenus() {
  return ajax.GET('api/menu/list');
}
export async function drugList() {
  return ajax.GET('api/demo/druglist');
}



/*import request from '../utils/request';
export async function loadMenus(params) {
  return request('api/menu/list');
}*/