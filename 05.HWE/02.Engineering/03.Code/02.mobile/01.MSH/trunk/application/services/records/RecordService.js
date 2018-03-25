/**
 * 配置所有后台请求路径s
 */
import { get } from '../../utils/Request';
import { hisTest, records } from '../RequestTypes';

export async function list(query) {
  return get(`${records().list}`, query);
}

export async function diagnoseList(query) {
  return get(`${records().diagnoseList}`, query);
}

export async function recordList(query) {
  return get(`${records().recordList}`, query);
}

