import ajax from '../../utils/ajax';
import config from '../../utils/config';

export async function getPrintInfo(code, bizId) {
  return ajax.GET(`${config.apiRoot.print}get/${code}/${bizId}`);
}

export async function getPrint(code) {
  return ajax.GET(`${config.apiRoot.print}/getPrint/${code}`);
}
