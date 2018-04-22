import { get } from '../../utils/Request';
import { schedule } from '../RequestTypes';

export async function forList(query) {
  // 3.4.9 排班列表查询
  return get(`${schedule().list}`, query);
}
