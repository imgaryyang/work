import ajax from '../utils/ajax';

export function createBill(bill) {
  console.info('bill', bill);
  return ajax.POST('/api/hwe/pay/createBill', bill || {});
}

export function loadList(start, pageSize, query) {
  return ajax.GET(`/api/hwe/base/news/page/${start}/${pageSize}`, query || {});
}

export function getReportDetail(query) {
  return ajax.GET('/api/hwe/treat/medicalCheck/loadHisCheckDetail', query || {});
}

