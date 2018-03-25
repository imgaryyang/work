/**
 * 主导航组件
 * 采用 StackNavigator
 * by Victor
 * Created on 2017/11/13
 * Updated on 2017/11/13
 */

import React, { Component } from 'react';
import { BackHandler, View } from 'react-native';
import Toast from 'react-native-root-toast';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StackNavigator, addNavigationHelpers, NavigationActions } from 'react-navigation';

import NavigationBar from './NavigationBar';
import Routes from './Routes';
// import CurrHospitalAndPatient, { CompHeight } from '../components/common/CurrHospitalAndPatient';
import CurrHospital, { CompHeight } from '../components/common/CurrHospital';
import CurrPatient from '../components/common/CurrPatient';
import Global from '../Global';

export const MainStackNavigator = StackNavigator(Routes, {
  navigationOptions: ({ navigation, navigationOptions }) => {
    // console.log('Global navigationOptions:', navigation, navigationOptions);
    // const APPBAR_HEIGHT = Global.os === 'ios' ? 44 : 56;
    // const STATUSBAR_HEIGHT = Global.os === 'ios' ? 20 : 0;
    // const TITLE_OFFSET = Global.os === 'ios' ? 70 : 56;
    const { params } = navigation.state;
    const bottom = Global.edition === Global.EDITION_MULTI && params && params.showCurrHospitalAndPatient === true ?
      (
        <View style={{ height: CompHeight, flexDirection: 'row' }} >
          <CurrHospital
            allowSwitchHospital={params.allowSwitchHospital}
            afterChooseHospital={params.afterChooseHospital}
          />
          <CurrPatient
            allowSwitchPatient={params.allowSwitchPatient}
            afterChoosePatient={params.afterChoosePatient}
          />
        </View>
      ) : null;
    const fixedRight = Global.edition === Global.EDITION_SINGLE && params && params.showCurrHospitalAndPatient === true ?
      (
        <CurrPatient
          allowSwitchPatient={params.allowSwitchPatient}
          afterChoosePatient={params.afterChoosePatient}
        />
      ) : null;
    const bottomHeight = Global.edition === Global.EDITION_MULTI && params && params.showCurrHospitalAndPatient === true ? CompHeight : 0;
    const hideBottomLine = params && params.hideNavBarBottomLine === true;
    const hideShadow = params && params.hideShadow === true;
    return {
      header: (
        <NavigationBar
          navigation={navigation}
          navigationOptions={navigationOptions}
          bottom={bottom}
          bottomHeight={bottomHeight}
          fixedRight={fixedRight}
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
          reloadUserInfo: this.props.reloadUserInfo,
          getPatientById: this.props.getPatientById,
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
  base: state.base,
  nav: state.nav,
});

export default connect(mapStateToProps)(RootNavigation);
