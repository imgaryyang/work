import { post, get, del } from '../../utils/Request';
import { message } from '../RequestTypes';

export async function page(start, limit, data) {
  return get(`${message().page}/${start}/${limit}`, data);
}

export async function read(data) {
  return post(`${message().read}`, data);
}

export async function remove(id) {
  return del(`${message().remove}/${id}`);
}

export async function removeSelected(ids) {
  return get(`${message().removeSelected}`, ids);
}
