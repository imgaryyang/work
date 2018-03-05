
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StackNavigator, TabNavigator } from 'react-navigation';
import { tabsNavOptions } from './TabRoutes';
import Global from '../Global';

const BlankScene = () => {
  return (<View style={{ flex: 1, backgroundColor: 'white' }} />);
};
BlankScene.navigationOptions = {
  header: null,
};
const IndicatorScene = () => {
  return (
    <View style={{
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ActivityIndicator />
    </View>
  );
};
IndicatorScene.navigationOptions = {
  header: null,
};

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
const Tab = TabNavigator({
  HFCTab: {
    screen: IndicatorScene,
    navigationOptions: tabsNavOptions.hfc,
  },
  // HCTab: {
  //   screen: IndicatorScene,
  //   navigationOptions: tabsNavOptions.hc,
  // },
  CommTab: {
    screen: BlankScene,
    navigationOptions: tabsNavOptions.comm,
  },
  // ToolsTab: {
  //   screen: BlankScene,
  //   navigationOptions: tabsNavOptions.tools,
  // },
  GuideTab: {
    screen: BlankScene,
    navigationOptions: tabsNavOptions.guide,
  },
  MeTab: {
    screen: BlankScene,
    navigationOptions: tabsNavOptions.me,
  },
}, {
  initialRouteName: 'HFCTab',
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
  navigationOptions: {
    header: null,
  },
});

const Placeholder = StackNavigator({
  Root: { screen: Tab },
});

export default () => {
  return (
    <Placeholder />
  );
};
