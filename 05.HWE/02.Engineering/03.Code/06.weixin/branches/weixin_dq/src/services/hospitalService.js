import ajax from '../utils/ajax';

/**
 * 根据id取医院信息
 * @param id
 * @returns {*}
 */
export function getHospById(id) {
  return ajax.GET(`/api/hwe/treat/hospital/${id}`);
}

/**
 * 根据条件查询科室列表
 * @param start
 * @param limit
 * @param query
 * @returns {*}
 */
export function getDepts(start, limit, query) {
  return ajax.GET(`/api/hwe/treat/department/page/${start}/${limit}`, query || {});
}

/**
 * 查询所有科室信息
 * 只返回 id type name brief
 * @returns {*}
 */
export function getDeptsBrief(query) {
  return ajax.GET('/api/hwe/treat/department/listBrief', query || {});
}

/**
 * 根据条件查询医生列表
 * @param start
 * @param limit
 * @param query
 * @returns {*}
 */
export function getDoctors(start, limit, query) {
  return ajax.GET(`/api/hwe/treat/doctor/page/${start}/${limit}`, query || {});
}
