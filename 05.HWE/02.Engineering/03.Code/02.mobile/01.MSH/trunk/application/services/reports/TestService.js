
import { get } from '../../utils/Request';
import { hisTest } from '../RequestTypes';

export async function hisTestList(query) {
  return get(`${hisTest().testList}`, query);
}

export async function hisTestDetailList(query) {
  return get(`${hisTest().testDetailList}`, query);
}

export async function hisPacsList(query) {
  return get(`${hisTest().PACSList}`, query);
}

export async function hisPacsDetail(query) {

  return get(`${hisTest().PACSDetail}`, query);
}
