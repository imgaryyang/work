import ajax from '../../utils/ajax';
const _API_ROOT_IN = "/api/ssm/base/materialDetailIn/";
const _API_ROOT_OUT = "/api/ssm/base/materialDetailOut/";

/**
 * 入库信息分页查询
 */
export async function loadInMaterialDetailPage(start, limit, query) {
	return ajax.GET( _API_ROOT_IN + 'in/page/' + start + '/' + limit, query || {} );
}
/**
 * 保存入库信息
 */
export async function saveMaterialDetail(data) {
	if(data.id)return ajax.POST( _API_ROOT_IN + 'update', data );
	return ajax.POST( _API_ROOT_IN + 'create', data );
}
/**
 * 删除入库信息
 */
export async function deleteMaterialDetail(data) {
	  return ajax.DELETE( _API_ROOT_IN + 'delete', data );
}


/**
 * 出库信息分页查询
 */
export async function loadOutMaterialDetailPage(start, limit, query) {
	return ajax.GET( _API_ROOT_OUT + 'out/page/' + start + '/' + limit, query || {} );
}
/**
 * 保存出库信息
 */
export async function saveOutMaterialDetail(data) {
	if(data.id)return ajax.POST( _API_ROOT_OUT + 'update', data );
	return ajax.POST( _API_ROOT_OUT + 'create', data );
}
/**
 * 删除出库信息
 */
export async function deleteOutMaterialDetail(data) {
	  return ajax.DELETE( _API_ROOT_OUT + 'delete', data );
}

