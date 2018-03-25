import { post, get } from '../../utils/Request';
import { alipay, patient, wxpay, patientPayment } from '../RequestTypes';

export async function createDeposit(data) {
  return post(`${patientPayment().createDeposit}`, data);
}

export async function getPrePaymentInfo(data) {
  return get(`${patientPayment().getPrePaymentInfo}`, data);
}

