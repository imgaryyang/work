import ajax from '../../utils/ajax';
import { apiRoot } from '../../utils/config';

export async function loadCompanyInfo() {
  return ajax.GET(`${apiRoot.manufacturer}/list`);
}

export async function loadCompanyInfoPage(start, limit, query) {
  return ajax.GET(`${apiRoot.manufacturer}/page/${start}/${limit}`, query || {});
}

export async function saveCompanyInfo(data) {
  return data.id
    ? ajax.POST(`${apiRoot.manufacturer}/update`, data)
    : ajax.POST(`${apiRoot.manufacturer}/create`, data);
}

export async function deleteCompanyInfo(id) {
  return ajax.DELETE(`${apiRoot.manufacturer}/remove/${id}`);
}

export async function deleteAllCompanyInfos(ids) {
  return ajax.DELETE(`${apiRoot.manufacturer}/removeAll`, ids);
}
