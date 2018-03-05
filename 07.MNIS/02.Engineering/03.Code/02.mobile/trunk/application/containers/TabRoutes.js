import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

import Me from '../components/me/Me';
import AreaHome from '../components/inpatientArea';
import BedHome from '../components/sickbed';

export const titles = {
  area: '病区',
  bed: '床旁',
  me: '我的',
};

export const tabsNavOptions = {
  // area: {
  //   title: titles.area,
  //   tabBarLabel: titles.area,
  //   showLabel: true,
  //   showIcon: true,
  //   tabBarIcon: ({ tintColor, focused }) => {
  //     return (
  //       <Icon
  //         name={focused ? 'ios-browsers' : 'ios-browsers-outline'}
  //         size={26}
  //         style={{ color: tintColor }}
  //       />
  //     );
  //   },
  // },
  bed: {
    title: titles.bed,
    tabBarLabel: titles.bed,
    showLabel: true,
    showIcon: true,
    tabBarIcon: ({ tintColor, focused }) => {
      return (
        <Icon
          name={focused ? 'ios-apps' : 'ios-apps-outline'}
          size={26}
          style={{ color: tintColor }}
        />
      );
    },
  },
  me: {
    title: titles.me,
    tabBarLabel: titles.me,
    showLabel: true,
    showIcon: true,
    tabBarIcon: ({ tintColor, focused }) => {
      return (
        <Icon
          name={focused ? 'ios-person' : 'ios-person-outline'}
          size={26}
          style={{ color: tintColor }}
        />
      );
    },
  },
};

export default function TabRoutes() {
  return {
    // AreaTab: {
    //   screen: AreaHome,
    //   navigationOptions: tabsNavOptions.area,
    // },
    BedTab: {
      screen: BedHome,
      navigationOptions: tabsNavOptions.bed,
    },
    MeTab: {
      screen: Me,
      navigationOptions: tabsNavOptions.me,
    },
  };
}
