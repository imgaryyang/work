import ajax from '../utils/ajax';
import { apiRoot } from '../utils/config';

/**
 * 根据id取医生信息
 */
export async function loadDoctors(docIds) {
  return await ajax.GET(`${apiRoot.user}users/`, docIds);
}
