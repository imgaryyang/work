import ajax from '../utils/ajax';
const _API_ROOT = "/api/ssm/client/";

/**
 * 查询账单明细
 */
export async function loadBillList () {
  return ajax.GET(_API_ROOT + 'bill/loadBillList');
}

/**
 * 查询待缴费账单
 */
export async function loadNeedPayBills () {
  return ajax.GET(_API_ROOT + 'bill/loadNeedPayBills');
}



