import ajax from '../utils/ajax';
const _API_ROOT = "/api/ssm/client/";

/**
 * 载入所有科室
 */
export async function loadDepts() {
  return ajax.GET(_API_ROOT + 'dept/list');
}

/**
 * 查询医生
 */
export async function loadDoctors() {
  return ajax.GET(_API_ROOT + 'doctor/list');
}
