/* Android 使用的TabBar */
'use strict';

import React, {
    Component,
    PropTypes,
} from 'react';

import {
  StyleSheet,
  PixelRatio,
  Dimensions,
} from 'react-native';

import Icon                 from 'react-native-vector-icons/Ionicons';
import ScrollableTabView    from 'react-native-scrollable-tab-view';
import TabBar               from './TabViewTabBar';

import Home         from '../../el/home/Home';
import CardList     from '../../el/card/CardList';
import BillList     from '../../el/bill/BillList';
import Me           from '../../el/me/Me';

var TabView = React.createClass({

	getInitialState: function () {
		return {
            selected: '',
            USER_LOGIN_INFO: null,
		};
	},

	onTabItemPress: function (name) {
		console.log(`click on ${name} item`);
		console.log('**********${name}'+name);
		this.setState({
			selected: name
		});
	},

    componentWillReceiveProps: function(props) {
        
    },

	render: function() {
		var state = this.state;
		return (
			<ScrollableTabView 
				tabBarPosition = 'bottom' 
				locked = {true}
				edgeHitWidth = {Dimensions.get('window').width / 2} 
				renderTabBar = {() => <TabBar />} 
				style = {{}}>

				<Home tabLabel = "首页|ios-home-outline|ios-home|25" {...this.props} />
				<CardList tabLabel = "卡|ios-card-outline|ios-card|24"   {...this.props} />
				<BillList tabLabel = "账单|ios-paper-outline|ios-paper|24"     {...this.props} />
				<Me   tabLabel = "我|ios-person-outline|ios-person|30"     {...this.props} />

			</ScrollableTabView>
		);
	},
});


var styles = StyleSheet.create({
});


module.exports = TabView;
