import ajax from '../utils/ajax';
const _API_ROOT = "/api/ssm/treat/";

/**
 * 查询订单明细
 */
export async function loadOrderList () {
  return ajax.GET(_API_ROOT + 'account/bill/list');
}

/**
 * 预存现金
 */
export async function prepaidCash (payload) {
  return ajax.GET(_API_ROOT + 'prepaid/cash', payload);
}

/**
 * 其它渠道预存
 */
export async function prepaid (payload) {
  return ajax.GET(_API_ROOT + 'prepaid/createOrder', payload);
}

/**
 * 住院预缴
 */
export async function inpatientPrepaid (payload) {
  return ajax.POST(_API_ROOT + 'inpatient/deposit/createOrder', payload);
}


/**
 * 查询待缴费账单
 */
export async function loadNeedPay () {
  return ajax.GET(_API_ROOT + 'fee/list');
}

/**
 * 医保预结算
 */
export async function miPreSettlement (payload) {
  return ajax.GET(_API_ROOT + 'mi/preSettlement', payload);
}

/**
 * 医保结算
 */
export async function miSettlement (payload) {
  return ajax.GET(_API_ROOT + 'mi/settlement', payload);
}

/**
 * 余额账户支付
 */
export async function accountPay (payload) {
  return ajax.GET(_API_ROOT + 'order/accountPay', payload);
}

/**
 * 去支付
 */
export async function goToPay (payload) {
  return ajax.GET(_API_ROOT + 'order/pay', payload);
}

/**
 * 支付完成
 */
export async function paid (payload) {
  return ajax.GET(_API_ROOT + 'order/paid', payload);
}



