import ajax from '../../utils/ajax';
const _API_ROOT = "/api/ssm/trouble/";


/**
 * 查询材料分页查询
 */
export async function loadTroublePage(start, limit, query) {
	console.log(start,limit,query);
	return ajax.GET( _API_ROOT + 'page/' + start + '/' + limit, query || {} );
}
/**
 * 查询所有材料
 */
export async function troubleList(param) {
  return ajax.GET(_API_ROOT+'/trouble/list',param);
}
/**
 * 删除材料信息
 */
export async function deleteTrouble(ids) {
  return ajax.DELETE(_API_ROOT+'/removeAll/',ids);
}
/**
 * 保存材料信息
 */
export async function saveTrouble(trouble) {
  return ajax.POST(_API_ROOT+'/create/',trouble);
}

