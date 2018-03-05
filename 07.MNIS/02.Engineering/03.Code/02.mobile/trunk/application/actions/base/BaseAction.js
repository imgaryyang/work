
import { BASE } from '../ActionTypes';
import Global from '../../Global';

export function showLoading(visible) {
  // console.log('visible:', visible);
  return {
    type: BASE.SHOW_LOADING,
    visible,
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

export function setScreen(screen) {
  Global.setLayoutScreen(screen);
  return {
    type: BASE.SET_SCREEN,
    screen,
  };
}

export function setTabWSHeight(height) {
  Global.setLayoutScreen({ tabWSHeight: height });
  return {
    type: BASE.SET_WSHEIGHT,
    height,
  };
}

export function setOrientation(orientation) {
  return {
    type: BASE.SET_ORIENTATION,
    orientation,
  };
}
// 更新患者列表
export function setPatients(patients) {
  return {
    type: BASE.SET_PATIENTS,
    patients,
  };
}
// 更新当前被选择的患者
export function setCurrPatient(currPatient) {
  return {
    type: BASE.SET_CURR_PATIENT,
    currPatient,
  };
}
// 更新病区列表
export function setInpatientAreas(inpatientAreas) {
  return {
    type: BASE.SET_INPATIENT_AREAS,
    inpatientAreas,
  };
}
// 更新当前被选择的病区
export function setCurrInpatientArea(currInpatientArea) {
  return {
    type: BASE.SET_CURR_INPATIENT_AREA,
    currInpatientArea,
  };
}
// 更新待办事项
export function setTodos(todos) {
  return {
    type: BASE.SET_TODOS,
    todos,
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
