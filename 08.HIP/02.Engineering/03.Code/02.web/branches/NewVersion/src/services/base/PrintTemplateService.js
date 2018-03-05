/* eslint linebreak-style: ["error", "windows"] */
import ajax from '../../utils/ajax';
import config from '../../utils/config';

export async function loadPage(start, limit, query) {
  return ajax.GET(`${config.apiRoot.printTemplate}/page/${start}/${limit}`, query || {});
}

export async function save(data) {
  return data.id
    ? ajax.POST(`${config.apiRoot.printTemplate}/update`, data)
    : ajax.POST(`${config.apiRoot.printTemplate}/create`, data);
}

export async function remove(id) {
  return ajax.DELETE(`${config.apiRoot.printTemplate}/remove/${id}`);
}

export async function update(id) {
  return ajax.POST(`${config.apiRoot.printTemplate}/update/${id}`);
}

export async function removeAll(ids) {
  return ajax.DELETE(`${config.apiRoot.printTemplate}/removeAll`, ids);
}
