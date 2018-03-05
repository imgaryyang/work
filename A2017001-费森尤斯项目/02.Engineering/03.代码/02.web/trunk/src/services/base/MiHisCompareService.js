import ajax from '../../utils/ajax';
import { apiRoot } from '../../utils/config';

export async function loadPage(start, limit, query) {
  return ajax.GET(`${apiRoot.miHisCompare}/page/${start}/${limit}`, query || {});
}

export async function save(data) {
  return data.id ?
    ajax.POST(`${apiRoot.miHisCompare}/update`, data) :
    ajax.POST(`${apiRoot.miHisCompare}/create`, data);
}

export async function remove(id) {
  return ajax.DELETE(`${apiRoot.miHisCompare}/remove/${id}`);
}

export async function update(id) {
  return ajax.POST(`${apiRoot.miHisCompare}/update/${id}`);
}

export async function removeAll(ids) {
  return ajax.DELETE(`${apiRoot.miHisCompare}/removeAll`, ids);
}
