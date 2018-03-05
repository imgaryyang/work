

import ajax from '../../utils/ajax';

const apiRoot = '/api/hcp/base/dept/';

export async function loadDepts() {
  return ajax.GET(`${apiRoot}deptlist`);
}
export async function loadDept(id) {
  return ajax.GET(`${apiRoot}info/${id}`);
}
export async function createDept(data) {
  return ajax.POST(`${apiRoot}create`, data);
}
export async function deleteAll(ids) {
  return ajax.DELETE(`${apiRoot}removeAll/`, ids);
}
export async function loadDeptByTypes(types) {
	  return ajax.GET(`${apiRoot}listByDeptType/`, types);
}

export async function loadDeptByIsRegDept(IsRegDept) {
	  return ajax.GET(`${apiRoot}listByDeptIsRegDept/`, IsRegDept);
}