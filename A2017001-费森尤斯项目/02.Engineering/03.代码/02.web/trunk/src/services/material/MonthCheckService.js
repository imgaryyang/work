import ajax from '../../utils/ajax';
import { apiRoot } from '../../utils/config';

export async function loadPage(start, limit, query) {
  return ajax.GET(`${apiRoot.monthCheck}page/${start}/${limit}`, query || {});
}

export async function create(data) {
  return ajax.POST(`${apiRoot.monthCheck}create`, data);
}

export async function findMonthCheckTime(data) {
  return ajax.GET(`${apiRoot.monthCheck}findMonthCheckTime`, data || {});
}
