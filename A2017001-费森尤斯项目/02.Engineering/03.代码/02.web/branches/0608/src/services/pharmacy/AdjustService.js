import ajax from '../../utils/ajax';

import { apiRoot } from '../../utils/config';

export async function loadAdjust() {
  return ajax.GET(`${apiRoot.adjust}list`);
}

export async function loadAdjustPage(start, limit, query) {
  return ajax.GET(`${apiRoot.adjust}page/${start}/${limit}`, query || {});
}

export async function saveAdjust(data) {
  return  ajax.POST(`${apiRoot.adjust}create`, data);
}
