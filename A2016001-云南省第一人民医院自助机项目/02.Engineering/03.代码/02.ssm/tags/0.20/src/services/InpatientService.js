import ajax from '../utils/ajax';
const _API_ROOT = "/api/ssm/treat/";

/**
 * 查询住院预缴余额
 */
export async function loadPrepaidBalance () {
  return ajax.GET(_API_ROOT + 'inpatient/deposit/balance');
}


/**
 * 查询住院基本信息
 */
export async function loadInpatientInfo () {
  return ajax.GET(_API_ROOT + 'inpatient/baseInfo');
}

/**
 * 查询住院日清单
 */
export async function loadDailyBillDetail (data,payload) {
  return ajax.GET(_API_ROOT + 'inpatient/dailyBill/list/'+payload.billDate);
}


/**
 * 查询住院费用
 */
export async function loadInpatientBill (data) {
  return ajax.GET(_API_ROOT + 'inpatient/inpatientBill/list');
}

