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

				<Home		runInTab = {true} tabLabel = "首页|home|home-active" 	{...this.props} />
				<CardList	runInTab = {true} tabLabel = "卡|card|card-active"   	{...this.props} />
				<BillList	runInTab = {true} tabLabel = "账单|bill|bill-active"  	{...this.props} />
				<Me			runInTab = {true} tabLabel = "我|me|me-active"     		{...this.props} />

			</ScrollableTabView>
		);
	},
});


var styles = StyleSheet.create({
});


module.exports = TabView;
