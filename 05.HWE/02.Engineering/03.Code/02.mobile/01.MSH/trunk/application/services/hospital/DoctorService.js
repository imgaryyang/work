import { get } from '../../utils/Request';
import { doctor } from '../RequestTypes';

export async function listByDept(start, limit, query) {
  return get(`${doctor().listByDept}/${start}/${limit}`, query);
}

export async function listByHospital(start, limit, query) {
  return get(`${doctor().listByHospital}/${start}/${limit}`, query);
}
