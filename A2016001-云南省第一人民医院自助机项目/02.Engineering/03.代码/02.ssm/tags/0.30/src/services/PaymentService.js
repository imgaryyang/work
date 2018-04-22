import ajax from '../utils/ajax';
const _API_ROOT = "/api/ssm/payment/pay";

/**
 * 预支付
 */
export async function preCreate (settle) {
  return ajax.POST(_API_ROOT + '/preCreate',settle||{});
}
/**
 * 银联支付完毕
 */
export async function unionPayCallback (settlement) {
  return ajax.POST(_API_ROOT + '/callback/unionpay/'+settlement.id,settlement);
}
/**
 * 现金支付完毕
 */
export async function cashPayCallback (settlement ) {
  return ajax.POST(_API_ROOT + '/callback/cash/'+settlement.id,settlement);
}

/**
 * 余额支付
 */
export async function balancePayCallback (settlement ) {
  return ajax.POST(_API_ROOT + '/callback/balance/'+settlement.id,settlement);
}
/**
 * 显示二维码
 */
export async function showQrCode (settlement,size) {
  if(!size)size=256;
  return ajax.POST(_API_ROOT + '/showQrCode/'+settlement.id+'/'+size);
}
/**
 * 查询结算单状态
 */
export async function getSettlement (id) {
  return ajax.GET("/api/ssm/pay/settle/info/"+id,{},{quiet:true});
}

