import ajax from '../utils/ajax';
const _API_ROOT = "/api/ssm/treat/appointment";

/**
 * 获取排班科室 所有
 */
export async function loadDeptList (payload) {//暂无查询条件
  return ajax.GET(_API_ROOT + '/department/list', {});
}

/**
 * 获取排班医生 所有
 */
export async function loadDoctorList (payload) {//暂无查询条件
  return ajax.GET(_API_ROOT + '/doctor/list', {});
}

/**
 * 获取号源（排班）信息
 */
export async function loadSchedulePage (payload) {//分页
  var {start,limit} = payload;
  delete payload.limit;
  delete payload.start;
  return ajax.GET(_API_ROOT + '/resource/page/'+start+'/'+limit, {data:payload});
}
/**
 * 获取时间段信息
 */
export async function loadTimePeriodPage (payload) {
  var {start,limit} = payload;
  delete payload.limit;
  delete payload.start;
  return ajax.GET(_API_ROOT + '/timePeriod/page/'+start+'/'+limit, {data:payload});
}
/**
 * 获取时间段信息
 */
export async function loadTimePeriodBySchedule (payload) {
  return ajax.GET(_API_ROOT + '/timePeriods/'+payload.scheduleId);
}
/**
 * 生成订单
 */
export async function createOrder (payload) {
  return ajax.POST(_API_ROOT + '/createOrder', {});
}
/**
 * 预约
 */
export async function book (payload) {
  return ajax.POST(_API_ROOT + '/book', payload);
}
/**
 * 预约签到
 */
export async function forSign (payload) {
  return ajax.GET(_API_ROOT + '/sign/{timePeriodId}', {});
}
/**
 * 登记预约结果
 */
export async function regAppointment (payload) {
  return ajax.GET(_API_ROOT + 'appointment/reg', {});
}
/**
 * 预约信息查询(未签到预约、历史预约等)
 */
export async function loadAppiontments (payload) {
  return ajax.GET(_API_ROOT + '/page/{start}/{limit}', {});
}
/**
 * 未签到预约记录查询
 * @param data
 * @return
 */
export async function unsignedList (payload) {
  return ajax.GET(_API_ROOT + '/unsigned/list', {});
}
/**
 * 获取预约记录
 */
export async function loadAppointmentRecords (payload) {
	var {start,limit} = payload;
	delete payload.limit;
	delete payload.start;
	//return ajax.GET(_API_ROOT + '/page/'+start+'/'+limit, {data:payload});
	return ajax.GET(_API_ROOT + '/page/1/20', {data:payload});
}

/**
 * 预约详细信息查询
 */
export async function appiontmentInfo (payload) {
  return ajax.GET(_API_ROOT + '/info/{timePeriodId}', {});
}

/**
 * 签到
 */
export async function sign (payload) {
  return ajax.POST(_API_ROOT + '/sign', {});
}

/**
 * 取消预约
 */
export async function cancel (payload) {
	return ajax.POST(_API_ROOT + '/cancel',payload);
}
