import ajax from '../../utils/ajax';
import { apiRoot } from '../../utils/config';

export async function loadRegInfo(start, limit, query) {
  return ajax.GET(`${apiRoot.register}/find/${start}/${limit}`, query || {});
}

export async function visit(data) {
  return ajax.POST(`${apiRoot.register}/visit/${data.id}`, data);
}

export async function loadWorkloadList(data) {
	return ajax.GET(`${apiRoot.workloadSearch}workloadList`, data || {});
}

