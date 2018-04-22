import ajax from '../../utils/ajax';
const _API_ROOT_OUT = "/api/ssm/troubleDetail/";

/**
 * 出库信息分页查询
 */
export async function loadTroubleDetailPage(start, limit, query) {
	return ajax.GET( _API_ROOT_OUT + 'page/' + start + '/' + limit, query || {} );
}
/**
 * 保存出库信息
 */
export async function saveTroubleDetail(data) {
	if(data.id)return ajax.POST( _API_ROOT_OUT + 'update', data );
	return ajax.POST( _API_ROOT_OUT + 'create', data );
}
/**
 * 删除出库信息
 */
export async function deleteTroubleDetail(data) {
	  return ajax.DELETE( _API_ROOT_OUT + 'delete', data );
}

