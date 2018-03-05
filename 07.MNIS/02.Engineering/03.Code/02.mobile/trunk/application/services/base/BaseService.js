import { get } from '../../utils/Request';
import { base } from '../RequestTypes';

export async function sectionDescs(start, limit, data) {
  return get(`${base().sectionDescList}/${start}/${limit}`, data);
}

export async function contacts(start, limit, data) {
  return get(`${base().contactList}/${start}/${limit}`, data);
}
