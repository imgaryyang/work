import ajax from '../utils/ajax';


export function createBill(bill) {
  console.info('bill', bill);
  return ajax.POST('/api/hwe/pay/createBill', bill || {});
}


export function getNews(query) {
  return ajax.GET('/api/hwe/base/news/page/0/20', query || {});
}
export function getReportDetail(query) {
  return ajax.GET('/api/hwe/treat/medicalCheck/loadHisCheckDetail', query || {});
}

