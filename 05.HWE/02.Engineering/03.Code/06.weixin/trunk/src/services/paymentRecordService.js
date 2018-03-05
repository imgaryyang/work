import ajax from '../utils/ajax';


export function findPaymentRecord(query) {
  return ajax.GET('/api/hwe/treat/his/chargeDetail/list', query || {});
}

export function prePay(settlement) {
  return ajax.POST('/api/hwe/pay/prePay', settlement || {});
}
