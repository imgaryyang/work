

import ajax from '../../utils/ajax';
const _API_ROOT = "/api/ssm/payment/order/";

export async function loadOrders() {
  return ajax.GET( _API_ROOT + 'list' );
}
export async function loadOrderPage(start, limit, query) {
	return ajax.GET( _API_ROOT + 'page/' + start + '/' + limit, query || {} );
}
export async function saveOrder(data) {
	if(data.id)return ajax.POST( _API_ROOT + 'update', data );
	return ajax.POST( _API_ROOT + 'create', data );
}
