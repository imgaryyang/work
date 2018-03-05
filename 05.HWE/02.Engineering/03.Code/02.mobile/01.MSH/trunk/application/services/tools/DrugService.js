/**
 * 配置所有后台请求路径s
 */
import { get } from '../../utils/Request';
import { drug } from '../RequestTypes';

export async function loadDrugByKeyWords(query) {
  return get(`${drug().listByKeyWords}`, query);
}

export async function loadCommonDrugType() {
  return get(`${drug().listCommonDrugType}`);
}

export async function loadDrugByType(query) {
  return get(`${drug().listDrugByType}`, query);
}
export async function loadDrugType(query) {
  console.log(query);
  return get(`${drug().listByDrugType}`, query);
}
export async function loadRescueDrug() {
  return get(`${drug().listRescueDrug}`);
}

