import ajax from '../../utils/ajax';

import { apiRoot } from '../../utils/config';

export async function payWayStatistics(query) {
  return ajax.GET(`${apiRoot.operBalance}/statistics/payWay`, query);
}

export async function accountItemStatistics(query) {
  return ajax.GET(`${apiRoot.operBalance}/statistics/accountItem`, query);
}

export async function registStatistics(query) {
  return ajax.GET(`${apiRoot.register}/statistics/registStatistics`, query);
}

export async function workLoadStatistics(query) {
  return ajax.GET(`${apiRoot.register}/statistics/registStatisticsByAccounter`, query);
}
