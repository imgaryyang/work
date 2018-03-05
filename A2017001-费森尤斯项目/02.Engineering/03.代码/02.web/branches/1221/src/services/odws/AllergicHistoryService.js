import ajax from '../../utils/ajax';
import { apiRoot } from '../../utils/config';

export async function loadAllergicHistory(patientId) {
  return ajax.GET(`${apiRoot.odws}allergicHistory/list/${patientId}`);
}

export async function saveAllergic(data) {
  return ajax.POST(`${apiRoot.odws}allergicHistory/save`, data);
}
