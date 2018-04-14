import ajax from '../utils/ajax';

export function loginByOpenId(openid) {
  return ajax.POST('/api/hwe/weixin/common/login', { openid });
}

export function loginByUserId(userId) {
  return ajax.POST('/api/hwe/zfb/common/login', { userId });
}

export function registerByOpenId(query) {
  return ajax.POST('/api/hwe/weixin/common/register', query);
}
export function registerByUserId(query) {
  console.log('registerByUserId', query);
  return ajax.POST('/api/hwe/zfb/common/register', query);
}
export function getInfo(query) {
  return ajax.GET(`/api/hwe/app/base/${query}`);
}
export function doSave(data) {
  console.info('doSave', data);
  return ajax.POST('/api/hwe/weixin/common/doSave', data || {});
}
export function updateProfiles() {
  return ajax.GET('/api/hwe/weixin/common/getProfiles');
}
export function logout() {
  console.info('logout');
  return ajax.GET('/api/hwe/weixin/common/logout');
}

export function image(imgName) {
  return `/api/images/${imgName}`;
}

/**
 * 发送验证码
 * @param data
 * @returns {*}
 */
export function sendSecurityCode(data) {
  return ajax.POST('/api/hwe/base/sms/securityCode', data || {});
}

/**
 * 校验验证码
 * @param data
 * @returns {*}
 */
export function verifySecurityCode(data) {
  return ajax.POST('/api/hwe/base/sms/verifySecurityCode', data || {});
}

/**
 * 验证通过后登录
 * @param data
 * @returns {*}
 */
export function loginAfterVerifySecurityCode(data) {
  if (data.openid) return ajax.POST('/api/hwe/weixin/common/login', data);
  else return ajax.POST('/api/hwe/zfb/common/login', data);
}

/**
 * 重载用户信息
 * @returns {*}
 */
export function reloadUserInfo() {
  return ajax.GET('/api/hwe/app/getUser');
}
