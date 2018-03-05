import { get } from '../../utils/Request';
import { base } from '../RequestTypes';

export async function sectionDescs(start, limit, data) {
  return get(`${base().sectionDescPage}/${start}/${limit}`, data);
}

export async function contacts(start, limit, data) {
  return get(`${base().contactPage}/${start}/${limit}`, data);
}
