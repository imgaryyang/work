import ajax from '../../utils/ajax';
import { apiRoot } from '../../utils/config';


export async function statisByDeptAndDoc(query) {
  return ajax.GET(`${apiRoot.chargeStatis}/statisByDeptAndDoc`, query || {});
}
export async function statisByDeptAndNurse(query) {
  return ajax.GET(`${apiRoot.chargeStatis}/statisByDeptAndNurse`, query || {});
}
export async function exportStatisByDeptAndDoc(query) {
  return ajax.GET(`${apiRoot.chargeStatis}/exportStatisByDeptAndDoc`, query || {});
}

export async function statisByTimeAndDept(query) {
  return ajax.GET(`${apiRoot.chargeStatis}/statisByTimeAndDept`, query || {});
}

