import ajax from '../utils/ajax';
import config from '../utils/config';

/**
 * 根据id取医生信息
 */
export async function loadDoctors(docIds) {
  const rtn = await ajax.GET(`${config.apiRoot.user}users/`, docIds);
  return rtn;
}
