
import { BASE } from '../../actions/ActionTypes';

const initialState = {
  loadingVisible: false,
  hospital: null,
  currHospital: null,
  currLocation: null,
  currArea: null,

  // 屏幕尺寸，根据屏幕旋转自动变动
  screen: null,
  // 屏幕方向 PORTRAIT PORTRAITUPSIDEDOWN LANDSCAPE
  orientation: null,

  // 所有患者
  patients: [],
  // 当前患者
  currPatient: null,

  // 院区
  inpatientAreas: [],
  // 当前选择院区
  currInpatientArea: null,

  // 所有待办事项
  todos: [],
};

export default function base(state = initialState, action = {}) {
  // console.log('action in BaseReducer:', action);
  switch (action.type) {
    case BASE.SHOW_LOADING:
      return {
        ...state,
        loadingVisible: action.visible,
      };
    case BASE.SET_CURR_HOSPITAL:
      // console.log('action in BaseReducer : case BASE.SET_CURR_HOSPITAL:', action);
      return {
        ...state,
        currHospital: action.hospital,
      };
    case BASE.SET_CURR_LOCATION:
      return {
        ...state,
        currLocation: action.location,
      };
    case BASE.SET_CURR_AREA:
      return {
        ...state,
        currArea: action.area,
      };
    // 屏幕尺寸
    case BASE.SET_SCREEN:
      return {
        ...state,
        screen: { ...state.screen, ...action.screen },
      };
    // Tab内工作区高度
    case BASE.SET_WSHEIGHT:
      return {
        ...state,
        screen: { ...state.screen, tabWSHeight: action.height },
      };
    // 屏幕方向
    case BASE.SET_ORIENTATION:
      return {
        ...state,
        orientation: action.orientation,
      };
    // 患者
    case BASE.SET_PATIENTS:
      return {
        ...state,
        patients: action.patients,
      };
    case BASE.SET_CURR_PATIENT:
      return {
        ...state,
        currPatient: action.currPatient,
      };
    // 病区
    case BASE.SET_INPATIENT_AREAS:
      return {
        ...state,
        inpatientAreas: action.inpatientAreas,
      };
    case BASE.SET_CURR_INPATIENT_AREA:
      return {
        ...state,
        currInpatientArea: action.currInpatientArea,
      };
    // 待办事项
    case BASE.SET_TODOS:
      return {
        ...state,
        todos: action.todos,
      };
    default:
      return state;
  }
}
