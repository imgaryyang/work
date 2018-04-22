import ajax from '../utils/ajax';
const _API_ROOT = "/api/ssm/client/";

/**
 * 查询住院预缴余额
 */
export async function loadPrepaidBalance () {
  return ajax.GET(_API_ROOT + 'inpatient/loadPrepaidBalance');
}


/**
 * 查询住院日清单
 */
export async function loadDailyBill (payload) {
  return ajax.GET(_API_ROOT + 'inpatient/loadDailyBill', payload);
}


/**
 * 查询住院费用
 */
export async function loadInpatientBill (payload) {
  return ajax.GET(_API_ROOT + 'inpatient/loadInpatientBill', payload);
}

