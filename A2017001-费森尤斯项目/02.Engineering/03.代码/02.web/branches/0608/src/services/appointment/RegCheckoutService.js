import ajax from '../../utils/ajax';

import { apiRoot } from '../../utils/config';

export async function getUnCheckoutInfo(invoiceSource) {
  return ajax.GET(`${apiRoot.checkOut}/get/${invoiceSource}`);
}

export async function getCheckoutInfo(invoiceSource) {
  return ajax.GET(`${apiRoot.checkOut}/get/checked/${invoiceSource}`);
}

export async function checkout(data) {
  return ajax.POST(`${apiRoot.checkOut}/create/checkOut`, data);
}

export async function unCheckout(balanceId) {
  return ajax.POST(`${apiRoot.checkOut}/update/${balanceId}`);
}
