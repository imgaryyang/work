import ajax from '../utils/ajax';
const _API_ROOT = "/api/ssm/client/";

/**
 * 载入排班信息
 */
export async function loadArranges (payload) {
	console.log('in appointment service ...............')
	console.log(payload);

  return ajax.GET(_API_ROOT + 'arrange/list', {
  	deptId:    payload['selectedDept']['DeptId'],
  	date:      payload['selectedDate'],
  	dayPeriod: payload['selectedDayPeriod'],
  	doctorId:  payload['selectedDoctor']['DoctorId'],
  });
}

/**
 * 载入可预约时段
 */
export async function loadArrangeTimePeriod (payload) {
  return ajax.GET(_API_ROOT + 'arrangeTimePeriod/list', {});
}

/**
 * 登记预约结果
 */
export async function regAppointment (payload) {
  return ajax.GET(_API_ROOT + 'appointment/reg', {});
}

/**
 * 获取预约记录
 */
export async function loadAppointmentRecords (payload) {
  return ajax.GET(_API_ROOT + 'appointment/list', {});
}


/**
 * 签到
 */
export async function sign (payload) {
  return ajax.GET(_API_ROOT + 'appointment/sign', {});
}

/**
 * 取消预约
 */
export async function cancel (payload) {
  return ajax.GET(_API_ROOT + 'appointment/cancel', {});
}
