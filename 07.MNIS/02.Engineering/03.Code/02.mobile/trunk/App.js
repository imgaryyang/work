/**
 * by Victor
 * created on 2017/11/1
 * updated on 2017/11/10
 */

import React, { Component } from 'react';
import { createStore, combineReducers } from 'redux';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import Orientation from 'react-native-orientation';

// import Store from './application/Store';
import CustomPrototypes from './application/utils/CustomPrototypes';
import MainView from './application/containers/MainView';
import Config from './Config';
import Global, { init } from './application/Global';
import RootReducer from './application/reducers';
import PlaceHolder from './application/containers/PlaceholderNavigation';
import { MainStackNavigator } from './application/containers/RootNavigation';

// 初始化公共工具
CustomPrototypes.init();

class App extends Component {
  /**
   * 构造函数，声明初始化 state
   */
  constructor(props) {
    super(props);
    Global.setConfig(Config);
    this.onLayout = this.onLayout.bind(this);
  }

  state = {
    layouted: false,
    inited: false,
  };

  /**
   * 系统初始化
   */
  async componentWillMount() {
    await init();
    this.setState({ inited: true });
  }

  /**
   * 初始化完成并且取到了第一次的layout参数后再渲染RootNavigation
   */
  shouldComponentUpdate(nextProps, nextState) {
    return (nextState.inited && nextState.layouted);
  }

  /**
   * 获取不同系统中可用屏幕宽度及高度
   */
  onLayout(e) {
    if (!this.state.layouted) {
      // console.log('el.onLayout():', e.nativeEvent.layout);
      Global.setLayoutScreen({
        width: e.nativeEvent.layout.width,
        height: e.nativeEvent.layout.height,
      });
      this.setState({ layouted: true });
      // console.log('el.onLayout() - after onLayout');
    }
  }

  render() {
    if (this.state.layouted && this.state.inited) {
      // console.log('Global.getUser() in App.render():', Global.getUser());
      const nav = MainStackNavigator.router.getStateForAction(MainStackNavigator.router.getActionForPathAndParams('Root'));
      const baseState = {
        base: {
          loadingVisible: false,
          currHospital: Global.getCurrHospital(),
          currArea: Global.getCurrArea(),
          screen: Global.getScreen(),
          orientation: Orientation.getInitialOrientation(),
          // 所有患者
          patients: Global.getUser() && Global.getPatients() ? Global.getPatients() : [],
          // 当前患者
          currPatient: null,
          // 院区
          inpatientAreas: Global.getUser() && Global.getUser().inpatientAreas ? Global.getUser().inpatientAreas : [],
          // 当前选择院区
          currInpatientArea: Global.getUser() && Global.getUser().inpatientAreas ? Global.getUser().inpatientAreas[0] : null,
          // 所有待办事项
          todos: [],
        },
        nav,
      };
      let originState = {
        auth: {
          isLoggedIn: false,
          user: null,
        },
        ...baseState,
      };
      if (Global.getUser()) {
        originState = {
          auth: {
            isLoggedIn: true,
            user: Global.getUser(),
          },
          ...baseState,
        };
      }
      console.log('originState in App:', originState);
      const Store = createStore(combineReducers(RootReducer), originState);
      return (
        <Provider store={Store} >
          <MainView />
        </Provider>
      );
    }

    return (
      <View style={{ flex: 1 }} onLayout={this.onLayout} >
        <PlaceHolder />
      </View>
    );
  }
}

export default App;
