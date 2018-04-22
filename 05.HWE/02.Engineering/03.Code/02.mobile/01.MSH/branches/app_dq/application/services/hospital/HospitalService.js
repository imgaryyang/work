import { get } from '../../utils/Request';
import { hospital } from '../RequestTypes';

export async function page(start, limit, query) {
  return get(`${hospital().page}/${start}/${limit}`, query || {});
}

export async function nearest(longitude, latitude, query) {
  return get(`${hospital().nearest}/${longitude}/${latitude}`, query || {});
}

export async function info(id) {
  return get(`${hospital().get}/${id}`);
}
