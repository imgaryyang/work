import socket from '../utils/socket';
import ajax from '../utils/ajax';
const _API_ROOT = "/api/ssm/payment/order";



/**
 * 订单分页查询
 */
export async function loadOrders(query) {
	const {start,pageSize} = query;
	delete query.start;
	delete query.pageSize;
	return ajax.GET(_API_ROOT + '/page/rep/'+start+'/'+pageSize, query);
}
/**
 * 订单异常申报
 */
export async function reportExp(order) {
	return ajax.POST(_API_ROOT + '/reportExp/'+ order.id);
}