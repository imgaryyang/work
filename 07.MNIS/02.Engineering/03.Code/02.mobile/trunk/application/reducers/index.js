import _ from 'lodash';
import Toast from 'react-native-root-toast';
import { NavigationActions } from 'react-navigation';

import Global from '../Global';
import * as types from '../actions/ActionTypes';
import { MainStackNavigator } from '../containers/RootNavigation';

import Reducers from './Reducers';

function nav(state, action) {
  // console.log('state & action in nav reducer:', state, action);
  // const initialNavState = MainStackNavigator.router.getStateForAction(MainStackNavigator.router.getActionForPathAndParams('Root'));
  if (
    !_.startsWith(action.type, 'Navigation') &&
    !_.startsWith(action.type, '@@redux') &&
    action.type !== 'types.AUTH.GOTO_LOGIN' &&
    action.type !== types.BASE.RESET_BACK_NAVIGATE
  ) {
    return state;
  }
  const { backIndex, routeName, params } = action;
  let nextState = { ...state };
  switch (action.type) {
    case types.AUTH.GOTO_LOGIN:
      nextState = MainStackNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Login' }),
        state,
      );
      break;
    case types.BASE.RESET_BACK_NAVIGATE:
      // 重置导航栈并导航
      if (typeof backIndex === 'number' && typeof routeName === 'string') {
        const { routes } = nextState;
        const newRoutes = routes.slice(0, backIndex + 1).concat({ routeName, params, key: Global.guid() });
        nextState = { ...nextState, routes: newRoutes, index: newRoutes.length - 1 };
      } else {
        Toast.show('resetBackNavigate参数错误！');
      }
      break;
    default:
      // 当前用户未登录，且跳转的场景需要登录，则跳转到登录界面
      if (Global.getUser() === null && _.indexOf(Global.needLoginComp, routeName) !== -1) {
        Toast.show('您还未登录，请先登录！');
        nextState = MainStackNavigator.router.getStateForAction(
          NavigationActions.navigate({ routeName: 'Login' }),
          state,
        );
        break;
      }
      nextState = MainStackNavigator.router.getStateForAction(action, state);
      break;
  }
  // console.log('nextState:', nextState);
  return nextState; // { ...state, nav: nextState };
}

// export default combineReducers({ ...Reducers, nav });

// function RootReducer() {
//   try {
//     return combineReducers({ ...Reducers, nav });
//   } catch (e) {
//     console.log('Exception in RootReducer:', e);
//     return {};
//   }
// }

export default { ...Reducers, nav };
