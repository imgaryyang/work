import ajax from '../../utils/ajax';
import { apiRoot } from '../../utils/config';

export async function loadHistory(start, limit, query) {
  return ajax.GET(`${apiRoot.register}/find/${start}/${limit}`, query || {});
}
