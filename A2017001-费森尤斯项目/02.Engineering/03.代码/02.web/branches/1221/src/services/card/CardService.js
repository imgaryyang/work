import ajax from '../../utils/ajax';
import { apiRoot } from '../../utils/config';

export async function loadCardPage(start, limit, query) {
  return ajax.GET(`${apiRoot.card}page/${start}/${limit}`, query || {});
}

