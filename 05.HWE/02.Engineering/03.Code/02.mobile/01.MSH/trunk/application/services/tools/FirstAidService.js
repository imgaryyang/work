/**
 * 配置所有后台请求路径s
 */
import { get } from '../../utils/Request';
import { firstAid } from '../RequestTypes';

export async function loadByKeyWords(query) {
  return get(`${firstAid().listByKeyWords}`, query);
}


export async function listFirstAidByType(query) {
  return get(`${firstAid().listFirstAidByType}`, query);
}
export async function loadSecondAidType(query) {
  return get(`${firstAid().loadSecondAidType}`, query);
}
export async function loadFirstAidType() {
  return get(`${firstAid().loadFirstAidType}`);
}

