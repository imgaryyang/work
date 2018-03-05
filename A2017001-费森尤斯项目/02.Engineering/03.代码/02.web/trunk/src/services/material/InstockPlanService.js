import ajax from '../../utils/ajax';
import { apiRoot } from '../../utils/config';

/* 物资 - 请领计划查询 */
export function loadApplyInPage(start, limit, query = {}) {
  return ajax.GET(`${apiRoot.matInstock}applyInList/page/${start}/${limit}`, query);
}

export function loadApplyInDetailPage(start, limit, query = {}) {
  return ajax.GET(`${apiRoot.matInstock}applyInDetail/page/${start}/${limit}`, query);
}

export function exportData(query = {}) {
  const w = window.open('about:blank');
  w.location.href = `${apiRoot.matInstock}expertToExcel?data=${JSON.stringify(query)}`;
  return w;
}

/* 物资 - 请领计划修改 */
// 请领申请查询（用于请领修改）
export function loadPlanMainList(query) {
  return ajax.GET(`${apiRoot.matInstock}apply/mainList`, query);
}

// 删除请领暂存记录
export function deletePlan(id) {
  return ajax.DELETE(`${apiRoot.matInstock}remove/${id}`);
}

// 暂存或保存请领记录
export function savePlan(data) {
  return data.id
    ? ajax.POST(`${apiRoot.matInstock}update`, data)
    : ajax.POST(`${apiRoot.matInstock}create`, data);
}

// 加载暂存请领记录
export function loadPlan(query) {
  return ajax.GET(`${apiRoot.matInstock}apply/list`, query);
}
