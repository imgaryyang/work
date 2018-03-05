import ajax from '../../utils/ajax';

import { apiRoot } from '../../utils/config';

export async function loadMaterialInfo() {
  return ajax.GET(`${apiRoot.material}settings/materialInfo/list`);
}

export async function loadMaterialInfoPage(start, limit, query) {
  return ajax.GET(`${apiRoot.material}settings/materialInfo/page/${start}/${limit}`, query || {});
}

export async function saveMaterialInfo(data) {
  return ajax.POST(`${apiRoot.material}settings/materialInfo/save`, data);
}

export async function deleteMaterialInfo(id) {
  return ajax.DELETE(`${apiRoot.material}settings/materialInfo/remove/${id}`);
}

export async function deleteAllMaterialInfos(ids) {
  return ajax.DELETE(`${apiRoot.material}settings/materialInfo/removeAll`, ids);
}
