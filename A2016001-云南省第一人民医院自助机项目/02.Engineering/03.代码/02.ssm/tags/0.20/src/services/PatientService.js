import ajax from '../utils/ajax';
const _API_ROOT = "/api/ssm/treat/patient";

/**
 * 查询账户基本信息
 */
export async function loadAcctInfo () {
  return ajax.GET(_API_ROOT + '/info');
}
/**
 * 患者登录
 */
export async function patientLogin () {
  return ajax.POST(_API_ROOT + '/login');
}
/**
 * 建立档案
 */
export async function createProfile (param) {
  return ajax.POST(_API_ROOT + '/profile/create',param);
}

/**
 * 开通预存
 */
export async function openDeposit (param) {
  return ajax.GET(_API_ROOT + '/openDeposit',param);
}



