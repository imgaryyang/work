/**
 * 配置所有后台请求路径s
 */
import { get } from '../../utils/Request';
import { vaccine } from '../RequestTypes';

export async function loadByKeyWords(query) {
  return get(`${vaccine().listByKeyWords}`, query);
}


export async function loadAll() {
  return get(`${vaccine().loadAll}`);
}
export async function loadRecent() {
  return get(`${vaccine().listRecent}`);
}

