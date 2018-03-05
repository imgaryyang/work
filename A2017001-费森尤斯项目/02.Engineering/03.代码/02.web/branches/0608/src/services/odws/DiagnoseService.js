import ajax from '../../utils/ajax';
import { apiRoot } from '../../utils/config';

export async function loadDiagnosis(regId) {
  return ajax.GET(`${apiRoot.odws}diagnose/list/${regId}`);
}

export async function saveDiagnose(data) {
  return ajax.POST(`${apiRoot.odws}diagnose/save`, data);
}

export async function changeMainDiagnose(data) {
  return ajax.GET(`${apiRoot.odws}diagnose/setMainDiagnose/${data.regId}/${data.id}`);
}

export async function deleteDiagnose(data) {
  return ajax.GET(`${apiRoot.odws}diagnose/delete/${data.regId}/${data.id}`);
}

export async function loadTopDiagnosis() {
  return ajax.GET(`${apiRoot.odws}diagnose/list/top`);
}
