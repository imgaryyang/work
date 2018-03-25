import ajax from '../utils/ajax';


export function createBill(bill) {
  console.info('bill', bill);
  return ajax.POST('/api/hwe/pay/createBill', bill || {});
}


export function getReport(query) {
  return ajax.GET('/api/hwe/treat/his/test/list', query || {});
}
export function getReportDetail(query) {
  return ajax.GET('/api/hwe/treat/his/testDetail/list', query || {});
}

