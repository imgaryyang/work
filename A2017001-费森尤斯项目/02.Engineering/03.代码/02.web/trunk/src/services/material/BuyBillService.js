import ajax from '../../utils/ajax';

import { apiRoot } from '../../utils/config';

const apiMatBuyBill = '/api/hcp/material/buyBill';

export async function loadBuyBillPage(start, limit, query) {
  return ajax.GET(`${apiMatBuyBill}/page/${start}/${limit}`, query || {});
}

export async function loadBuyBill(query) {
  return ajax.GET(`${apiMatBuyBill}/list`, query || {});
}

export async function SaveBuyBillList(data) {
  return ajax.POST(`${apiMatBuyBill}/create`, data || {});
}
export async function loadCompanyInfo(data) {
  return ajax.GET(`${apiMatBuyBill}/load`, data || {});
}

export async function UpdInstock(data) {
  return ajax.POST(`${apiMatBuyBill}/updateInstock`, data || {});
}
export async function UpdBackInstock(data) {
  return ajax.POST(`${apiMatBuyBill}/updateBackInstock`, data || {});
}
export async function deleteBill(id) {
  return ajax.DELETE(`${apiMatBuyBill}/remove/${id}`);
}
// add by jiangyong
export async function MatInstockCommit(data) {
  return ajax.POST(`${apiMatBuyBill}/matInstockCommit`, data || {});
}
