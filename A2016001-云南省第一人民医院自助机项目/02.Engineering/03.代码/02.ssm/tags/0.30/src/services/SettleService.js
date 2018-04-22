import socket from '../utils/socket';
import ajax from '../utils/ajax';
const _API_ROOT = "/api/ssm/pay/settle";



/**
 * 结算单分页查询
 */
export async function loadSettles(query) {
	const {start,limit} = query;
	delete query.start;
	delete query.limit;
	return ajax.GET(_API_ROOT + '/page/'+start+'/'+limit,query);
}

/**
 * 现金批次列表
 */
export async function cashBatchList() {
	return ajax.GET(_API_ROOT + '/cash/print/list');
}
/**
 * 现金批次列表
 */
export async function cashUnPrinted() {
	return ajax.GET(_API_ROOT + '/cash/unPrinted/machine');
}
/**
 * 现金批次打印回传
 */
export async function createCashBatch() {
	return ajax.GET(_API_ROOT + '/cash/createBatch');
}