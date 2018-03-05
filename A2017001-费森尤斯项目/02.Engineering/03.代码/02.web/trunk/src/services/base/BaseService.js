import ajax from '../../utils/ajax';
import { apiRoot } from '../../utils/config';

export function userLogin(user) {
  return ajax.POST(`${apiRoot.base}auth/login`, user);
}

export function userLogout(user) {
  return ajax.GET(`${apiRoot.base}auth/logout`, user);
}

export function userInfo(user) {
  return ajax.GET(`${apiRoot.base}auth/userInfo`, user);
}

export function mySystems() {
  return ajax.GET(`${apiRoot.base}system/mylist`);
}

export function myMenus() {
  return ajax.GET(`${apiRoot.base}menu/mylist`);
}

export function mySystemMenus(system) {
  return ajax.GET(`${apiRoot.base}menu/mylist/${system.code}`);
}

export function chooseLoginDept(id) {
  return ajax.PUT(`${apiRoot.base}auth/chooseLoginDept/${id}`);
}

// /hcp/base/messageNotification/list
export function loadNotificationMsg(data) {
  return ajax.GET(`${apiRoot.messageNotification}/list`, data);
}
