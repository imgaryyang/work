/* eslint linebreak-style: ["error", "windows"]*/
import ajax from '../../utils/ajax';
import { apiRoot } from '../../utils/config';

export async function loadRegInfo() {
  return ajax.GET(`${apiRoot.regFree}/list`);
}

export async function loadRegFeeInfoPage(start, limit, query) {
  return ajax.GET(`${apiRoot.regFree}/page/${start}/${limit}`, query || {});
}

export async function saveRegInfo(data) {
  return data.id
    ? ajax.POST(`${apiRoot.regFree}/update`, data)
    : ajax.POST(`${apiRoot.regFree}/create`, data);
}

export async function deleteInfo(id) {
  return ajax.DELETE(`${apiRoot.regFree}/remove/${id}`);
}

export async function updateRegInfo(id) {
  return ajax.POST(`${apiRoot.regFree}/update/${id}`);
}

export async function deleteAllRegInfos(ids) {
  return ajax.DELETE(`${apiRoot.regFree}/removeAll`, ids);
}

export async function loadItemInfo(start, limit, query) {
	  return ajax.GET(`${apiRoot.itemInfo}page/${start}/${limit}`, query || {});
	}

