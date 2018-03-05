/**
 * 配置所有后台请求路径s
 */
import { get } from '../../utils/Request';
import { payRecords } from '../RequestTypes';

export async function getPreRecords(query) {
  return get(`${payRecords().getPreRecords}`, query);
}

export async function getConsumeRecords(query) {
  return get(`${payRecords().getConsumeRecords}`, query);
}
