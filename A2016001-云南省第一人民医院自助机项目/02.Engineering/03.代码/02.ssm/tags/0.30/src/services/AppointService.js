import ajax from '../utils/ajax';
const _API_ROOT = "/api/ssm/treat/appointment";

/**
 * 获取排班科室 所有
 */
export async function loadDeptList (payload) {//暂无查询条件
  return ajax.GET(_API_ROOT + '/department/list', {});
}
/**
 * 获取排班信息
 */
export async function loadScheduleList ( query ) {
  return ajax.GET(_API_ROOT + '/schedule/dept', query);
}

/**
 * 获取号源信息
 */
export async function loadAppointSources (query) {//分页
  return ajax.GET(_API_ROOT + '/appointment/sources', query);
}
/**
 * 预约登记
 */
export async function appointBook (appoint) {
  return ajax.POST(_API_ROOT + '/book', appoint);
}
/**
 * 预约历史
 */
export async function loadAppointHistory (query) {
  return ajax.GET(_API_ROOT + '/appointment/list', query);
}
/**
 * 预约签到
 */
export async function appointSign (appoint) {
  return ajax.POST(_API_ROOT + '/sign', appoint);
}
/**
 * 取消预约
 */
export async function appointCancel (appoint) {
  return ajax.POST(_API_ROOT + '/cancel', appoint);
}
