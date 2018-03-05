
import ajax from '../../utils/ajax';

const apiRoot = '/api/hcp/base/role';

export async function loadMyRoles(chanel) {
  console.info(chanel);
  return ajax.GET(`${apiRoot}/mylist/${chanel}`);
}
export async function loadMyRolePage(start, limit, query, chanel) {
  return ajax.GET(`${apiRoot}/myPage/${chanel}/${start}/${limit}`, query || {});
}
export async function saveRole(data) {
  if (data.id) return ajax.POST(`${apiRoot}/update`, data);
  else return ajax.POST(`${apiRoot}/create`, data);
}
export async function deleteRole(id) {
  return ajax.DELETE(`${apiRoot}/remove/${id}`);
}
export async function deleteAllRoles(ids) {
  return ajax.DELETE(`${apiRoot}/removeAll/`, ids);
}
