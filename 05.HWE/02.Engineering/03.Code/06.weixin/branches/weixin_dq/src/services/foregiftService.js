import ajax from '../utils/ajax';


export function create(data) {
  return ajax.POST('/api/hwe/treat/foregift', data || {});
}

export function getPreSPay(data) {
  return ajax.GET('/api/hwe/treat/his/inpatient/info', data || {});
}
