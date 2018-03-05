import ajax from '../../utils/ajax';
import { apiRoot } from '../../utils/config';

export async function loadExamApply(query) {
  return ajax.GET(`${apiRoot.odws}examApply`, query || {});
}
