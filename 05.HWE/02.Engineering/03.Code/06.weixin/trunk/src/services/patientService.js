import ajax from '../utils/ajax';

/**
 * 保存患者信息
 * @param data
 * @returns {*}
 */
export function save(data) {
  if (data.id) return ajax.POST('/api/hwe/app/userPatient/update', data || {});
  else return ajax.POST('/api/hwe/app/userPatient/create', data || {});
}

/**
 * 查询HIS档案
 * @param data
 * @returns {*}
 */
export function queryHisProfiles(data) {
  return ajax.POST('/api/hwe/treat/his/profile/list', data || {});
}

/**
 * 绑定档案
 * @param data
 * @returns {*}
 */
export function bindProfile(data) {
  return ajax.POST('/api/hwe/app/userPatient/bindProfile', data || {});
}

