/**
 * 配置所有后台请求路径s
 */
import { get } from '../../utils/Request';
import { news } from '../RequestTypes';

export async function page(start, limit, query) {
  return get(`${news().list}/${start}/${limit}`, query);
}
