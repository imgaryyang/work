import ajax from '../../utils/ajax';
import { apiRoot } from '../../utils/config';

export async function loadInvoicePage(start, limit, query) {
  return ajax.GET(`${apiRoot.invoiceReprint}/page/${start}/${limit}`, query || {});
}

export async function loadChargeDetailPage(start, limit, query) {
  return ajax.GET(`${apiRoot.invoiceReprint}/chargeDetail/page/${start}/${limit}`, query || {});
}

export async function loadPayWayPage(start, limit, query) {
  return ajax.GET(`${apiRoot.invoiceReprint}/payWay/page/${start}/${limit}`, query || {});
}

export async function refund(data) {
  return ajax.POST(`${apiRoot.invoiceReprint}/refund`, data);
}

export async function reprint(data) {
  return ajax.POST(`${apiRoot.invoiceReprint}/reprint`, data);
}
