import ajax from '../../utils/ajax';
import { apiRoot } from '../../utils/config';

export async function loadUsersByDept(id) {
  return ajax.GET(`${apiRoot.userDept}/listByDept`, id);
}
