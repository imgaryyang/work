import ajax from '../../utils/ajax';
import { apiRoot } from '../../utils/config';

export async function createOrder(orderNo, amt) {
  return ajax.POST(`${apiRoot.pay}/create/createOrder/${orderNo}/${amt}`);
}

export async function createSettlement(orderNo, amt, payChannelCode) {
  return ajax.POST(`${apiRoot.pay}/create/createSettlement/${orderNo}/${amt}/${payChannelCode}`);
}

export async function getSettleState(id) {
  return ajax.GET(`${apiRoot.pay}/get/settleState/${id}`);
}

export async function showQrCode(id, size) {
  return ajax.GET(`${apiRoot.pay}/get/showQrCode/${id}/${size}`);
}

export async function removeOrder(orderNo) {
  return ajax.DELETE(`${apiRoot.pay}/remove/${orderNo}`);
}
