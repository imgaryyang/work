import { post, get, del } from '../../utils/Request';
import {consultRecord} from '../RequestTypes';

export async function page(start, limit, data) {
  return get(`${consultRecord().page}/${start}/${limit}`, data);
}

export async function save(data) {
  if (data.id) return post(`${consultRecord().update}`, data);
  else return post(`${consultRecord().create}`, data);
}

export async function complete(data) {
  return post(`${consultRecord().complete}`, data);
}

export async function reply(data) {
  return post(`${consultRecord().reply}`, data);
}

export async function remove(id) {
  return del(`${consultRecord().remove}/${id}`);
}

export async function removeSelected(ids) {
  return get(`${consultRecord().removeSelected}`, ids);
}
