import ajax from '../../utils/ajax';
import { apiRoot } from '../../utils/config';

const user4OptApiRoot = '/api/hcp/operation/user';

export async function loadUsers() {
  return ajax.GET(`${apiRoot.user}list`);
}
export async function loadUserDepts(payload) {
  return ajax.GET(`${user4OptApiRoot}/depts`, payload);
}
export async function loadUserDeptsByIds(payload) {
  return ajax.GET(`${user4OptApiRoot}/deptsByIds`, payload);
}
export async function listDept(query) {
  return ajax.GET(`${user4OptApiRoot}/listDept`, query || {});
}
export async function loadUserPage(start, limit, query) {
  return ajax.GET(`${user4OptApiRoot}/page/${start}/${limit}`, query || {});
}
export async function saveUser(data) {
  if (data.id) return ajax.POST(`${user4OptApiRoot}/update`, data);
  return ajax.POST(`${user4OptApiRoot}/create`, data);
}
export async function enableUser(id) {
  return ajax.PUT(`${user4OptApiRoot}/enable/${id}`);
}
export async function disableUser(id) {
  return ajax.PUT(`${user4OptApiRoot}/disable/${id}`);
}
export async function enableAllUsers(ids) {
  return ajax.PUT(`${user4OptApiRoot}/enableAll`, ids);
}
export async function disableAllUsers(ids) {
  return ajax.PUT(`${user4OptApiRoot}/disableAll`, ids);
}
export async function doctorsInDept(data) {
  return ajax.GET(`${user4OptApiRoot}/doctorsInDept`, data);
}
