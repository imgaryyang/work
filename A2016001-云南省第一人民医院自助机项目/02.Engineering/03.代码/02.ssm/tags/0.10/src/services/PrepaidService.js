import ajax from '../utils/ajax';
const _API_ROOT = "/api/ssm/client/";

/**
 * 预存记账
 */
export async function prepaidBook () {
  return ajax.GET(_API_ROOT + 'prepaid/book');
}

/**
 * 预存现金
 */
export async function prepaidCash (payload) {
  return ajax.GET(_API_ROOT + 'prepaid/cash', payload);
}



