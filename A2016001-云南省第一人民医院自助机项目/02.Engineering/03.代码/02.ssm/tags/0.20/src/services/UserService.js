import ajax from '../utils/ajax';
const _API_ROOT = "/api/ssm/client/";

/**
 * 登录
 */
export async function login (user) {
  return ajax.POST(_API_ROOT + 'user/login',user);
}

/**
 * 登出
 */
export async function logout () {
  return ajax.GET(_API_ROOT + 'user/logout');
}

