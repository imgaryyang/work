import { post } from '../../utils/Request';
import { auth } from '../RequestTypes';

export async function login(data) {
  // console.log(data);
  if (data.username.toUpperCase() !== 'D0001' && data.username.toUpperCase() !== 'N0001') {
    return { success: false, msg: '您输入的用户不存在！' };
  }
  if (data.username.toUpperCase() === 'D0001') { // 测试医生用户
    return {
      success: true,
      result: {
        username: 'D0001',
        role: 'doctor',
        name: '张松岩',
        deptId: 'd0002',
        deptName: '心内科',
        mobile: '13879098976',
        portrait: 'u0001',
        inpatientAreas: [
          { id: 'IA0001', name: '急诊病区' },
          { id: 'IA0002', name: '内科二病区' },
          { id: 'IA0003', name: '高干特殊服务病区' },
        ],
      },
    };
  } else if (data.username.toUpperCase() === 'N0001') {
    return {
      success: true,
      result: {
        username: 'N0001',
        role: 'nurse',
        name: '王兰英',
        deptId: 'd0002',
        deptName: '心内科',
        mobile: '13879098976',
        portrait: 'u0002',
        inpatientAreas: [
          { id: 'IA0001', name: '急诊病区' },
          { id: 'IA0002', name: '内科二病区' },
          { id: 'IA0003', name: '高干特殊服务病区' },
        ],
      },
    };
  }
  // TODO: 正式环境从后台取
  // return post(`${auth().login}`, data);
}

export async function logout() {
  return { success: true };
  // TODO: 正式环境从后台取
  // return get(`${auth().logout}`);
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
