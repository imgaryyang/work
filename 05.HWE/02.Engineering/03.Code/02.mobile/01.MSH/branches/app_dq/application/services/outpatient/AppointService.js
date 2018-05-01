import { get, post } from '../../utils/Request';
import { appoint } from '../RequestTypes';

// 3.4.1 可预约科室分类树查询
export async function forDeptTree(cond) {
  return get(`${appoint().deptTree}`, cond);
}

// 3.4.2 可预约科室列表查询
export async function forDeptList(cond) {
  return get(`${appoint().deptList}`, cond);
}

// 3.4.3 可预约医生列表查询
export async function forDocList(cond) {
  return get(`${appoint().docList}`, cond);
}

// 3.4.5 患者预约
export async function forReserve(cond) {
  return post(`${appoint().reserve}`, cond);
}

// 3.4.7 患者签到
export async function forSign(cond) {
  return post(`${appoint().sign}`, cond);
}

// 3.4.8 患者取消
export async function forCancel(cond) {
  return post(`${appoint().cancel}`, cond);
}

// 3.4.10 排班号源列表查询
export async function forList(query) {
  return get(`${appoint().list}`, query);
}

// 3.4.11 患者预约记录查询
export async function forReservedList(query) {
  return get(`${appoint().reservedList}`, query);
}

// 无卡预约记录查询
export async function forReservedNoCardList(cond) {
  return get(`${appoint().reservedNoCardList}`, cond);
}
