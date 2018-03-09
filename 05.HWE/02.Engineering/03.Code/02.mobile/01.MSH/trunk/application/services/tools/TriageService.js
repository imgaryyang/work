/**
 * 配置所有后台请求路径s
 */
import { get } from '../../utils/Request';
import { triage } from '../RequestTypes';

export async function listBigSymptomsByPartId(query) {
  return get(`${triage().listBigSymptomsByPartId}`, query);
}

export async function listSmallSymptomsByBigSymptomId(query) {
  return get(`${triage().listSmallSymptomsByBigSymptomId}`, query);
}

export async function listDiseasesBySymptomIds(query) {
  return get(`${triage().listDiseasesBySymptomIds}`, query);
}

// export async function loadCommonDisease() {
//     return get(`${disease().listCommonDisease}`);
// }
//
// export async function loadDiseaseByPart(query) {
//     return get(`${disease().listByPart}`, query);
// }
// export async function loadPart() {
//     return get(`${disease().listPart}`);
// }

