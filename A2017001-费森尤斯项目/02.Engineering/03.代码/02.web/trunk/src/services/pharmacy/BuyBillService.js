import ajax from '../../utils/ajax';

import { apiRoot } from '../../utils/config';

export async function listStockWarnDurg(query) {
  return ajax.GET(`${apiRoot.buyBill}/listStockWarnDurg`, query || {});
}

export async function loadBuyBillPage(start, limit, query) {
  return ajax.GET(`${apiRoot.buyBill}/page/${start}/${limit}`, query || {});
}

export async function loadBuyBill(query) {
  return ajax.GET(`${apiRoot.buyBill}/list`, query || {});
}

export async function SaveBuyBillList(data) {
	  return ajax.POST(`${apiRoot.buyBill}/create`, data || {});
}
export async function loadCompanyInfo(data) {
	return ajax.GET(`${apiRoot.buyBill}/load`, data || {});
}

export async function UpdInstock(data) { 
	  return ajax.POST(`${apiRoot.buyBill}/updateInstock`, data || {});
}

export async function updInstock2(data) { 
	  return ajax.POST(`${apiRoot.buyBill}/updateInstock2`, data || {});
}

export async function UpdBackInstock(data) { 
	  return ajax.POST(`${apiRoot.buyBill}/updateBackInstock`, data || {});
}
export async function deleteBill(id) {
  return ajax.DELETE(`${apiRoot.buyBill}/remove/${id}`);
}
