import ajax from '../../utils/ajax';
import { apiRoot } from '../../utils/config';

export async function loadPage(start, limit, query) {
  return ajax.GET(`${apiRoot.base}company/page/${start}/${limit}`, query || {});
}

export async function save(data) {
  return ajax.POST(`${apiRoot.base}company/save`, data);
}

export async function remove(id) {
  return ajax.DELETE(`${apiRoot.base}company/remove/${id}`);
}

export async function removeSelected(ids) {
  return ajax.DELETE(`${apiRoot.base}company/removeSelected`, ids);
}
