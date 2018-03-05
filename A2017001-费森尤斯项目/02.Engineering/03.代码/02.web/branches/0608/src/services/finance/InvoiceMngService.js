/* eslint linebreak-style: ["error", "windows"]*/
import ajax from '../../utils/ajax';
import { apiRoot } from '../../utils/config';

export async function loadInvoice() {
  return ajax.GET(`${apiRoot.invoiceMng}/list`);
}
export async function findCurrentInvoice(data) {
	return ajax.GET(`${apiRoot.invoiceMng}/findCurrentInvoice`,data);
}

export async function loadInvoicePage(start, limit, query) {
  return ajax.GET(`${apiRoot.invoiceMng}/page/${start}/${limit}`, query || {});
}

export async function saveInvoice(data) {
  return data.id
    ? ajax.POST(`${apiRoot.invoiceMng}/update`, data)
    : ajax.POST(`${apiRoot.invoiceMng}/create`, data);
}

export async function deleteInvoice(id) {
  return ajax.DELETE(`${apiRoot.invoiceMng}/remove/${id}`);
}

export async function updateInvoice(id) {
  return ajax.POST(`${apiRoot.invoiceMng}/update/${id}`);
}

export async function deleteAllInvoices(ids) {
  return ajax.DELETE(`${apiRoot.invoiceMng}/removeAll`, ids);
}
