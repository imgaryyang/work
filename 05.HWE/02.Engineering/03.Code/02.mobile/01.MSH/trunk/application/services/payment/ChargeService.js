import { post, get } from '../../utils/Request';
import { alipay, patient, wxpay, patientPayment } from '../RequestTypes';

export async function createBill(query) {
  return post(`${alipay().createBill}`, query);
}
export async function createSettlement(query) {
  return post(`${alipay().createSettlement}`, query);
}

export async function createWxPaySettlement(data) {
  return post(`${wxpay().createSettlement}`, data);
}

export async function getPreStore(data) {
  return get(`${patient().getPreStore}`, data);
}

export async function getPrePay(data) {
  return get(`${patient().getPrePay}`, data);
}

export async function getPatientPayment(data) {
  return get(`${patientPayment().patientPaymentList}`, data);
}

export async function getPrePaymentInfo(data) {
  return get(`${patientPayment().getPrePaymentInfo}`, data);
}

