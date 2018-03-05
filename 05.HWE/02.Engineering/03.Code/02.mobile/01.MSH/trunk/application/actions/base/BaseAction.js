
import { BASE } from '../ActionTypes';
import Global from '../../Global';

export function changeTabTitle(title) {
  return {
    type: BASE.CHANGE_TAB_TITLE,
    title,
  };
}

export function showLoading(visible) {
  // console.log('visible:', visible);
  return {
    type: BASE.SHOW_LOADING,
    visible,
  };
}

export function setCurrPatient(patient) {
  Global.setCurrPatient(patient);
  return {
    type: BASE.SET_CURR_PATIENT,
    patient,
  };
}

export function setCurrHospital(hospital) {
  // console.log('hospital in setCurrHospital:', hospital);
  Global.setCurrHospital(hospital);
  return {
    type: BASE.SET_CURR_HOSPITAL,
    hospital,
  };
}

export function setCurrLocation(location) {
  // console.log('location in BaseAction.setCurrLocation():', location);
  return {
    type: BASE.SET_CURR_LOCATION,
    location,
  };
}

// 重置导航栈并导航
export function resetBackNavigate(backIndex, routeName, params) {
  return {
    type: BASE.RESET_BACK_NAVIGATE,
    // 上一个route的Index
    backIndex,
    // 下一个route的routeName
    routeName,
    // 下一个route的parmas
    params,
  };
}

export function resetWhenLogout() {
  Global.clearCurrHospital();
  Global.clearCurrPatient();
  return {
    type: BASE.RESET_WHEN_LOGOUT,
  };
}

export function switchEdition(edition) {
  Global.setEdition(edition);
  if (edition === Global.EDITION_SINGLE) Global.setCurrHospital(Global.Config.hospital);
  return {
    type: BASE.SWITCH_EDITION,
    edition,
  };
}
