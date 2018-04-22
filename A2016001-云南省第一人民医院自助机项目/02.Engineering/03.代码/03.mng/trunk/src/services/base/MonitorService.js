import ajax from '../../utils/ajax';
const _API_ROOT = "/api/ssm/base/redis";

export async function loadMonitorList(start, limit, query) {
	return ajax.GET(_API_ROOT+'/list/'+start+'/'+limit, query||{} );
}
export async function loadMonitorMyList(start, limit, query) {
	return ajax.GET(_API_ROOT+'/myList/'+start+'/'+limit,query||{});
}
