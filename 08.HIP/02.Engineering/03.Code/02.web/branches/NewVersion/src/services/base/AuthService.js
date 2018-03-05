
import ajax from '../../utils/ajax';

const apiRoot = '/api/hcp/base/auth';

export async function loadRoleUsers(roleId) {
  return ajax.GET(`${apiRoot}/user/list/${roleId}`);
}
export async function assignUser(roleId, userId) {
  return ajax.PUT(`${apiRoot}/user/assign/${roleId}/${userId}`);
}
export async function unAssignUser(roleId, userId) {
  return ajax.PUT(`${apiRoot}/user/unassign/${roleId}/${userId}`);
}

export async function loadRoleMenus(roleId) {
  return ajax.GET(`${apiRoot}/menu/list/${roleId}`);
}
export async function assignMenu(roleId, menuIds) {
  return ajax.PUT(`${apiRoot}/menu/assign/${roleId}/`, menuIds);
}

