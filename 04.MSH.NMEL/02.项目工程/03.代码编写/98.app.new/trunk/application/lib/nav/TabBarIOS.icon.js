/**
 * 主TabBar导航
 */
'use strict';

import React, {
  Component,
} from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TabBarIOS,
  TouchableOpacity,
  PixelRatio,
} from 'react-native';

import Icon         from 'react-native-vector-icons/Ionicons';

import Home         from '../../el/home/Home';
import CardList     from '../../el/card/CardList';
import BillList     from '../../el/bill/BillList';
import Me           from '../../el/me/Me';

export default class TabBar extends Component {

  static displayName = 'TabBarIOS';
  static description = 'Tab-based navigation';

  state = {
    selectedTab: 'homeTab',
    notifCount: 0,
    presses: 0,
    USER_LOGIN_INFO: null,
  };

  render () {
    return (
      <TabBarIOS
        style = {[styles.tabBar]}
        tintColor = "#007aff"
        barTintColor = "white">

        <Icon.TabBarItem
          iconName = "ios-home-outline"
          selectedIconName = "ios-home"
          iconSize = {25}
          title = "首页"
          selected = {this.state.selectedTab === 'homeTab'}
          onPress = {() => {
            this.setState({
              selectedTab: 'homeTab',
              NavTitle: '首页',
            });
            this.NavTitle = '首页';
          }}>
          <Home {...this.props} />
        </Icon.TabBarItem>

        <Icon.TabBarItem
          iconName = "ios-card-outline"
          selectedIconName = "ios-card"
          iconSize = {24}
          title = "卡"
          selected = {this.state.selectedTab === 'cardTab'}
          onPress = {() => {
            this.setState({
              selectedTab: 'cardTab',
              NavTitle: '卡',
            });
            this.NavTitle = '卡';
          }}>
          <CardList {...this.props} />
        </Icon.TabBarItem>

        <Icon.TabBarItem
          iconName = "ios-paper-outline"
          selectedIconName = "ios-paper"
          iconSize = {24}
          title = "账单"
          selected = {this.state.selectedTab === 'billTab'}
          onPress = {() => {
            this.setState({
              selectedTab: 'billTab',
              NavTitle: '账单',
            });
            this.NavTitle = '账单';
          }}>
          <BillList {...this.props} />
        </Icon.TabBarItem>

        <Icon.TabBarItem
          iconName = "ios-person-outline"
          selectedIconName = "ios-person"
          iconSize = {30}
          title = "我"
          selected = {this.state.selectedTab === 'meTab'}
          onPress = {() => {
            this.setState({
              selectedTab: 'meTab',
              NavTitle: '我',
            });
            this.NavTitle = '我';
          }}>
          <Me {...this.props} />
        </Icon.TabBarItem>

      </TabBarIOS>
    );
  }
}

const styles = StyleSheet.create({
  tabBar: {
    flex: 1,
    flexDirection : 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});


