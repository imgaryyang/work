
import ajax from '../../utils/ajax';

const apiRoot = '/api/hcp/base/ctrl/';

export async function loadTypes() {
  return ajax.GET(`${apiRoot}type/list`);
}

export async function loadCtrlParams() {
  return ajax.GET(`${apiRoot}list`);
}

export async function loadCtrlParamPage(start, limit, query) {
  return ajax.GET(`${apiRoot}page/${start}/${limit}`, query || {});
}

export async function saveCtrlParam(data) {
  return data.id ? ajax.POST(`${apiRoot}update`, data) : ajax.POST(`${apiRoot}create`, data);
}

export async function deleteCtrlParam(id) {
  return ajax.DELETE(`${apiRoot}remove/${id}`);
}

export async function deleteAllCtrlParams(ids) {
  return ajax.DELETE(`${apiRoot}removeAll/`, ids);
}
