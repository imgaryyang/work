import ajax from '../utils/ajax';
const _API_ROOT = "/api/ssm/client/";

/**
 * 查询门诊病历记录
 */
export async function loadCaseHistoryRecords () {
  return ajax.GET(_API_ROOT + 'outpatient/loadCaseHistoryRecords');
}


/**
 * 查询门诊病历信息
 */
export async function loadCaseHistory () {
  return ajax.GET(_API_ROOT + 'outpatient/loadCaseHistory');
}


/**
 * 查询检查记录
 */
export async function loadCheckRecords () {
  return ajax.GET(_API_ROOT + 'outpatient/loadCheckRecords');
}


/**
 * 查询检查信息
 */
export async function loadCheckInfo () {
  return ajax.GET(_API_ROOT + 'outpatient/loadCheckInfo');
}


