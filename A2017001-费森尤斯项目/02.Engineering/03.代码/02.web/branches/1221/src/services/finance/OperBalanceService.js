import ajax from '../../utils/ajax';
import { apiRoot } from '../../utils/config';

export async function loadPage(start, limit, query) {
  return ajax.GET(`${apiRoot.operBalance}/page/${start}/${limit}`, query || {});
}

export async function update(id) {
  return ajax.POST(`${apiRoot.operBalance}/update/${id}`);
}
