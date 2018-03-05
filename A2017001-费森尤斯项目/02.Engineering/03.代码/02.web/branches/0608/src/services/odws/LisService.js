import ajax from '../../utils/ajax';
import { apiRoot } from '../../utils/config';

export async function loadLisApply(query) {
  return ajax.GET(`${apiRoot.odws}lisApply`, query || {});
}
