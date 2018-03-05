import ajax from '../utils/ajax';


export function createBill(bill) {
  console.info('bill', bill);
  return ajax.POST('/api/hwe/pay/createBill', bill || {});
}

export function prePay(settlement) {
  return ajax.POST('/api/hwe/pay/prePay', settlement || {});
}

export function refund(settlement) {
  return ajax.POST('/api/hwe/pay/refund', settlement || {});
}
