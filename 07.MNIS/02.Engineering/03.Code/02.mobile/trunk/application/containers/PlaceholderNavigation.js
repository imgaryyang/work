
import React, { PureComponent } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StackNavigator, TabNavigator } from 'react-navigation';
import { tabsNavOptions } from './TabRoutes';
import Global from '../Global';

// const IndicatorScene = () => {
//   return (
//     <View style={{
//         flex: 1,
//         backgroundColor: 'white',
//         justifyContent: 'center',
//         alignItems: 'center',
//       }}
//     >
//       <ActivityIndicator />
//     </View>
//   );
// };

class IndicatorScene extends PureComponent {
  render() {
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
  }
}

class BlankScene extends PureComponent {
  render() {
    return (
      <View />
    );
  }
}

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
const Tab = TabNavigator({
  // AreaTab: {
  //   screen: IndicatorScene,
  //   navigationOptions: tabsNavOptions.area,
  // },
  BedTab: {
    screen: IndicatorScene,
    navigationOptions: tabsNavOptions.bed,
  },
  MeTab: {
    screen: BlankScene,
    navigationOptions: tabsNavOptions.me,
  },
}, {
  initialRouteName: 'BedTab',
  lazy: true,
  backBehavior: 'none',
  tabBarPosition: 'bottom',
  swipeEnabled: false,
  animationEnabled: false,
  tabBarOptions: {
    ...labelStyle,
    showIcon: true,
    activeTintColor: Global.colors.IOS_GRAY_FONT,
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
});

const Placeholder = StackNavigator({
  Root: { screen: Tab },
});

export default () => {
  return (
    <Placeholder />
  );
};
