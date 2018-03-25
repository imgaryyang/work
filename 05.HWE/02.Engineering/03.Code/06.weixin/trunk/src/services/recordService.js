import ajax from '../utils/ajax';

export function getRecordList(query) {
  return ajax.GET('/api/hwe/treat/his/activity/list', query || {});
}
export function getDiagnoseList(query) {
  return ajax.GET('/api/hwe/treat/his/activity/diagnoseList', query || {});
}
export function getDrugList(query) {
  return ajax.GET('/api/hwe/treat/his/activity/recordList', query || {});
}
