import ajax from '../utils/ajax';
const _API_ROOT = "/api/ssm/base/auth";

/**
 * 查询门诊病历记录
 */
export async function machineConfig() {
	return ajax.GET(_API_ROOT + '/machine/config');
}
export async function machineLogin() {
	return ajax.GET(_API_ROOT + '/machine/info');
}
export async function machineRegister(machine) {
	return ajax.POST('/api/ssm/base/machine/register',machine);
}

