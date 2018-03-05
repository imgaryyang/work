import { post, get, del } from '../../utils/Request';
import { patient } from '../RequestTypes';

export async function page(start, limit, query) {
  return get(`${patient().page}/${start}/${limit}`, query);
}

export async function list(query) {
  return get(`${patient().list}`, query);
}

export async function save(data) {
  if (data.id) return post(`${patient().update}`, data);
  else return post(`${patient().create}`, data);
}

export async function remove(id) {
  return del(`${patient().remove}/${id}`);
}

export async function removeSelected(ids) {
  return post(`${patient().removeSelected}`, ids);
}

export async function getPatient(mobile) {
  return get(`${patient().getPatient}/${mobile}`);
}

export async function addPatient(data) {
  return post(`${patient().addPatient}`, data);
}

export async function queryProfile(data) {
  return post(`${patient().queryProfile}`, data);
}

export async function setDefaultProfile(data) {
  return post(`${patient().setDefaultProfile}`, data);
}

export async function setMyDefaultProfile(data) {
  return post(`${patient().setMyDefaultProfile}`, data);
}

export async function identify(mobile, smscode, hospitalId, patientId) {
  return get(`${patient().identify}/${mobile}/${smscode}/${hospitalId}/${patientId}`);
}

export async function getMyProfiles(patientId) {
  return get(`${patient().getMyProfiles}/${patientId}`);
}

export async function addArchives(data, hospitalId) {
  return post(`${patient().addArchives}/${hospitalId}`, data);
}

export async function updateUserPatients(query) {
  return post(`${patient().updateUserPatients}`, query);
}

