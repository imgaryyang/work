import ajax from '../../utils/ajax';

const apiRoot = '/api/ssm/pay/cash/';

export async function loadBatchs(start, limit, query) {
  return ajax.GET(`${apiRoot}`, query || {});
}
