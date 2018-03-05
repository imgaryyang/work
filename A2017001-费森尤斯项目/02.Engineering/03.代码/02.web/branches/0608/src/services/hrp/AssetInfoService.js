import ajax from '../../utils/ajax';

import { apiRoot } from '../../utils/config';

export async function loadPage(start, limit, query) {
  return ajax.GET(`${apiRoot.hrp}settings/assetInfo/page/${start}/${limit}`, query || {});
}

export async function save(data) {
  return ajax.POST(`${apiRoot.hrp}settings/assetInfo/save`, data);
}

export async function removeAsset(id) {
  return ajax.DELETE(`${apiRoot.hrp}settings/assetInfo/remove/${id}`);
}

export async function removeSelectedAssets(ids) {
  return ajax.DELETE(`${apiRoot.hrp}settings/assetInfo/removeSelected`, ids);
}
