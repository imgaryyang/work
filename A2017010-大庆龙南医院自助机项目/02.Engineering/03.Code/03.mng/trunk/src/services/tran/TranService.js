import ajax from '../../utils/ajax';

const apiRoot = '/api/ssm/tran/';

export async function loadRecords(startDate, endDate, query) {
  return ajax.GET(`${apiRoot}order/related/${startDate}/${endDate}`, query || {});
}

export async function loadDetailRecords(startDate, endDate, query) {
  return ajax.GET(`${apiRoot}detail/related/${startDate}/${endDate}`, query || {});
}

/**
 * 现金支付完毕
 */
export async function cashCallBack (settlement ) {
  return ajax.POST('/api/ssm/payment/pay/callback/cash/'+settlement.id,settlement);
}

/**
 * 同步结算单状态
 */
export async function thirdCallSync (settlement) {
  return ajax.GET('/api/ssm/payment/pay/syncState/'+settlement.id);
}

/**
 * 退款取消
 */
export async function cancelRefund (settlement) {
  return ajax.GET('/api/ssm/treat/deposit/cancelRefund/'+settlement.settleNo);
}