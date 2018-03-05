/* Android 使用的TabBar */
'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');

var ScrollableTabView = require('react-native-scrollable-tab-view');
var TabBar = require('./TabViewTabBar');

var MngIdx = require('./mng/MngIdx');
var Assets = require('./assets/Assets');
var Credit = require('./credit/Credit');
var Invest = require('./invest/Invest');
var Me = require('./me/Me');
var SampleList = require('./sample/list');


var {
	StyleSheet,
	View,
	Text,
    PixelRatio,
	Dimensions,
	ScrollView,
} = React;

var TabView = React.createClass({

	getInitialState: function () {
		return {
			//selected: 'test1'
            USER_LOGIN_INFO: this.props.USER_LOGIN_INFO,
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
        this.setState({USER_LOGIN_INFO: props.USER_LOGIN_INFO});
    },

	render: function() {
		var state = this.state;

		return (
			<ScrollableTabView 
				tabBarPosition='bottom' 
				locked={true}
				edgeHitWidth={Dimensions.get('window').width / 2} 
				renderTabBar={() => <TabBar />} 
				style={{}}>

				<MngIdx tabLabel="管理|ios-navigate-outline|ios-navigate|25" 
					navigator={this.props.navigator} 
                    route={this.props.route} 
					USER_LOGIN_INFO={this.state.USER_LOGIN_INFO} 
                    showLoading={this.props.showLoading} 
                    hideLoading={this.props.hideLoading} 
                    toast={this.props.toast} 
                    refreshUser={this.props.refreshUser} 
                    showRNKeyboard={this.props.showRNKeyboard} 
                    hideRNKeyboard={this.props.hideRNKeyboard} 
                    showModal={this.props.showModal}
                    hideModal={this.props.hideModal}
                />
				<Assets tabLabel="资产|ios-briefcase-outline|ios-briefcase|24" 
					navigator={this.props.navigator} 
                    route={this.props.route} 
					USER_LOGIN_INFO={this.state.USER_LOGIN_INFO} 
                    showLoading={this.props.showLoading} 
                    hideLoading={this.props.hideLoading} 
                    toast={this.props.toast} 
                    refreshUser={this.props.refreshUser} 
                    showRNKeyboard={this.props.showRNKeyboard} 
                    hideRNKeyboard={this.props.hideRNKeyboard} 
                    showModal={this.props.showModal}
                    hideModal={this.props.hideModal}
                />
				<Credit tabLabel="融资|ios-analytics-outline|ios-analytics|24" 
					navigator={this.props.navigator} 
                    route={this.props.route} 
					USER_LOGIN_INFO={this.state.USER_LOGIN_INFO} 
                    showLoading={this.props.showLoading} 
                    hideLoading={this.props.hideLoading} 
                    toast={this.props.toast} 
                    refreshUser={this.props.refreshUser} 
                    showRNKeyboard={this.props.showRNKeyboard} 
                    hideRNKeyboard={this.props.hideRNKeyboard} 
                    showModal={this.props.showModal}
                    hideModal={this.props.hideModal}
                />
				<Invest tabLabel="理财|ios-box-outline|ios-box|30" 
					navigator={this.props.navigator} 
                    route={this.props.route} 
					USER_LOGIN_INFO={this.state.USER_LOGIN_INFO} 
                    showLoading={this.props.showLoading} 
                    hideLoading={this.props.hideLoading} 
                    toast={this.props.toast} 
                    refreshUser={this.props.refreshUser} 
                    showRNKeyboard={this.props.showRNKeyboard} 
                    hideRNKeyboard={this.props.hideRNKeyboard} 
                    showModal={this.props.showModal}
                    hideModal={this.props.hideModal}
                />
				<Me tabLabel="我|ios-person-outline|ios-person|30" 
					navigator={this.props.navigator} 
                    route={this.props.route} 
					USER_LOGIN_INFO={this.state.USER_LOGIN_INFO} 
                    showLoading={this.props.showLoading} 
                    hideLoading={this.props.hideLoading} 
                    toast={this.props.toast} 
                    refreshUser={this.props.refreshUser} 
                    showRNKeyboard={this.props.showRNKeyboard} 
                    hideRNKeyboard={this.props.hideRNKeyboard} 
                    showModal={this.props.showModal}
                    hideModal={this.props.hideModal}
                />

			</ScrollableTabView>
		);
	},
});


var styles = StyleSheet.create({
});


module.exports = TabView;
