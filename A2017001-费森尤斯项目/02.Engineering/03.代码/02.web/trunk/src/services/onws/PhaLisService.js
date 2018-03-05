import ajax from '../../utils/ajax';

import { apiRoot } from '../../utils/config';

export async function loadPatLisPage(start, limit, query) {
  return ajax.GET(`${apiRoot.phaLis}/page/${start}/${limit}`, query || {});
}

export async function getPatLisPage(start, limit, query) {
  return ajax.GET(`${apiRoot.phaLis}/getPatLisPage/${start}/${limit}`, query || {});
}

export async function savePatLis(data) {
  return ajax.POST(`${apiRoot.phaLis}/create`, data);
}
