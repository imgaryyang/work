import ajax from '../../utils/ajax';
const _API_ROOT = "/api/ssm/payment/check/";

export async function loadChecks(start, limit, query) {
  return ajax.GET( _API_ROOT + 'page/' + start + '/' + limit, query || {} );
}

export async function loadDetails(start, limit, query) {
  return ajax.GET( _API_ROOT + 'detail/page/' + start + '/' + limit, query || {} );
}

export async function handleSyncFile(checkRecord) {
	return ajax.POST( _API_ROOT + 'handleSync', checkRecord || {} );
}

export async function handleImport(checkRecord) {
	return ajax.POST( _API_ROOT + 'handleImport', checkRecord || {} );
}

export async function handleCheck(checkRecord) {
	return ajax.POST( _API_ROOT + 'handleCheck', checkRecord || {} );
}