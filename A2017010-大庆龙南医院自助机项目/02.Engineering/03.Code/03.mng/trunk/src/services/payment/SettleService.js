

import ajax from '../../utils/ajax';
const _API_ROOT = "/api/ssm/pay/settle/";

export async function loadSettles() {
  return ajax.GET( _API_ROOT + 'list' );
}
export async function loadSettlePage(start, limit, query) {
	return ajax.GET( _API_ROOT + 'page/' + start + '/' + limit, query || {} );
}
