import ajax from '../../utils/ajax';

import { apiRoot } from '../../utils/config';

export async function findChargeDetail(data) {
  return ajax.POST(`${apiRoot.optCharge}findChargeDetail`,data);
}
export async function findRecipeList(regId) {
  return ajax.GET(`${apiRoot.optCharge}findRecipeList/${regId}`);
}
export async function getCurrentRegId(medicalCardNo) {
  return ajax.GET(`${apiRoot.optCharge}getCurrentRegId/${medicalCardNo}`);
}
export async function submitCharge(data) {
  return ajax.POST(`${apiRoot.optCharge}submitCharge`, data);
}
export async function saveCharge(data) {
  return ajax.POST(`${apiRoot.optCharge}saveCharge`, data);
}
export async function submitItemCharge(data) {
  return ajax.POST(`${apiRoot.optCharge}submitItemCharge`, data);
}
export async function groupDetailList(comboId) {
  return ajax.GET(`${apiRoot.optCharge}groupDetaillist/${comboId}`);
}
export async function saveItemToTemplate(data) {
  return ajax.POST(`${apiRoot.optCharge}saveChargeToTemplate`, data);
}
export async function getRecipeId() {
  return ajax.GET(`${apiRoot.optCharge}getRecipeId`);
}
export async function getDrugStock(query) {
  return ajax.POST(`${apiRoot.optCharge}getDrugStock`, query);
}
