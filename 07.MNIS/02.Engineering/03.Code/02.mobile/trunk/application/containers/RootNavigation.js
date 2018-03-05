/**
 * 主导航组件
 * 采用 StackNavigator
 * by Victor
 * Created on 2017/11/13
 * Updated on 2017/11/13
 */

import React, { Component } from 'react';
import { BackHandler } from 'react-native';
import Toast from 'react-native-root-toast';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StackNavigator, addNavigationHelpers, NavigationActions } from 'react-navigation';

import Routes from './Routes';

export const MainStackNavigator = StackNavigator(Routes);

class RootNavigation extends Component {
  constructor(props) {
    super(props);
    this.onBackAndroid = this.onBackAndroid.bind(this);
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
  }

  onBackAndroid() {
    const { dispatch, nav } = this.props;
    // console.log('nav:', nav);
    if (nav.index === 0) {
      if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
        // 最近2秒内按过back键，可以退出应用。
        return false;
      }
      this.lastBackPressed = Date.now();
      Toast.show('再按一次将退出应用');
      return true;
    }
    // 如果是登录界面，禁止后退
    if (nav.routes[nav.index].routeName === 'Login') {
      return true;
    }
    dispatch(NavigationActions.back());
    return true;
  }

  render() {
    // console.log('this.props in RootNavigation:', this.props);
    return (
      <MainStackNavigator
        navigation={addNavigationHelpers({
          dispatch: this.props.dispatch,
          state: this.props.nav,
        })}
        screenProps={{
          showLoading: () => { this.props.showLoading(true); },
          hideLoading: () => { this.props.showLoading(false); },
          resetBackNavigate: this.props.resetBackNavigate,
          getPatient: this.props.getPatient,
          setCurrPatient: this.props.setCurrPatient,
          getCurrentLocation: (callback) => {
            this.props.getCurrentLocation(callback);
          },
        }}
      />
    );
  }
}

RootNavigation.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(RootNavigation);
