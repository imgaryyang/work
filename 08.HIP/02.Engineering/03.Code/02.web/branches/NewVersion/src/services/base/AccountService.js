import ajax from '../../utils/ajax';

const apiRoot = '/api/hcp/base/account/';

export async function loadAccounts() {
  return ajax.GET(`${apiRoot}list`);
}
export async function loadUserAccounts(userId) {
  return ajax.GET(`${apiRoot}listByUser/${userId}`);
}
export async function loadAccountPage(start, limit, query) {
  return ajax.GET(`${apiRoot}get/${start}/${limit}`, query || {});
}
export async function saveAccount(data) {
  return ajax.POST(`${apiRoot}create`, data);
}
export async function deleteAccount(id) {
  return ajax.DELETE(`${apiRoot}remove/${id}`);
}
export async function resetAccountPwd(id) {
  return ajax.PUT(`${apiRoot}restPwd/${id}`);
}
export async function changeAccountPwd(account) {
  return ajax.PUT(`${apiRoot}changePwd`, account);
}
export async function deleteAllAccounts(ids) {
  return ajax.DELETE(`${apiRoot}removeAll`, ids);
}
