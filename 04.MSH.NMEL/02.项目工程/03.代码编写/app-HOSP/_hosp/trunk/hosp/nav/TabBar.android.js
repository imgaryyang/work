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

import ScrollableTabView    from 'react-native-scrollable-tab-view';

import * as Global      from 'elapp/Global';

import Home             from '../Home';
import OutpatientGuidanceList from 'elapp/elh/outpatient/OutpatientGuidanceList';
import Bill             from 'elapp/el/bill/BillList';
import Me               from '../me/Me';

import TabBar           from './TabViewTabBar';


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
				style = {{}} >

				<Home 					 runInTab = {true} tabLabel = "首页|home|home-active" 			{...this.props} />
				<OutpatientGuidanceList  runInTab = {true} tabLabel = "导诊|guidance|guidance-active"	{...this.props} hideBackButton = {true} inTab = {true} />
				<Bill 					 runInTab = {true} tabLabel = "账单|bill|bill-active"  			{...this.props} />
				<Me   					 runInTab = {true} tabLabel = "我|me|me-active"     				{...this.props} />

			</ScrollableTabView>
		);
	},
});


var styles = StyleSheet.create({
});


module.exports = TabView;
