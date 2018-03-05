import ajax from '../../utils/ajax';

import { apiRoot } from '../../utils/config';

export async function loadMaterialInfo() {
  return ajax.GET(`${apiRoot.material}settings/materialInfo/list`);
}

export async function loadMaterialInfoPage(start, limit, query, chanel) {
  return ajax.GET(`${apiRoot.material}settings/materialInfo/page/${chanel}/${start}/${limit}`, query || {});
}

export async function saveMaterialInfo(data, chanel) {
  return data.id
    ? ajax.POST(`${apiRoot.material}settings/materialInfo/update`, data)
    : ajax.POST(`${apiRoot.material}settings/materialInfo/save/${chanel}`, data);
}

export async function deleteMaterialInfo(id) {
  return ajax.DELETE(`${apiRoot.material}settings/materialInfo/remove/${id}`);
}

export async function deleteAllMaterialInfos(ids) {
  return ajax.DELETE(`${apiRoot.material}settings/materialInfo/removeAll`, ids);
}
