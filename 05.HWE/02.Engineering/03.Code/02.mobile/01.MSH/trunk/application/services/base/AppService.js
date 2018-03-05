import { get } from '../../utils/Request';
import { app } from '../RequestTypes';

export async function loadAppInfo(appId) {
  return get(`${app().info}/${appId}`);
}
