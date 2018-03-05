import ajax from '../../utils/ajax';
import { apiRoot } from '../../utils/config';

export async function loadChargeInvoicePage(start, limit, query) {
  return ajax.GET(`${apiRoot.chargeDetail}invoice/page/${start}/${limit}`, query || {});
}

export async function loadChargeDetailPage(start, limit, query) {
  return ajax.GET(`${apiRoot.chargeDetail}page/${start}/${limit}`, query || {});
}

export async function dispense(recipeId) {
  return ajax.POST(`${apiRoot.drugDispense}done`, recipeId);
}
