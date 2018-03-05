/**
 * Tab导航组件
 * 采用 TabNavigator
 * by Victor
 * Created on 2017/11/13
 * Updated on 2017/11/13
 */

import React from 'react';
import { StyleSheet, Image } from 'react-native';

import { TabNavigator } from 'react-navigation';

import Home from '../home/Home';
import CardList from '../card/CardList';
import BillList from '../bill/BillList';
import Me from '../me/Me';

const icons = {
  home: require('../../res/images/base/ios-nav-icon/home.png'),
  'home-active': require('../../res/images/base/ios-nav-icon/home-active.png'),
  card: require('../../res/images/base/ios-nav-icon/card.png'),
  'card-active': require('../../res/images/base/ios-nav-icon/card-active.png'),
  bill: require('../../res/images/base/ios-nav-icon/bill.png'),
  'bill-active': require('../../res/images/base/ios-nav-icon/bill-active.png'),
  me: require('../../res/images/base/ios-nav-icon/me.png'),
  'me-active': require('../../res/images/base/ios-nav-icon/me-active.png'),
};

const TabNavigation = TabNavigator({
  HomeTab: {
    screen: Home,
    path: '/',
    /* navigationOptions: {
      title: 'Home',
      tabBarLabel: 'Home',
      tabBarIcon: ({ tintColor, focused }) => (
        <Icon
          name={focused ? 'ios-bus' : 'ios-bus-outline'}
          size={26}
          style={{color: tintColor}}
        />
      ),
    }, */
    navigationOptions: {
      title: '首页',
      tabBarLabel: '首页',
      tabBarIcon: ({ tintColor, focused }) => (
        <Image
          source={focused ? icons['home-active'] : icons.home}
          style={[styles.icon, { tintColor }]}
        />
      ),
      showLabel: true,
      showIcon: true,
    },
  },
  CardTab: {
    screen: CardList,
    path: '/',
    navigationOptions: {
      title: '卡',
      tabBarLabel: '卡',
      tabBarIcon: ({ tintColor, focused }) => (
        <Image
          source={focused ? icons['card-active'] : icons.card}
          style={[styles.icon, { tintColor }]}
        />
      ),
      showLabel: true,
      showIcon: true,
    },
  },
  BillTab: {
    screen: BillList,
    path: '/',
    navigationOptions: {
      title: '账单',
      tabBarLabel: '账单',
      tabBarIcon: ({ tintColor, focused }) => (
        <Image
          source={focused ? icons['bill-active'] : icons.bill}
          style={[styles.icon, { tintColor }]}
        />
      ),
      showLabel: true,
      showIcon: true,
    },
  },
  MeTab: {
    screen: Me,
    path: '/',
    navigationOptions: {
      title: '我',
      tabBarLabel: '我',
      tabBarIcon: ({ tintColor, focused }) => (
        <Image
          source={focused ? icons['me-active'] : icons.me}
          style={[styles.icon, { tintColor }]}
        />
      ),
      showLabel: true,
      showIcon: true,
    },
  },
}, {
  backBehavior: 'none',
  tabBarPosition: 'bottom',
  swipeEnabled: false,
  animationEnabled: false,
});

const styles = StyleSheet.create({
  icon: {
    width: 20,
    height: 20,
  },
});

export default TabNavigation;
