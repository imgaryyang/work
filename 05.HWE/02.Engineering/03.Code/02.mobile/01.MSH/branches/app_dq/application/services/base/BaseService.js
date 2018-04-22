import { get, post } from '../../utils/Request';
import { base } from '../RequestTypes';

export async function sectionDescs(start, limit, data) {
  return get(`${base().sectionDescPage}/${start}/${limit}`, data);
}

export async function contacts(start, limit, data) {
  return get(`${base().contactPage}/${start}/${limit}`, data);
}

// 发送验证码
export async function sendSecurityCode(data) {
  return post(`${base().sendSecurityCode}/`, data);
}

// 校验验证码
export async function verifySecurityCode(data) {
  return post(`${base().verifySecurityCode}/`, data);
}

// 轮播广告位
export async function ads() {
  return get(`${base().ads}`);
}
