import ajax from '../../utils/ajax';

import { apiRoot } from '../../utils/config';

export async function loadInstrmlInfo() {
  return ajax.GET(`${apiRoot.instrm}settings/instrmInfo/list`);
}

export async function loadInstrmlInfoPage(start, limit, query) {
  return ajax.GET(`${apiRoot.instrm}settings/instrmInfo/page/${start}/${limit}`, query || {});
}

export async function saveInstrmlInfo(data) {
  return ajax.POST(`${apiRoot.instrm}settings/instrmInfo/save`, data);
}

export async function deleteInstrmlInfo(id) {
  return ajax.DELETE(`${apiRoot.instrm}settings/instrmInfo/remove/${id}`);
}

export async function deleteAllInstrmlInfos(ids) {
  return ajax.DELETE(`${apiRoot.instrm}settings/instrmInfo/removeAll`, ids);
}

/* 
查詢固定資產信息
 */
export async function loadInstrmInfoPage(start, limit, query) {
	return ajax.GET(`${apiRoot.hrpInstrmInfo}/page/${start}/${limit}`, query || {});
}
