import ajax from '../../utils/ajax';
import { apiRoot } from '../../utils/config';

export async function loadUsers() {
  return ajax.GET(`${apiRoot.user}list`);
}
export async function loadUserDepts(payload) {
  return ajax.GET(`${apiRoot.user}depts`, payload);
}
export async function loadUserDeptsByIds(payload) {
  return ajax.GET(`${apiRoot.user}deptsByIds`, payload);
}
export async function loadUserPage(start, limit, query) {
  return ajax.GET(`${apiRoot.user}page/${start}/${limit}`, query || {});
}
export async function saveUser(data) {
  if (data.id) return ajax.POST(`${apiRoot.user}update`, data);
  return ajax.POST(`${apiRoot.user}create`, data);
}
export async function enableUser(id) {
  return ajax.PUT(`${apiRoot.user}enable/${id}`);
}
export async function disableUser(id) {
  return ajax.PUT(`${apiRoot.user}disable/${id}`);
}
export async function enableAllUsers(ids) {
  return ajax.PUT(`${apiRoot.user}enableAll`, ids);
}
export async function disableAllUsers(ids) {
  return ajax.PUT(`${apiRoot.user}disableAll`, ids);
}
export async function doctorsInDept(data) {
  return ajax.GET(`${apiRoot.user}doctorsInDept`, data);
}
