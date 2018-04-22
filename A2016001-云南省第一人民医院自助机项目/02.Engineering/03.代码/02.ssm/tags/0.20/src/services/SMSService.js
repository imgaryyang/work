

import ajax from '../utils/ajax';

const _API_ROOT = "/api/ssm/treat/sms/";
/**
 * 获取验证码
 * @param data
 * @return
 */
export async function sendAuthCode(phoneNo) {
  return ajax.GET(_API_ROOT+'verifyCode/'+phoneNo);
}
/**
 * 校验验证码
 * @param data
 * @return
 *
 */
export async function verifyAuthCode(param) {
	return ajax.POST(_API_ROOT+'verify/',param);
}


/*import request from '../utils/request';
export async function loadMenus(params) {
  return request('api/menu/list');
}*/