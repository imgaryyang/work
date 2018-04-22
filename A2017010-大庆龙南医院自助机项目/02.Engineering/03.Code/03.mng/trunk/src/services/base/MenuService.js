

import ajax from '../../utils/ajax';
const _API_ROOT = "/api/ssm/base/menu";
//{clientMenuPage,clientMenuList,mngMenuPage,mngMenuList,deleteMenu,deleteAllMenu,saveMenu}
export async function clientMenuPage(start,limit,param) {
  return ajax.GET(_API_ROOT+'/client/get/'+start+'/'+limit,param);
}
export async function mngMenuPage(start,limit,param) {
  return ajax.GET(_API_ROOT+'/mng/get/'+start+'/'+limit,param);
}
export async function clientMenuList(param) {
  return ajax.GET(_API_ROOT+'/client/list',param);
}
export async function mngMenuList(param) {
  return ajax.GET(_API_ROOT+'/mng/list',param);
}
export async function operatorMenuList(param) {
  return ajax.GET(_API_ROOT+'/operator/list',param);
}
export async function deleteMenu(id) {
  return ajax.DELETE(_API_ROOT+'/remove/'+id);
}
export async function deleteAllMenu(ids) {
  return ajax.DELETE(_API_ROOT+'/removeAll/',ids);
}
export async function saveMenu(menu) {
  return ajax.POST(_API_ROOT+'/create/',menu);
}