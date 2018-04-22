import ajax from '../utils/ajax';
const _API_ROOT = "/api/ssm/treat/medicalRecord";

/**
 * 查询门诊病历记录
 */
export async function loadCaseHistory(record) {
	return ajax.GET(_API_ROOT + '/list',record);
}

/**
 * 查询门诊病历详情
 */
export async function loadCaseDetail (record) {
	return ajax.GET(_API_ROOT + '/info',record);
}

/**
 * 查询门诊病历详情
 */
export async function printCallback (record) {
	return ajax.PUT(_API_ROOT + '/print/'+record.recordId);
}
