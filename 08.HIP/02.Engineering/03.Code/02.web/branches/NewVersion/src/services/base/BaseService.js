import ajax from '../../utils/ajax';

import config from '../../utils/config';

export function userLogin(user) {
  return ajax.POST(`${config.apiRoot.base}auth/login`, user);
}

export function userLogout(user) {
  return ajax.GET(`${config.apiRoot.base}auth/logout`, user);
}

export function userInfo(user) {
  return ajax.GET(`${config.apiRoot.base}auth/userInfo`, user);
}

export function mySystems() {
  return ajax.GET(`${config.apiRoot.base}system/mylist`);
}

export function myMenus() {
  return ajax.GET(`${config.apiRoot.base}menu/mylist`);
}

export function mySystemMenus(system) {
  return ajax.GET(`${config.apiRoot.base}menu/mylist/${system.code}`);
}

export function chooseLoginDept(id) {
  return ajax.PUT(`${config.apiRoot.base}auth/chooseLoginDept/${id}`);
}

// /hcp/base/messageNotification/list
export function loadNotificationMsg(data) {
  return ajax.GET(`${config.apiRoot.messageNotification}/list`, data);
}
