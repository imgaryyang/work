import ajax from '../../utils/ajax';

import config from '../../utils/config';

export async function loadUsers() {
  return ajax.GET(`${config.apiRoot.user}list`);
}
export async function loadUserDepts(payload) {
  return ajax.GET(`${config.apiRoot.user}depts`, payload);
}
export async function loadUserDeptsByIds(payload) {
  return ajax.GET(`${config.apiRoot.user}deptsByIds`, payload);
}
export async function loadUserPage(start, limit, query) {
  return ajax.GET(`${config.apiRoot.user}page/${start}/${limit}`, query || {});
}
export async function saveUser(data) {
  if (data.id) return ajax.POST(`${config.apiRoot.user}update`, data);
  return ajax.POST(`${config.apiRoot.user}create`, data);
}
export async function enableUser(id) {
  return ajax.PUT(`${config.apiRoot.user}enable/${id}`);
}
export async function disableUser(id) {
  return ajax.PUT(`${config.apiRoot.user}disable/${id}`);
}
export async function enableAllUsers(ids) {
  return ajax.PUT(`${config.apiRoot.user}enableAll`, ids);
}
export async function disableAllUsers(ids) {
  return ajax.PUT(`${config.apiRoot.user}disableAll`, ids);
}
export async function doctorsInDept(data) {
  return ajax.GET(`${config.apiRoot.user}doctorsInDept`, data);
}
