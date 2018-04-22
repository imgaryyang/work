import ajax from '../../utils/ajax';
const _API_ROOT = "/api/ssm/base/material/";


/**
 * 查询材料分页查询
 */
export async function loadMaterialPage(start, limit, query) {
	return ajax.GET( _API_ROOT + 'page/' + start + '/' + limit, query || {} );
}
/**
 * 查询所有材料
 */
export async function loadMaterials() {
	return ajax.GET( _API_ROOT + 'loadMaterials' );
}
/**
 * 保存材料信息
 */
export async function saveMaterial(data) {
	if(data.id)return ajax.POST( _API_ROOT + 'update', data );
	return ajax.POST( _API_ROOT + 'create', data );
}
/**
 * 查询材料数量
 */
export async function selectAccount(data) {
	return ajax.GET( _API_ROOT + 'selectAccount/'+data );
}
/**
 * 删除材料信息
 */
export async function deleteMaterial(data) {
	  return ajax.DELETE( _API_ROOT + 'delete', data );
}

