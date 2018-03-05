
import ajax from '../../utils/ajax';

const _API_ROOT = '/api/hcp/base/account/';

export async function loadAccounts() {
  return ajax.GET(`${_API_ROOT}list`);
}
export async function loadUserAccounts(userId) {
  return ajax.GET(`${_API_ROOT}listByUser/${userId}`);
}
export async function loadAccountPage(start, limit, query) {
  return ajax.GET(`${_API_ROOT}get/${start}/${limit}`, query || {});
}
export async function saveAccount(data) {
  return ajax.POST(`${_API_ROOT}create`, data);
}
export async function deleteAccount(id) {
  return ajax.DELETE(`${_API_ROOT}remove/${id}`);
}
export async function resetAccountPwd(id) {
  return ajax.PUT(`${_API_ROOT}restPwd/${id}`);
}
export async function changeAccountPwd(account) {
  return ajax.PUT(`${_API_ROOT}changePwd`, account);
}
export async function deleteAllAccounts(ids) {
  return ajax.DELETE(`${_API_ROOT}removeAll`, ids);
}
