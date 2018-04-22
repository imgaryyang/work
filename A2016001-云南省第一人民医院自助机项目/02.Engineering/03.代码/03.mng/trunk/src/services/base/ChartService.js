

import ajax from '../../utils/ajax';
const _API_ROOT = "/api/ssm/statistics/";

export async function loadCardCount() {
	return ajax.POST(_API_ROOT+'loadCardCount');
}

export async function loadDepositAcount(date) {
	return ajax.GET(_API_ROOT+'loadDepositAcount/'+date);
}

export async function loadPayFeeAcount() {
	return ajax.POST(_API_ROOT+'loadPayFeeAcount');
}