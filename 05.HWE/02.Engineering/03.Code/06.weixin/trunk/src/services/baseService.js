import ajax from '../utils/ajax';

export function login(openid) {
  return ajax.POST('/api/hwe/weixin/common/login', { openid });
}
export function register(query) {
  return ajax.POST('/api/hwe/weixin/common/register', query);
}
export function getInfo(query) {
  return ajax.GET(`/api/hwe/app/base/${query}`);
}
export function doSave(data) {
  console.info('doSave', data);
  return ajax.POST('/api/hwe/weixin/common/doSave', data || {});
}
export function updateProfiles() {
  console.info('updateProfiles');
  return ajax.GET('/api/hwe/weixin/common/getProfiles');
}
export function logout() {
  console.info('logout');
  return ajax.GET('/api/hwe/weixin/common/logout');
}
