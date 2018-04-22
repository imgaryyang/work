import ajax from '../../utils/ajax';

const apiRoot = '/api/ssm/tran/';

export async function loadRecords(startDate, endDate, query) {
  return ajax.GET(`${apiRoot}order/related/${startDate}/${endDate}`, query || {});
}

export async function loadDetailRecords(startDate, endDate, query) {
  return ajax.GET(`${apiRoot}detail/related/${startDate}/${endDate}`, query || {});
}

/**
 * 现金支付提交
 */
export async function cashSubmit (settlement) {
  return ajax.POST('/api/ssm/payment/pay/callback/cash/'+settlement.id, settlement);
}

/**
 * 同步结算单状态
 */
export async function thirdSync (settlement) {
  return ajax.GET('/api/ssm/payment/pay/syncState/'+(settlement.id||settlement.settleNo));
}

/**
 * 交易补录
 */
export async function tranAdd (patientNo, settlement) {
	return ajax.POST('/api/ssm/treat/deposit/additional/'+patientNo, settlement);
}

/**
 * 退款取消
 */
export async function cancelRefund (settlement) {
  return ajax.POST('/api/ssm/treat/deposit/cancelRefund/', settlement);
}