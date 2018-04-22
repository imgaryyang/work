import ajax from '../../utils/ajax';
const _API_ROOT = "/api/ssm/pay/cash/";

export async function loadBatchs(start, limit, query) {
  return ajax.GET( _API_ROOT + 'batch/page/' + start + '/' + limit, query || {} );
}

export async function loadDetails(start, limit, query) {
  return ajax.GET( _API_ROOT + 'detail/page/' + start + '/' + limit, query || {} );
}

export async function mngCreateBatch(machineId) {
  return ajax.GET( '/api/ssm/pay/settle/cash/mngCreateBatch/'+machineId );
}