import ajax from '../../utils/ajax';
import { apiRoot } from '../../utils/config';

export async function getPrintInfo(code, bizId) {
  return ajax.GET(`${apiRoot.print}get/${code}/${bizId}`);
}

export async function getPrint(code) {
  return ajax.GET(`${apiRoot.print}/getPrint/${code}`);
}
