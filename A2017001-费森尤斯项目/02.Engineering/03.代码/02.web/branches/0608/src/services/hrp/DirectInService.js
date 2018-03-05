

import ajax from '../../utils/ajax';
import { apiRoot } from '../../utils/config';
const _API_ROOT = "/api/hcp/hrp/directIn/";
const _COMPANY = "/api/hcp/hrp/settings/instrmMng/"
const IN_API_ROOT = "/api/hcp/hrp/insStoreMng/insInput";
//加载暂存请领记录
export async function loadApply(query) {
	console.info('tiger 3 : ',query);
	return ajax.GET(_API_ROOT + 'apply/list',query);
}

//加载历史采购记录
export async function loadBuyHistory(start, limit, query) {
	return ajax.GET(`${apiRoot.hrpDirectIn}/page/${start}/${limit}`, query || {});
}

//暂存入库记录
export async function saveApply(data) {
	  return ajax.POST(_API_ROOT+'create',data);
}

//删除请领暂存记录
export async function deleteApply(id) {
	  return ajax.DELETE(_API_ROOT+'remove/'+id);
}
//新建清空暂存记录
export async function newApply(data) {
	  return ajax.DELETE(_API_ROOT+'removeAll',data);
}
//searchBar请领查询
export async function loadSearchBar(query) {
	return ajax.GET(_API_ROOT + 'searchBar/list',query);
}
//保存入库记录调用汐鸣入库接口
export async function saveDirectIn(data) {
  return ajax.POST(IN_API_ROOT,data);
}
/*
加载入库汇总page
 */
export async function inStoreSummaryPage(start, limit, query) {
  return ajax.GET(`${apiRoot.hrpDirectIn}/InStoreSummaryPage/${start}/${limit}`, query || {});
}
/*
查询入库明细page
 */
export async function inStoreDetailPage(start, limit, query) {
	return ajax.GET(`${apiRoot.hrpDirectIn}/InStoreDetailPage/${start}/${limit}`, query || {});
}
/*
入库明细导出到Excel中
 */
export async function exportDetailToExcel(query) {
	return ajax.GET(`${apiRoot.hrpDirectIn}/exportDetailToExcel`, query || {});
}
//加载暂存请领记录
export async function loadCompany(){
	return ajax.GET(_COMPANY + 'company/list');
}
/*
入库信息按供应商汇总导出到Excel中
 */
export async function exportInStoreSummary(query) {
	return ajax.GET(`${apiRoot.hrpDirectIn}/exportInStoreSummary`, query || {});
}
