

import ajax from '../../utils/ajax';
import { apiRoot } from '../../utils/config';
const _API_ROOT = "/api/hcp/pharmacy/instock/";
const IN_API_ROOT = "/api/hcp/pharmacy/phaStoreMng/phaInput"
const OUT_API_ROOT = "/api/hcp/pharmacy/outputInfo/"
//加载暂存请领记录
export async function loadApply(query) {
	return ajax.GET(_API_ROOT + 'apply/list',query);
}
//加载已请领记录
export async function loadApplyAuitd(query) {console.info('Auitd',query)
	return ajax.GET(_API_ROOT + 'applyAuitd/list',query);
}

//暂存或保存请领记录
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
//请领申请查询（用于请领审核出库）
export async function loadAppInInfoPage(start, limit, query) {
	return ajax.GET(`${apiRoot.instock}applyInList/page/${start}/${limit}`,query || {});
}
//请领申请查询（用于请领修改）
export async function loadApplyInMainList(query) {
	return ajax.GET(_API_ROOT + 'apply/mainList', query);
}
//请领申请明细,有分页（用于请领审核出库）
export async function loadAppInDetailPage(start, limit, query) {
	return ajax.GET(`${apiRoot.instock}applyInDetail/page/${start}/${limit}`,query || {});
}
//请领申请明细,无分页（用于请领审核出库）
export async function loadApplyInDetailInfo(query) {
	return ajax.GET(`${apiRoot.instock}applyInDetailInfo`,query || {});
}
//更新请领申请（用于请领审核出库）
export async function updateAppInDetail(query) {
	return ajax.POST(`${apiRoot.instock}updateApplyIn`,query || {});
}

//更新请领申请（用于请领审核出库）--有事物
export async function phaOutCheck(query) {
	return ajax.POST(`${apiRoot.instock}phaOutCheck`,query || {});
}

//更新请领申请（用于请领审核出库）--驳回
export async function phaOutCheckBack(query) {
	return ajax.POST(`${apiRoot.instock}phaOutCheckBack`,query || {});
}

//searchBar请领出库查询所有单号
export async function loadAuitd(query) {
	
	 return ajax.GET(_API_ROOT + 'auitd/list',query);


}
//根据请领单号查询数据
export async function loadAuitdDetail(query) {
	
	 return ajax.GET(_API_ROOT + 'apply/list',query);

}
//保存入库记录调用汐鸣入库接口
export async function saveAuitd(data) {
	  return ajax.POST(IN_API_ROOT,data);
}
//更新出库表出库状态
export async function updateByAppBill(appBill) {
	  return ajax.POST(OUT_API_ROOT+'updateByAppBill/'+appBill);
}