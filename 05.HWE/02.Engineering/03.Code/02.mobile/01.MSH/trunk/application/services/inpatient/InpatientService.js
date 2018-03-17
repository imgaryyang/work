/**
 * 配置所有后台请求路径
 */
import { get } from '../../utils/Request';
import { inpatient } from '../RequestTypes';

export async function loadHisInpatientInfo(query) {
  return get(`${inpatient().loadHisInpatientInfo}`, query);
}

export async function loadHisInpatientDailylist(query) {
  return get(`${inpatient().loadHisInpatientDailylist}`, query);
}

