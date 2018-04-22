import ajax from '../utils/ajax';

// 预约挂号
const appoint = '/api/hwe/treat/appoint/';
const hisAppoint = '/api/hwe/treat/his/appoint/';
const hisSchedule = '/api/hwe/treat/his/schedule/';

// 3.4.1 可预约科室分类树查询
export function forDeptTree(cond) {
  return ajax.GET(`${appoint}deptTree`, cond);
}

// 3.4.2 可预约科室列表查询
export function forDeptList(cond) {
  return ajax.GET(`${hisAppoint}deptList`, cond);
}

// 3.4.5 患者预约
export function forReserve(cond) {
  return ajax.POST(`${hisAppoint}reserve`, cond);
}

// 3.4.7 患者签到
export function forSign(cond) {
  return ajax.POST(`${hisAppoint}sign`, cond);
}

// 3.4.8 患者取消
export function forCancel(cond) {
  return ajax.POST(`${hisAppoint}cancel`, cond);
}

// 3.4.10 排班号源列表查询
export function forList(cond) {
  return ajax.GET(`${hisAppoint}list`, cond);
}

// 3.4.11 患者预约记录查询
export function forReservedList(cond) {
  return ajax.GET(`${hisAppoint}reserved/list`, cond);
}

// 3.4.9 科室排班列表查询
export function forScheduleList(cond) {
  return ajax.GET(`${hisSchedule}/list`, cond);
}

// 无卡预约记录查询
export function forReservedNoCardList(cond) {
  return ajax.GET(`${appoint}reserved/noCard/list`, cond);
}
