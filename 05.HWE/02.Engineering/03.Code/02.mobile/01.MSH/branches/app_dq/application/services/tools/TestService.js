/**
 * 配置所有后台请求路径s
 */
import { get } from '../../utils/Request';
import { test } from '../RequestTypes';

export async function loadByKeyWords(query) {
  return get(`${test().listByKeyWords}`, query);
}


export async function loadTestList(query) {
  return get(`${test().loadTestList}`, query);
}
export async function loadSecondTestType(query) {
  return get(`${test().loadSecondTestType}`, query);
}
export async function loadTestType() {
  return get(`${test().loadTestType}`);
}

