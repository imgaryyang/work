import ajax from '../../utils/ajax';
import { apiRoot } from '../../utils/config';

export async function loadFeeAggregation(query) {
  return ajax.GET(`${apiRoot.odws}fee`, query || {});
}
