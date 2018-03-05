/* eslint linebreak-style: ["error", "windows"]*/
import ajax from '../../utils/ajax';
import { apiRoot } from '../../utils/config';

export async function loadPage(start, limit, query) {
  return ajax.GET(`${apiRoot.interfaceConfig}/page/${start}/${limit}`, query || {});
}

export async function save(data) {
  return data.id
    ? ajax.POST(`${apiRoot.interfaceConfig}/update`, data)
    : ajax.POST(`${apiRoot.interfaceConfig}/create`, data);
}

export async function remove(id) {
  return ajax.DELETE(`${apiRoot.interfaceConfig}/remove/${id}`);
}

export async function update(id) {
  return ajax.POST(`${apiRoot.interfaceConfig}/update/${id}`);
}

export async function removeAll(ids) {
  return ajax.DELETE(`${apiRoot.interfaceConfig}/removeAll`, ids);
}
