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

import NavigationBar from './NavigationBar';
import Routes from './Routes';
import CurrHospitalAndPatient, { CompHeight } from '../components/common/CurrHospitalAndPatient';
// import Global from '../Global';

export const MainStackNavigator = StackNavigator(Routes, {
  navigationOptions: ({ navigation, navigationOptions }) => {
    // console.log('Global navigationOptions:', navigation, navigationOptions);
    // const APPBAR_HEIGHT = Global.os === 'ios' ? 44 : 56;
    // const STATUSBAR_HEIGHT = Global.os === 'ios' ? 20 : 0;
    // const TITLE_OFFSET = Global.os === 'ios' ? 70 : 56;
    const { params } = navigation.state;
    const bottom = /* Global.Config.edition === Global.EDITION_MULTI && */params && params.showCurrHospitalAndPatient === true ?
      (
        <CurrHospitalAndPatient
          allowSwitchHospital={params.allowSwitchHospital}
          allowSwitchPatient={params.allowSwitchPatient}
          afterChooseHospital={params.afterChooseHospital}
          afterChoosePatient={params.afterChoosePatient}
        />
      ) : null;
    const bottomHeight = /* Global.Config.edition === Global.EDITION_MULTI && */params && params.showCurrHospitalAndPatient === true ? CompHeight : 0;
    const hideBottomLine = params && params.hideNavBarBottomLine === true;
    const hideShadow = params && params.hideShadow === true;
    return {
      header: (
        <NavigationBar
          navigation={navigation}
          navigationOptions={navigationOptions}
          bottom={bottom}
          bottomHeight={bottomHeight}
          hideBottomLine={hideBottomLine}
          hideShadow={hideShadow}
        />
      ),
    };
  },
});

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
