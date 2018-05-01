import { get } from '../../utils/Request';
import { dept } from '../RequestTypes';

export async function select(data) {
  return get(`${dept().select}`, data);
}

export async function listBrief(data) {
  return get(`${dept().listBrief}`, data);
}
