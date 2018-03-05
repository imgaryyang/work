import { post, get, del } from '../../utils/Request';
import { sample } from '../RequestTypes';

export async function page(start, limit, query) {
  return get(`${sample().page}/${start}/${limit}`, query);
}

export async function save(data) {
  if (data.id) return post(`${sample().update}`, data);
  else return post(`${sample().create}`, data);
}

export async function remove(id) {
  return del(`${sample().remove}/${id}`);
}

export async function removeSelected(ids) {
  return post(`${sample().removeSelected}`, ids);
}
