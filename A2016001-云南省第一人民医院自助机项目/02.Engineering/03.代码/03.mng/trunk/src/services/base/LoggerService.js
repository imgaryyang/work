import ajax from '../../utils/ajax';
const _API_ROOT = "/api/ssm/treat/logger";

export async function loadLoggerPage(start,limit,query) {
	return ajax.GET(_API_ROOT+'/page/'+start+'/'+limit,query||{});
}