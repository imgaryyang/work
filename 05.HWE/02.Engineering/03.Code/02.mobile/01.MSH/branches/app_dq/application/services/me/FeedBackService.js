import { post, get, del } from '../../utils/Request';
import { feedBack } from '../RequestTypes';

export async function submit(data) {
  return post(`${feedBack().submit}`, data);
}

