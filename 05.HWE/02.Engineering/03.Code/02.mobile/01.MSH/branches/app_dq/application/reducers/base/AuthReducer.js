
import * as types from '../../actions/ActionTypes';
import ctrlState from '../../modules/ListState';

const initialState = {
  isLoggedIn: false,
  user: null,
  reloadUserCtrlState: ctrlState,
};

export default function auth(state = initialState, action = {}) {
  switch (action.type) {
    case types.AUTH.LOGIN:
      return {
        ...state,
        isLoggedIn: true,
        user: action.user,
      };
    case types.AUTH.LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };
    case types.AUTH.UPDATE_USER:
      return {
        ...state,
        user: action.user,
      };
    case types.AUTH.RELOAD_USER_CTRL_STATE:
      return {
        ...state,
        reloadUserCtrlState: action.reloadUserCtrlState || ctrlState,
      };
    default:
      return state;
  }
}
