import ajax from '../../utils/ajax';

const apiRoot = '/api/ssm/treat/';

/**
 * 非现金账户查询
 */
export async function loadRecords(query) {
  return ajax.GET(`${apiRoot}deposit/accounts`, query || {});
}
/**
 * 查询病人信息
 */
export async function loadPatient(query) {
  return ajax.GET(`${apiRoot}patient/loginInfo`, query || {});
}
/**
 * 查询病人信用卡充值信息
 */
export async function loadCreditAmt(query) {
  return ajax.GET(`${apiRoot}deposit/creditIn50`, query || {});
}

/**
 * 退款冻结
 */
export async function dealRefund (payload) {
	return ajax.POST(`${apiRoot}deposit/preRefund/`,payload);
}
/**
 * 退款
 */
export async function dealRefundTrue (payload) {
	return ajax.POST("/api/ssm/payment/pay/refund",payload);
}
/**
 * 查询信用卡，支付宝，微信充值明细
 */
export async function loadAccountDetails (payload) {
	return ajax.GET(`${apiRoot}deposit/records/detail`,payload);
}


