import ajax from '../utils/ajax';
const _API_ROOT = "/api/ssm/treat/prepaid/";
/**
 * 预存记账
 */
export async function createOrder (order) {
  return ajax.POST(_API_ROOT + 'createOrder',order);
}

/**
 * 预存现金
 */
export async function prepaidCash (payload) {
  return ajax.GET(_API_ROOT + 'cash', payload);
}



