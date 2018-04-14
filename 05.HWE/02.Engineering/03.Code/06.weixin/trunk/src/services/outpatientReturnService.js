import ajax from '../utils/ajax';


export function findInpatientPaymentRecord(query) {
  return ajax.GET('/api/hwe/treat/his/deposit/list', query || {});
}

export function prePay(settlement) {
  return ajax.POST('/api/hwe/treat/his/charge/prePay', settlement || {});
}
