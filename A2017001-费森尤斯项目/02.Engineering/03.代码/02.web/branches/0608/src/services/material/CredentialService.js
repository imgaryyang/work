import ajax from '../../utils/ajax';
import { apiRoot } from '../../utils/config';

export async function loadPageList(start, pageSize, query) {
  return ajax.GET(`${apiRoot.material}certificate/page/${start}/${pageSize}`, query);
}

export async function loadRecordInfo(id) {
  return ajax.GET(`${apiRoot.material}certificate/${id}`);
}

export async function save(credential) {
  return ajax.POST(`${apiRoot.material}certificate/save`, credential);
}

export async function remove(id) {
  return ajax.DELETE(`${apiRoot.material}certificate/remove/${id}`);
}

export async function removeSelected(ids) {
  return ajax.DELETE(`${apiRoot.material}certificate/removeSelected/`, ids);
}
