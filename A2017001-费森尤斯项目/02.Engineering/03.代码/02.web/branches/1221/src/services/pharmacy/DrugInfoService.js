import ajax from '../../utils/ajax';

import { apiRoot } from '../../utils/config';

export async function loadDrugInfo() {
  return ajax.GET(`${apiRoot.medicine}/list`);
}

export async function loadDrugInfoPage(start, limit, query, chanel) {
  return ajax.GET(`${apiRoot.medicine}/page/${chanel}/${start}/${limit}`, query || {});
}

export async function saveDrugInfo(data, chanel) {
  return data.id
    ? ajax.POST(`${apiRoot.medicine}/update`, data)
    : ajax.POST(`${apiRoot.medicine}/create/${chanel}`, data);
}

export async function deleteDrugInfo(id) {
  return ajax.DELETE(`${apiRoot.medicine}/remove/${id}`);
}

export async function deleteAllDrugInfos(ids) {
  return ajax.DELETE(`${apiRoot.medicine}/removeAll`, ids);
}
