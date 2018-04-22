import ajax from '../utils/ajax';
const _API_ROOT = "/api/ssm/treat/deposit";

/**
 * 查询充值账户列表
 */
export async function loadAccounts (patient) {
  return ajax.GET(_API_ROOT + '/accounts',patient);
}
/**
 * 查询充值明细
 */
export async function loadRechareDetails (param) {
  return ajax.GET(_API_ROOT + '/records/detail',param);
}
/**
 * 查询信用卡金额
 */
export async function getCreditAmt (patient) {
  return ajax.GET(_API_ROOT + '/creditIn50',patient);
}
/**
 * 预退款
 */
export async function preRefund (order) {
  return ajax.POST(_API_ROOT + '/preRefund',order);
}

/**
 * 退款
 */
export async function refund (order) {
  return ajax.POST("/api/ssm/payment/pay" + '/refund',order);
}
