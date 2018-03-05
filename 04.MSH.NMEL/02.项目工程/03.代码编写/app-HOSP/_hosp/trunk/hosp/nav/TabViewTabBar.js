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
    height: 50,
    flexDirection: 'row',
    borderWidth: 1 / PixelRatio.get(),
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopColor: '#ccc',
    backgroundColor: '#FFFFFF',
  },
});

var icons = {
  'home':             require('../res/images/base/ios-nav-icon/home@2x.png'),
  'home-active':      require('../res/images/base/ios-nav-icon/home-active@2x.png'),
  'guidance':         require('../res/images/base/ios-nav-icon/guidance@2x.png'),
  'guidance-active':  require('../res/images/base/ios-nav-icon/guidance-active@2x.png'),
  'bill':             require('../res/images/base/ios-nav-icon/bill@2x.png'),
  'bill-active':      require('../res/images/base/ios-nav-icon/bill-active@2x.png'),
  'me':               require('../res/images/base/ios-nav-icon/me@2x.png'),
  'me-active':        require('../res/images/base/ios-nav-icon/me-active@2x.png'),
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
          width: 22,
          height: 22,
          backgroundColor: 'transparent',
        }} />
        <Text style = {{color: isTabActive ? '#5ac8f2' : '#929292', fontSize: 12,}}>{tabText}</Text>
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
