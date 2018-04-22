/**
 * 配置所有后台请求路径s
 */
import { get } from '../../utils/Request';
import { disease } from '../RequestTypes';

export async function loadDiseaseByKeyWords(query) {
  return get(`${disease().listByKeyWords}`, query);
}

export async function loadCommonDisease() {
  return get(`${disease().listCommonDisease}`);
}

export async function loadDiseaseByPart(query) {
  return get(`${disease().listByPart}`, query);
}
export async function loadPart() {
  return get(`${disease().listPart}`);
}

