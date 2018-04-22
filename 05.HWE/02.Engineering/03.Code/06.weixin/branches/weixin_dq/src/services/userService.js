import ajax from '../utils/ajax';


export function list() {
  return ajax.GET('/api/hwe/app/userPatient/list');
}

export function addPatient(data) {
  return ajax.POST('/api/hwe/app/userPatient/create', data || {});
}

export function getProfiles(data) {
  return ajax.POST('/api/hwe/app/userPatient/queryProfile', data || {});
}

export function doSave(data) {
  return ajax.POST('/api/hwe/app/doSave', data || {});
}

export function remove(data) {
  return ajax.DELETE(`/api/hwe/app/userPatient/remove/${data}`);
}

