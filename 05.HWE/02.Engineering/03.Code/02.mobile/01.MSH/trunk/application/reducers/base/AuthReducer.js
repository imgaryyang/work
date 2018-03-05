
import * as types from '../../actions/ActionTypes';

const initialState = {
  isLoggedIn: false,
  user: null,
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
    default:
      return state;
  }
}
