import { post, get } from '../../utils/Request';
import { patientPayment } from '../RequestTypes';
// import Global from "../../Global";

export async function createDeposit(data) {
  return post(`${patientPayment().createDeposit}`, data);
}
export async function createForegift(data) {
  return post(`${patientPayment().createForegift}`, data);
}
export async function getPrePaymentInfo(data) {
  return post(`${patientPayment().getPrePaymentInfo}`, data);
}
// 门诊缴费预结算
export async function prepay(data) {
  return post(`${patientPayment().depositPrePay}`, data);
}

export async function refund(data) {
  return post(`${patientPayment().refundDeposit}`, data);
}
// 门诊缴费结算
export function pay(settlement) {
  return post(`${patientPayment().depositPay}`, settlement);
}
