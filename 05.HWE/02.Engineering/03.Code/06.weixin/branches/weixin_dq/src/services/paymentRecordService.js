import ajax from '../utils/ajax';

export function getConsumeRecords(query) {
  return ajax.GET('/api/hwe/treat/his/charge/list', query || {});
}

export function getPreRecords(data) {
  return ajax.GET('/api/hwe/treat/his/deposit/list', data || {});
}

export function getPreStore(data) {
  return ajax.GET('/api/hwe/treat/his/profile/info', data || {});
}
export function findUnpaidsRecord(query) {
  return ajax.GET('/api/hwe/treat/his/chargeDetail/unpaids', query || {});
}

export function prePay(settlement) {
  return ajax.POST('/api/hwe/treat/his/charge/prepay', settlement || {});
}

export function pay(settlement) {
  return ajax.POST('/api/hwe/treat/his/charge/pay', settlement || {});
}

export function findPaymentRecord(query) {
  return ajax.GET('/api/hwe/treat/his/chargeDetail/list', query || {});
}
