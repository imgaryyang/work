import { post, get, del } from '../../utils/Request';
import { auth } from '../RequestTypes';

export async function login(data) {
  return post(`${auth().login}`, data);
}

export async function logout() {
  return get(`${auth().logout}`);
}

export async function resetPwd(data) {
  return post(`${auth().resetPwd}`, data);
}

export async function register(data) {
  return post(`${auth().register}`, data);
}

export async function doSave(data) {
  return post(`${auth().doSave}`, data);
}

export async function changePwd(data) {
  return post(`${auth().changePwd}`, data);
}

export async function setPortrait(data) {
  return post(`${auth().setPortrait}`, data);
}