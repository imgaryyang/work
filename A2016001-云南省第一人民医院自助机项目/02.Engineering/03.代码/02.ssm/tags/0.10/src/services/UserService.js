import ajax from '../utils/ajax';
const _API_ROOT = "/api/ssm/client/";

/**
 * 登录
 */
export async function login () {
  return ajax.GET(_API_ROOT + 'user/login');
}

/**
 * 登出
 */
export async function logout () {
  return ajax.GET(_API_ROOT + 'user/logout');
}

