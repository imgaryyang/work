import Toast from 'react-native-root-toast';

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

export function setCurrPatient(patient, profile) {
  Global.setCurrPatient(patient);
  Global.setCurrProfile(profile);
  return {
    type: BASE.SET_CURR_PATIENT,
    patient,
    profile,
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
  Global.clearCurrProfile();
  return {
    type: BASE.RESET_WHEN_LOGOUT,
  };
}

export function switchEdition(edition, currPatient, currProfile) {
  // console.log('edition, currPatient:', edition, currPatient);
  Global.setEdition(edition);
  const hospital = Global.Config.hospital;
  let newProfile = null;
  if (edition === Global.EDITION_SINGLE) {
    /**
     * 查找当前就诊人在所选医院是否有档案
     * 如果有，则自动将第一个档案设为当前就诊人档案
     * 如果没有，则清空当前就诊人及当前档案，并提示给用户
     */
    if (currPatient) {
      for (let i = 0; currPatient.profiles && i < currPatient.profiles.length; i++) {
        if (currPatient.profiles[i].hosId === hospital.id) {
          newProfile = currPatient.profiles[i];
          break;
        }
      }
      if (!newProfile) Toast.show(`当前所选就诊人${currPatient.name}在${hospital.name}未绑定卡`);
    }
    Global.setCurrHospital(hospital);
    Global.setCurrProfile(newProfile);
  } else {
    newProfile = currProfile;
  }
  return {
    type: BASE.SWITCH_EDITION,
    edition,
    currHospital: hospital,
    currProfile: newProfile,
  };
}
