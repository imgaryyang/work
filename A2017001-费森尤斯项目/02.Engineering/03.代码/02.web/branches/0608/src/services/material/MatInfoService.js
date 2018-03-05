import ajax from '../../utils/ajax';

//import { apiRoot } from '../../utils/config';
const apiRootMaterial = '/api/hcp/material/settings/materialInfo';

export async function loadMaterialInfo() {
  return ajax.GET(`${apiRootMaterial}/list`);
}

export async function loadMaterialInfoPage(start, limit, query) {
  return ajax.GET(`${apiRootMaterial}/page/${start}/${limit}`, query || {});
}

export async function saveMaterialInfo(data) {
  return data.id
    ? ajax.POST(`${apiRootMaterial}/update`, data)
    : ajax.POST(`${apiRootMaterial}/create`, data);
}

export async function deleteMaterialInfo(id) {
  return ajax.DELETE(`${apiRootMaterial}/remove/${id}`);
}

export async function deleteAllMaterialInfos(ids) {
  return ajax.DELETE(`${apiRootMaterial}/removeAll`, ids);
}
