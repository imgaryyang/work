import { post, get, del, put, form } from '../../utils/Request';
import { images } from '../RequestTypes';


export async function page(start, limit, data) {
  return get(`${images().page}/${start}/${limit}`, data);
}

export async function save(data) {
  if (data.id) return put(`${images().update}/${data.id}`, data);
  else return post(`${images().create}`, data);
}

export async function remove(id) {
  return del(`${images().remove}/${id}`);
}

export async function getInfo(id) {
  return get(`${images().getInfo}/${id}`);
}

export async function getByFkId(data) {
  return get(`${images().getByFkId}/${data.fkId}/list`, data);
}

export async function view(id) {
  return get(`${images().view}/${id}`);
}

export async function upload(data) {
  return form(`${images().upload}`, data.body);
}
