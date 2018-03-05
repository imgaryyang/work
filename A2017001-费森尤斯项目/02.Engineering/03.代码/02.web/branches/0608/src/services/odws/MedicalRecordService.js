import ajax from '../../utils/ajax';
import { apiRoot } from '../../utils/config';

export async function loadMedicalRecord(regId) {
  return ajax.GET(`${apiRoot.odws}inquiry/reg/${regId}`);
}

export async function saveMedicalRecord(data) {
  return ajax.POST(`${apiRoot.odws}inquiry/save`, data);
}

export async function loadTemplates(searchCode) {
  return ajax.GET(`${apiRoot.odws}patientRecordsTemplate/tree/list/${searchCode || '-1'}`);
}
