import ajax from '../../utils/ajax';
import config from '../../utils/config';

export async function loadPage(start, limit, query, chanel) {
  return ajax.GET(`${config.apiRoot.base}company/page/${chanel}/${start}/${limit}`, query || {});
}

export async function save(data) {
  return ajax.POST(`${config.apiRoot.base}company/save`, data);
}

export async function remove(id) {
  return ajax.DELETE(`${config.apiRoot.base}company/remove/${id}`);
}

export async function removeSelected(ids) {
  return ajax.DELETE(`${config.apiRoot.base}company/removeSelected`, ids);
}
