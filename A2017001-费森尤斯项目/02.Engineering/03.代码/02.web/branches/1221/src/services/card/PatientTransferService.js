import ajax from '../../utils/ajax';
import moment from 'moment';
import { apiRoot } from '../../utils/config';

export async function loadPatientTransfer(data) {
  return ajax.GET(`${apiRoot.patient}patientTransfer`,
    data && data.startMonth && data.endMonth ?
    { startMonth: moment(data.startMonth).format('YYYY-MM'), endMonth: moment(data.endMonth).format('YYYY-MM') } :
    { startMonth: moment().format('YYYY-MM'), endMonth: moment().format('YYYY-MM') });
}
export async function loadChartData(data) {
  return ajax.GET(`${apiRoot.patient}patientTransferChartData`,
     data && data.startMonth && data.endMonth ?
    { startMonth: moment(data.startMonth).format('YYYY-MM'), endMonth: moment(data.endMonth).format('YYYY-MM') } :
    { startMonth: moment().format('YYYY-MM'), endMonth: moment().format('YYYY-MM') });
}