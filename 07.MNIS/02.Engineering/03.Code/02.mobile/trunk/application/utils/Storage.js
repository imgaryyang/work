
import { AsyncStorage } from 'react-native';

class Storage extends Object {}
Storage.KEY = {};
// 当前登录用户
Storage.KEY.USER = 'user';
// 后台服务地址
Storage.KEY.HOST = 'host';
// 后台服务连接超时时间
Storage.KEY.HOST_TIMEOUT = 'hostTimeout';
// 单医院版本对应的医院信息
Storage.KEY.HOSPITAL = 'hospital';
// 当前选择医院
Storage.KEY.CURR_HOSPITAL = 'currHospital';
// 当前就诊人
Storage.KEY.CURR_PATIENT = 'currPatient';
// 当前选择地区
Storage.KEY.CURR_AREA = 'currArea';

// 从本地存储取数据
export async function getItem(key) {
  return AsyncStorage.getItem(key);
}

// 从本地存储取数据并转换为Json
export async function getJsonItem(key) {
  const value = await AsyncStorage.getItem(key);
  try {
    return JSON.parse(value);
  } catch (e) {
    console.log('key & value in getJsonItem():', key, value);
    console.log(`[Storage.getJsonItem()] 不能将${value}转换为Json对象：`, e);
    return null;
  }
}

// 从本地存储取数据并转换为Int
export async function getIntItem(key) {
  const value = parseInt(await AsyncStorage.getItem(key), 10);
  return isNaN(value) ? null : value;
}

// 从本地存储取数据并转换为Float
export async function getFloatItem(key) {
  const value = await AsyncStorage.getItem(key);
  try {
    return parseFloat(value);
  } catch (e) {
    console.log(`[Storage.getFloatItem()] 不能将${value}转换为Float对象：`, e);
    return null;
  }
}

// 从本地存储删除数据
export async function removeItem(key) {
  AsyncStorage.removeItem(key);
}

// 向本地存储存放数据
export async function setItem(key, value) {
  return AsyncStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : `${value}`);
}

// 从本地存储取用户信息
export async function getUser() {
  return getJsonItem(Storage.KEY.USER);
}
// 将登录用户信息存储到本地存储
export async function setUser(user) {
  setItem(Storage.KEY.USER, user);
}
export async function removeUser() {
  removeItem(Storage.KEY.USER);
}

export async function getHost() {
  return getItem(Storage.KEY.HOST);
}
export async function setHost(host) {
  setItem(Storage.KEY.HOST, host);
}
export async function removeHost() {
  removeItem(Storage.KEY.HOST);
}

export async function getHostTimeout() {
  return getIntItem(Storage.KEY.HOST_TIMEOUT);
}
export async function setHostTimeout(hostTimeout) {
  setItem(Storage.KEY.HOST_TIMEOUT, hostTimeout);
}
export async function removeHostTimeout() {
  removeItem(Storage.KEY.HOST_TIMEOUT);
}

export async function getHospital() {
  return getJsonItem(Storage.KEY.HOSPITAL);
}
export async function setHospital(hospital) {
  setItem(Storage.KEY.HOSPITAL, hospital);
}
export async function removeHospital() {
  removeItem(Storage.KEY.HOSPITAL);
}

export async function getCurrHospital() {
  return getJsonItem(Storage.KEY.CURR_HOSPITAL);
}
export async function setCurrHospital(hospital) {
  setItem(Storage.KEY.CURR_HOSPITAL, hospital);
}
export async function removeCurrHospital() {
  removeItem(Storage.KEY.CURR_HOSPITAL);
}

export async function getCurrPatient() {
  return getJsonItem(Storage.KEY.CURR_PATIENT);
}
export async function setCurrPatient(patient) {
  setItem(Storage.KEY.CURR_PATIENT, patient);
}
export async function removeCurrPatient() {
  removeItem(Storage.KEY.CURR_PATIENT);
}

export async function getCurrArea() {
  return getJsonItem(Storage.KEY.CURR_AREA);
}
export async function setCurrArea(area) {
  setItem(Storage.KEY.CURR_AREA, area);
}
export async function removeCurrArea() {
  removeItem(Storage.KEY.CURR_AREA);
}

export default Storage;
