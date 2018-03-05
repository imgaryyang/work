import moment from 'moment';
import ajax from '../../utils/ajax';
import { apiRoot } from '../../utils/config';

export async function loadPatientFee(start, pageSize, data) {
  return ajax.GET(`${apiRoot.financeStatistics}patientFee/page/${start}/${pageSize}`,
    data && data.dateRange ? { startDate: moment(data.dateRange[0]).format('YYYY-MM-DD'), endDate: moment(data.dateRange[1]).format('YYYY-MM-DD') } : {});
}

export async function loadFeeType(data) {
  return ajax.GET(`${apiRoot.financeStatistics}feeType`,
    data && data.dateRange ? { startDate: moment(data.dateRange[0]).format('YYYY-MM-DD'), endDate: moment(data.dateRange[1]).format('YYYY-MM-DD'), chanel: data.chanel ? data.chanel : '', hosId: data.hosId ? data.hosId : '' } :
    { chanel: data.chanel ? data.chanel : '', hosId: data.hosId ? data.hosId : '' });
}
 
export async function loadTotalFee(data) {
  return ajax.GET(`${apiRoot.financeStatistics}totalFee`,
    data && data.startMonth && data.endMonth ?
    { startMonth: moment(data.startMonth).format('YYYY-MM'), endMonth: moment(data.endMonth).format('YYYY-MM'), chanel: data.chanel ? data.chanel : '', hosId: data.hosId ? data.hosId : '' } :
    { startMonth: moment().format('YYYY-MM'), endMonth: moment().format('YYYY-MM'), chanel: data.chanel ? data.chanel : '', hosId: data.hosId ? data.hosId : '' });
}

export async function loadIncomeAndExpenses(data) {
  return ajax.GET(`${apiRoot.financeStatistics}statisByIncomeAndExpenses`,
    { startTime: (data && data.startTime ? moment(data.startTime).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')),
      endTime: (data && data.endTime ? moment(data.endTime).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')),
      chanel: data.chanel ? data.chanel : '',
      hosId: data.hosId ? data.hosId : '' });
}

export async function loadMatConsum(data) {
  return ajax.GET(`${apiRoot.financeStatistics}statisOfMatConsum`,
    { startTime: data && data.startTime ? moment(data.startTime).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
      endTime: data && data.endTime ? moment(data.endTime).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
      chanel: (data && data.chanel ? data.chanel : '') });
}

export async function loadMonthCheck(data) {
  return ajax.GET(`${apiRoot.financeStatistics}statisOfMonthCheck`,
    { startTime: data && data.startTime ? moment(data.startTime).format('YYYY-MM-DD HH:mm:ss') : moment().format('YYYY-MM-DD HH:mm:ss'),
      endTime: data && data.endTime ? moment(data.endTime).format('YYYY-MM-DD HH:mm:ss') : moment().format('YYYY-MM-DD HH:mm:ss'),
      chanel: (data && data.chanel ? data.chanel : '') });
}

export async function findMonthCheckTime(data) {
  return ajax.GET(`${apiRoot.monthCheck}findMonthCheckTime`, data || {});
}

export async function statisBaseOperation(data) { 
  return ajax.GET(`${apiRoot.financeStatistics}statisBaseOperation`, data || {});
}

export async function findBaseFeeType(data) {
  return ajax.GET(`${apiRoot.financeStatistics}findBaseFeeType`, data || {});
}
