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
} from 'react-native';

import Icon         from 'react-native-vector-icons/Ionicons';

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
    var iconSize = parseInt(nameArr[3]);
    return (
      <TouchableOpacity key = {name} onPress = {() => this.props.goToPage(page)} style = {[styles.tab]}>
        <Icon style = {{textAlign: 'center',}} name = {isTabActive ? iconActive : icon} size = {iconSize} color = {isTabActive ? '#007aff' : '#929292'}/>
        <Text style = {{color: isTabActive ? '#007aff' : '#929292', fontSize: 12,}}>{tabText}</Text>
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
