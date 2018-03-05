import ajax from '../utils/ajax';


export function submit(query) {
  return ajax.POST('/api/hwe/app/feedBack/create', query);
}

