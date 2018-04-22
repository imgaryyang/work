/**
 * Tab导航组件
 * 采用 TabNavigator
 * by Victor
 * Created on 2017/11/13
 * Updated on 2017/11/13
 */
import _ from 'lodash';
import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions, TabNavigator } from 'react-navigation';
import Button from 'rn-easy-button';
import Toast from 'react-native-root-toast';
import Icon from 'rn-easy-icon';

import Global from '../Global';
import { gotoLogin } from '../actions/base/AuthAction';
import { showLoading, setCurrLocation } from '../actions/base/BaseAction';
import TabRoutes, { titles } from './TabRoutes';

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
  } : {
    labelStyle: {
      paddingBottom: 3,
    },
  };
  return {
    initialRouteName: 'HFCTab', /* Global.getUser() ? 'HCTab' : */// 'HFCTab',
    lazy: true,
    backBehavior: 'none',
    tabBarPosition: 'bottom',
    swipeEnabled: false,
    animationEnabled: false,
    tabBarOptions: {
      ...labelStyle,
      showIcon: true,
      activeTintColor: '#fe4d3d',
      inactiveTintColor: '#888888',
      style: {
        ...barHeight,
        ...topLine,
        backgroundColor: 'white',
      },
      indicatorStyle: {
        backgroundColor: 'white',
        // height: 0,
      },
    },
  };
};

class NavigatorWrappingScreen extends Component {
  constructor(props) {
    super(props);
    this.getMsgBtn = this.getMsgBtn.bind(this);
    this.onScanSuccess = this.onScanSuccess.bind(this);
  }

  componentDidMount() {
    // const user = Global.getUser();
    this.props.navigation.setParams({
      title: /* user ? titles.hc : */titles.hfc,
      // tabIdx: user ? 0 : 1,
      // headerRight: (
      //   <View style={{ flexDirection: 'row' }} >
      //     {this.getMsgBtn()}
      //     {this.getScanBtn()}
      //   </View>
      // ),
      showCurrHospitalAndPatient: false, // !!user,
      // allowSwitchHospital: true,
      // allowSwitchPatient: true,
      hideShadow: true,
    });
  }

  shouldComponentUpdate(nextProps/* , nextState*/) {
    // console.log('-------- nextProps, nextState in NavigatorWrappingScreen:\n', nextProps, nextState);
    if (nextProps.base.edition !== this.props.base.edition) return true;
    return false;
  }

  onScanSuccess(data) {
    Toast.show(`扫描成功：${data}`);
  }

  getMsgBtn() {
    return (
      <Button
        onPress={() => {
          this.props.navigate({
            component: 'Message',
            params: {
              title: '消息中心',
            },
          });
        }}
        clear
        stretch={false}
        style={{
          width: 35,
          flexDirection: 'row',
        }}
      >
        <Icon iconLib="mi" name="message" size={20} width={20} height={35} color={Global.colors.FONT_GRAY} />
      </Button>
    );
  }

  getScanBtn() {
    return (
      <Button
        onPress={() => {
          if (!this.props.disabled) {
            this.props.navigation.navigate('BarcodeScanner', {
              title: '扫一扫',
              onSuccess: this.onScanSuccess,
              shouldGoBack: true,
            });
          }
        }}
        clear
        stretch={false}
        style={{
          width: 35,
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}
      >
        <Icon iconLib="mi" name="aspect-ratio" size={20} width={20} height={35} color={Global.colors.FONT_GRAY} style={{ marginRight: 0 }} />
        {/* <Text style={{ color: Global.colors.FONT_GRAY }} >扫一扫</Text>*/}
      </Button>
    );
  }

  render() {
    // console.log('^^^ TabNavigation.render():', this.props.auth, Global.getUser());
    // console.log('~~~ this.props.screenProps:', this.props.screenProps);
    const MainTabNavigation = TabNavigator(TabRoutes(this.props.base), tabConfig(this.props.auth));
    return (
      <MainTabNavigation
        style={{ backgroundColor: 'white' }}
        onNavigationStateChange={(prevState, currentState) => {
          // console.log('prevState, currentState:', prevState, currentState);
          const { routeName } = currentState.routes[currentState.index];
          // const { auth } = this.props;
          // if (auth && !auth.isLoggedIn && _.indexOf(Global.Config.needLoginComp, routeName) !== -1) {
          //   this.props.gotoLogin();
          // }
          const tabId = _.toLower(_.replace(routeName, 'Tab', ''));
          const title = titles[tabId];
          this.props.navigation.setParams({
            title,
            hideNavBarBottomLine: tabId === 'comm'/* || (auth && auth.isLoggedIn && tabId === 'guide')*/,
            // tabIdx: currentState.index,
            showCurrHospitalAndPatient: tabId === 'guide',
            allowSwitchHospital: tabId === 'guide',
            allowSwitchPatient: tabId === 'guide',
          });
        }}
        screenProps={{
          showLoading: () => { this.props.showLoading(true); },
          hideLoading: () => { this.props.showLoading(false); },
          getCurrentLocation: callback => this.getCurrentLocation(this.props.setCurrLocation, callback),
          reloadUserInfo: this.props.screenProps.reloadUserInfo,
          getPatientById: this.props.screenProps.getPatientById,
        }}
      />
    );
  }
}

NavigatorWrappingScreen.navigationOptions = () => ({
});

const mapStateToProps = state => ({
  auth: state.auth,
  base: state.base,
});

const mapDispatchToProps = dispatch => ({
  gotoLogin: () => dispatch(gotoLogin()),
  showLoading: visible => dispatch(showLoading(visible)),
  setCurrLocation: location => dispatch(setCurrLocation(location)),
  navigate: ({ component, params }) => dispatch(NavigationActions.navigate({ routeName: component, params })),
});

export default connect(mapStateToProps, mapDispatchToProps)(NavigatorWrappingScreen);
