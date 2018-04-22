

import ajax from '../../utils/ajax';
const _API_ROOT = "/api/ssm/base/model";

export async function loadAllModels() {
  return ajax.GET(_API_ROOT+'/list');
}

export async function loadParent(ids) {
	  return ajax.GET(_API_ROOT+'/loadParent');
}

export async function saveModel(data) {
	  return ajax.POST(_API_ROOT+'/create',data);
}

export async function deleteAllModels(ids) {
	  return ajax.DELETE(_API_ROOT+'/removeAll/',ids);
}
