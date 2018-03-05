import ajax from '../utils/ajax';

// 住院单查询
export function findInpatientBill(query) {
  return ajax.GET('/api/hwe/treat/his/inpatient/info', query || {});
}

// 住院日清单
export function findInpatientDailyList(query) {
  return ajax.GET('/api/hwe/treat/his/inpatient/dailyList', query || {});
}
