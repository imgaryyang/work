import { get } from '../../utils/Request';
import { medicalCheck } from '../RequestTypes';

export async function loadCheckList(query) {
  return get(`${medicalCheck().loadCheckList}`, query);
}
export async function loadHisCheckList(query) {
  return get(`${medicalCheck().loadHisCheckList}`, query);
}

export async function loadCheckLists(query) {
  return get(`${medicalCheck().loadCheckList}/${query}`);
}
export async function loadCheckDetail(data) {
  return get(`${medicalCheck().loadCheckDetail}/${data}`);
}
export async function loadHisCheckDetail(query) {
  return get(`${medicalCheck().loadHisCheckDetail}/`, query);
}
