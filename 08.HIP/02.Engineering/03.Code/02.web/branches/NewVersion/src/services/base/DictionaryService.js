
import ajax from '../../utils/ajax';

const apiRoot = '/api/hcp/base/dictionary/';

export async function loadTypes() {
  return ajax.GET(`${apiRoot}type/list`);
}

export async function loadDicts() {
  return ajax.GET(`${apiRoot}list`);
}

export async function loadDictPage(start, limit, query) {
  return ajax.GET(`${apiRoot}page/${start}/${limit}`, query || {});
}

export async function saveDict(data) {
  return data.id ? ajax.POST(`${apiRoot}update`, data) : ajax.POST(`${apiRoot}create`, data);
}

export async function deleteDict(id) {
  return ajax.DELETE(`${apiRoot}remove/${id}`);
}

export async function deleteAllDicts(ids) {
  return ajax.DELETE(`${apiRoot}removeAll/`, ids);
}
