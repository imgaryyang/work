
import * as types from '../ActionTypes';
import Global from '../../Global';

export function gotoLogin() {
  return {
    type: types.AUTH.GOTO_LOGIN,
  };
}

export function afterLogin(user) {
  Global.setUser(user);
  // console.log('user in AuthAction.afterLogin():', user);
  return {
    type: types.AUTH.LOGIN,
    user,
  };
}

export function afterLogout() {
  // 清空Global中的用户信息
  Global.clearUser();
  return {
    type: types.AUTH.LOGOUT,
  };
}

export function updateUser(user) {
  Global.setUser(user);
  return {
    type: types.AUTH.UPDATE_USER,
    user,
  };
}
