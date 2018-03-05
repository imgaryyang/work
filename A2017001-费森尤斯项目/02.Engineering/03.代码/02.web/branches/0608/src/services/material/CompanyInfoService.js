import ajax from '../../utils/ajax';
import { apiRoot } from '../../utils/config';

export async function loadCompanyInfo() {
  return ajax.GET(`${apiRoot.material}settings/manufacturerMng/list`);
}

export async function loadCompanyInfoPage(start, limit, query) {
  return ajax.GET(`${apiRoot.material}settings/manufacturerMng/page/${start}/${limit}`, query || {});
}

export async function saveCompanyInfo(data) {
  return data.id
    ? ajax.POST(`${apiRoot.material}settings/manufacturerMng/update`, data)
    : ajax.POST(`${apiRoot.material}settings/manufacturerMng/create`, data);
}

export async function deleteCompanyInfo(id) {
  return ajax.DELETE(`${apiRoot.material}settings/manufacturerMng/remove/${id}`);
}

export async function deleteAllCompanyInfos(ids) {
  return ajax.DELETE(`${apiRoot.material}settings/manufacturerMng/removeAll`, ids);
}
