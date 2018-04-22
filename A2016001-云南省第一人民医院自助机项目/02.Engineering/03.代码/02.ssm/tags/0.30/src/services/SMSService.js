

import ajax from '../utils/ajax';

const _API_ROOT = "/api/ssm/base/sms/";
/**
 * 获取验证码
 * @param data
 * @return
 */
export async function sendAuthCode(msg) {
  return ajax.POST(_API_ROOT+'sendCode/',msg);
}
/**
 * 校验验证码
 * @param data
 * @return
 *
 */
export async function verifyAuthCode(param) {
	return ajax.POST(_API_ROOT+'validCode/',param);
}


/*import request from '../utils/request';
export async function loadMenus(params) {
  return request('api/menu/list');
}*/