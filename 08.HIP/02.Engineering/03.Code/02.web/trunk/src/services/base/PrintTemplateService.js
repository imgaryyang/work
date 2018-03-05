/* eslint linebreak-style: ["error", "windows"]*/
import ajax from '../../utils/ajax';
import { apiRoot } from '../../utils/config';

export async function loadPage(start, limit, query) {
  return ajax.GET(`${apiRoot.printTemplate}/page/${start}/${limit}`, query || {});
}

export async function save(data) {
  return data.id
    ? ajax.POST(`${apiRoot.printTemplate}/update`, data)
    : ajax.POST(`${apiRoot.printTemplate}/create`, data);
}

export async function remove(id) {
  return ajax.DELETE(`${apiRoot.printTemplate}/remove/${id}`);
}

export async function update(id) {
  return ajax.POST(`${apiRoot.printTemplate}/update/${id}`);
}

export async function removeAll(ids) {
  return ajax.DELETE(`${apiRoot.printTemplate}/removeAll`, ids);
}
