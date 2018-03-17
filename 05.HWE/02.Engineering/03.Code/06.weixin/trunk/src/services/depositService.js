import ajax from '../utils/ajax';


export function create(data) {
  return ajax.POST('/api/hwe/treat/deposit/create', data || {});
}

