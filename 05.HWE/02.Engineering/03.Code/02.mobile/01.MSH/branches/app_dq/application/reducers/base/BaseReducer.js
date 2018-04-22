
import * as types from '../../actions/ActionTypes';
import Global from '../../Global';

const initialState = {
  tabTitle: '我的',
  loadingVisible: false,
  hospital: null,
  currLocation: null,
  currPatient: null,
  currProfile: null,
  currHospital: null,
  currArea: null,
  edition: Global.edition,
};

export default function base(state = initialState, action = {}) {
  // console.log('action in BaseReducer:', action);
  switch (action.type) {
    case types.BASE.CHANGE_TAB_TITLE:
      return {
        ...state,
        patients: action.patients,
      };
    case types.BASE.SHOW_LOADING:
      return {
        ...state,
        loadingVisible: action.visible,
      };
    case types.BASE.SET_CURR_PATIENT:
      return {
        ...state,
        currPatient: action.patient,
        currProfile: action.profile,
      };
    case types.BASE.SET_CURR_HOSPITAL:
      // console.log('action in BaseReducer : case types.BASE.SET_CURR_HOSPITAL:', action);
      return {
        ...state,
        currHospital: action.hospital,
      };
    case types.BASE.SET_CURR_LOCATION:
      return {
        ...state,
        currLocation: action.location,
      };
    case types.BASE.SET_CURR_AREA:
      return {
        ...state,
        currArea: action.area,
      };
    case types.BASE.RESET_WHEN_LOGOUT:
      return {
        ...state,
        currHospital: null,
        currPatient: null,
        currProfile: null,
      };
    case types.BASE.SWITCH_EDITION: {
      // const hosp = action.edition === Global.EDITION_SINGLE ? { currHospital: Global.Config.hospital } : {};
      return {
        ...state,
        edition: action.edition,
        currHospital: action.currHospital,
        currProfile: action.currProfile,
      };
    }
    default:
      return state;
  }
}
