import ajax from '../utils/ajax';
//const _API_ROOT = "/api/ssm/client/";
const _API_ROOT = "/api/ssm/treat/";

/**
 * 查询门诊病历记录
 */
export async function loadCaseHistoryRecords () {
  //return ajax.GET(_API_ROOT + 'outpatient/loadCaseHistoryRecords');
	return ajax.GET(_API_ROOT + 'medicalRecord/page/1/20');
}


/**
 * 查询门诊病历信息
 */
export async function loadCaseHistory (payload) {
  //return ajax.GET(_API_ROOT + 'outpatient/loadCaseHistory');
	return ajax.GET(_API_ROOT + 'medicalRecord/'+payload.id);
}


/**
 * 查询检查记录
 */
export async function loadCheckRecords () {
  //return ajax.GET(_API_ROOT + 'outpatient/loadCheckRecords');
	return ajax.GET(_API_ROOT + 'assay/page/1/20');
}


/**
 * 查询检查信息
 */
export async function loadCheckInfo (payload) {
  //return ajax.GET(_API_ROOT + 'outpatient/loadCheckInfo');
	return ajax.GET(_API_ROOT + 'assay/'+payload.id);
}

/**
 * 查询检验打印信息
 */
export async function loadCheckInfoForPrint (payload) {
  //return ajax.GET(_API_ROOT + 'outpatient/loadCheckInfo');
	return ajax.GET(_API_ROOT + 'assay/'+payload.id);
}

