import ajax from '../../utils/ajax';

const apiRoot = '/api/ssm/backTracking/';

export async function loadRecords(startDate, endDate, query) {
  return ajax.GET(`${apiRoot}order/related/${startDate}/${endDate}`, query || {});
}

export async function loadDetailRecords(startDate, endDate, query) {
  return ajax.GET(`${apiRoot}detail/related/${startDate}/${endDate}`, query || {});
}

/**
 * 现金支付完毕
 */
export async function handleCallBack (settlement ) {
  return ajax.POST('/api/ssm/payment/pay/callback/cash/'+settlement.id,settlement);
}

/**
 * 同步结算单状态
 */
export async function handleCallSync (settlement) {
  return ajax.GET('/api/ssm/payment/pay/syncState/'+settlement.id);
}