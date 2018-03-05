/**
 * Tab导航组件
 * 采用 TabNavigator
 * by Victor
 * Created on 2017/11/13
 * Updated on 2017/11/13
 */
import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TabNavigator } from 'react-navigation';

import Global from '../Global';
import { showLoading, setCurrLocation } from '../actions/base/BaseAction';
import TabRoutes, { titles } from './TabRoutes';
import ScannerButton from '../components/common/ScannerButton';

/* const icons = {
  hc: require('../assets/images/base/ios-nav-icon/home.png'),
  hcActive: require('../assets/images/base/ios-nav-icon/home-active.png'),
  comm: require('../assets/images/base/ios-nav-icon/home.png'),
  commActive: require('../assets/images/base/ios-nav-icon/home-active.png'),
  hfc: require('../assets/images/base/ios-nav-icon/home.png'),
  hfcActive: require('../assets/images/base/ios-nav-icon/home-active.png'),
  tools: require('../assets/images/base/ios-nav-icon/home.png'),
  toolsActive: require('../assets/images/base/ios-nav-icon/home-active.png'),
  me: require('../assets/images/base/ios-nav-icon/me.png'),
  meActive: require('../assets/images/base/ios-nav-icon/me-active.png'),
}; */

/* tabBarIcon: ({ tintColor, focused }) => (
  <Image
    source={focused ? icons.hcActive : icons.hc}
    style={[styles.icon, { tintColor }]}
  />
), */

const tabConfig = () => {
  const barHeight = Global.os === 'android' ? { height: 55 } : null;
  const topLine = Global.os === 'android' ? {
    borderTopWidth: 1 / Global.pixelRatio,
    borderTopColor: Global.colors.IOS_NAV_LINE,
  } : null;
  const labelStyle = Global.os === 'android' ? {
    labelStyle: {
      fontSize: 10,
      lineHeight: 18,
      marginTop: 0,
      padding: 0,
    },
  } : null;
  return {
    initialRouteName: 'BedTab',
    lazy: true,
    backBehavior: 'none',
    tabBarPosition: 'bottom',
    swipeEnabled: false,
    animationEnabled: false,
    tabBarOptions: {
      ...labelStyle,
      showIcon: true,
      activeTintColor: Global.colors.IOS_BLUE,
      inactiveTintColor: Global.colors.IOS_GRAY_FONT,
      style: {
        ...barHeight,
        ...topLine,
        backgroundColor: Global.colors.IOS_NAV_BG,
      },
      indicatorStyle: {
        backgroundColor: Global.colors.IOS_NAV_BG,
        height: 0,
      },
    },
  };
};

class NavigatorWrappingScreen extends Component {
  componentDidMount() {
    this.props.navigation.setParams({
      title: titles.bed,
      tabIdx: 0,
    });
    if (!this.props.auth.isLoggedIn) {
      this.props.navigation.navigate('Login');
    }
  }

  shouldComponentUpdate(/* nextProps, nextState*/) {
    // console.log('-------- nextProps, nextState in NavigatorWrappingScreen:\n', nextProps, nextState);
    return false;
  }

  render() {
    // console.log('^^^ TabNavigation.render():', this.props.auth, Global.getUser(), this.props.base);
    const MainTabNavigation = TabNavigator(TabRoutes(), tabConfig(this.props.auth));
    return (
      <MainTabNavigation
        onNavigationStateChange={(prevState, currentState) => {
          // console.log('prevState, currentState:', prevState, currentState);
          const { routeName } = currentState.routes[currentState.index];
          const { auth } = this.props;
          const title = titles[_.toLower(_.replace(routeName, 'Tab', ''))];
          // console.log(title);
          this.props.navigation.setParams({ title, tabIdx: currentState.index });
          // if (auth && !auth.isLoggedIn && _.indexOf(Global.needLoginComp, routeName) !== -1) {
          //   this.props.gotoLogin();
          // }
        }}
        screenProps={{
          showLoading: () => { this.props.showLoading(true); },
          hideLoading: () => { this.props.showLoading(false); },
          resetBackNavigate: this.props.resetBackNavigate,
          getPatient: this.props.getPatient,
          setCurrPatient: this.props.setCurrPatient,
          getCurrentLocation: callback => this.getCurrentLocation(this.props.setCurrLocation, callback),
        }}
      />
    );
  }
}

NavigatorWrappingScreen.navigationOptions = ({ navigation, screenProps }) => {
  // console.log(navigation, screenProps);
  return {
    headerTitle: navigation.state.params ? navigation.state.params.title : '首页',
    headerRight: navigation.state.params && navigation.state.params.tabIdx === 0 && Global.Config.global.funcBarcodeSupport === true ? (
      <ScannerButton type={ScannerButton.SCAN_FUNC_BARCODE} navigation={navigation} screenProps={screenProps} />
    ) : null,
  };
};

const mapStateToProps = state => ({
  auth: state.auth,
  base: state.base,
});

const mapDispatchToProps = dispatch => ({
  showLoading: visible => dispatch(showLoading(visible)),
  setCurrLocation: location => dispatch(setCurrLocation(location)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NavigatorWrappingScreen);
