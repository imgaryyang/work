import ajax from '../utils/ajax';


export function create(data) {
  return ajax.POST('/api/hwe/treat/deposit/recharge', data || {});
}

export function getPreStore(data) {
  return ajax.GET('/api/hwe/treat/his/profile/info', data || {});
}

export function refund(data) {
  return ajax.POST('/api/hwe/treat/deposit/refund', data || {});
}

