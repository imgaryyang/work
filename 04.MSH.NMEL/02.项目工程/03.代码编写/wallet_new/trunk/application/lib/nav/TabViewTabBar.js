'use strict';

import React, {
    Component,
    PropTypes,
} from 'react';

import {
  StyleSheet,
  Text,
  View,
  PixelRatio,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';

import * as Global from "../../Global";

var deviceWidth = Dimensions.get('window').width;
var TAB_UNDERLINE_REF = 'TAB_UNDERLINE';

var styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 0,
  },

  tabs: {
    height: 52,
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingVertical:5,
    borderTopColor: Global.Color.LIGHTER_GRAY,
    borderTopWidth: 1/Global._pixelRatio,
  },
});

var icons = {
  'tab_home':         require('../../res/images/base/nav-icon/tab_home.png'),
  'tab_home_pre':  require('../../res/images/base/nav-icon/tab_home_pre.png'),
  'tab_wallet':         require('../../res/images/base/nav-icon/tab_wallet.png'),
  'tab_wallet_pre':  require('../../res/images/base/nav-icon/tab_wallet_pre.png'),
  'tab_shop':         require('../../res/images/base/nav-icon/tab_shop.png'),
  'tab_shop_pre':  require('../../res/images/base/nav-icon/tab_shop_pre.png'),
  'tab_man':           require('../../res/images/base/nav-icon/tab_man.png'),
  'tab_man_pre':    require('../../res/images/base/nav-icon/tab_man_pre.png'),
};

var TabViewTabBar = React.createClass({
  propTypes: {
    goToPage: React.PropTypes.func,
    activeTab: React.PropTypes.number,
    tabs: React.PropTypes.array
  },

  renderTabOption(name, page) {
    var isTabActive = this.props.activeTab === page;
    var nameArr = name.split('|');
    var tabText = nameArr[0];
    var icon = nameArr[1];
    var iconActive = nameArr[2];

    var iconImg = isTabActive ? icons[iconActive] : icons[icon];

    return (
      <TouchableOpacity key = {name} onPress = {() => this.props.goToPage(page)} style = {[styles.tab]} >
        <Image resizeMode = 'cover' source = {iconImg} style = {{
          width: 23,
          height: 23,
          backgroundColor: 'transparent',
        }} />
        <Text style = {{color: isTabActive ? Global.Color.RED: Global.Color.DARK_GRAY, fontSize: Global.FontSize.SMALL,}}>{tabText}</Text>
      </TouchableOpacity>
    );
  },

  setAnimationValue(value) {
    
  },

  render() {
    var numberOfTabs = this.props.tabs.length;
    var tabUnderlineStyle = {
      position: 'absolute',
      width: deviceWidth / numberOfTabs,
      height: 0,
      backgroundColor: 'navy',
      bottom: 0,
    };

    return (
      <View style = {styles.tabs}>
        {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
      </View>
    );
  },
});

module.exports = TabViewTabBar;
