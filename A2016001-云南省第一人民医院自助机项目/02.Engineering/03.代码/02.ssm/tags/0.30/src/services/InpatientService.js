import ajax from '../utils/ajax';
const _API_ROOT = "/api/ssm/treat/";

/**
 * 查询住院预缴余额
 */
export async function loadPrepaidBalance (param) {
  return ajax.GET(_API_ROOT + 'inpatient/deposit/balance');
}


/**
 * 查询住院基本信息
 */
export async function loadInpatientInfo (param) {
  return ajax.GET(_API_ROOT + 'inpatient/info',param);
}

/**
 * 查询住院日清单
 */
export async function loadInpatientBills (param) {
  return ajax.GET(_API_ROOT + 'inpatient/inpatientBill/list',param);
}

