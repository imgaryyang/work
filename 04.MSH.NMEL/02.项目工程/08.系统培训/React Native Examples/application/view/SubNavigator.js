

/**
 * 根导航容器
*/
'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../Global');

var NavBar = require('./NavBar');

var {
	Platform,
    View,
    StyleSheet,
    Navigator,
    Animated,
    Easing,
} = React;

var SubNavigator = React.createClass({

	_nav: null,

    toastMsgs: [],

	getInitialState: function () {
		return {
			initialRoute: this.props.initialRoute,
			showLoading: false,
			USER_LOGIN_INFO: Global.USER_LOGIN_INFO,
		};
	},

    componentDidMount: function() {
		//取渲染后的Navigator对象
		if(this._nav == null) this._nav = this.refs['SUB_NAVIGATOR'];
	},

	getCurrentRoutes: function() {
		if(this._nav)
			return this._nav.getCurrentRoutes();
		return null;
	},
	jumpBack: function() {
		this._nav.jumpBack();
	},
	jumpForward: function() {
		this._nav.jumpForward();
	},
	jumpTo: function(route) {
		this._nav.jumpTo(route);
	},
	push: function(route) {
		//console.log('RootNavigator.push()..............');
		//console.log(route);

		//调用Navigator的push方法
		this._nav.push(route);
	},
	pop: function() {
		if(this._nav.getCurrentRoutes().length == 1) {
			this.props.hideSubNav();
			return;
		}
		this.props.hideRNKeyboard();
		this._nav.pop();
	},
	replace: function(route) {
		this._nav.replace(route);
	},
	replaceAtIndex: function(route, index) {
		this._nav.replaceAtIndex(route, index);
	},
	replacePrevious: function(route) {
		this._nav.replacePrevious(route);
	},
	resetTo: function(route) {
		this._nav.resetTo(route);
	},
	immediatelyResetRouteStack: function(routeStack) {
		this._nav.immediatelyResetRouteStack(routeStack);
	},
	popToRoute: function(route) {
		this._nav.popToRoute(route);
	},
	popToTop: function() {
		this._nav.popToTop();
	},

	_continuePush: function() {
		this.setState({USER_LOGIN_INFO: Global.USER_LOGIN_INFO});
		this.props.hideSubNav();
		this.props.continuePush();
	},

	/**
	* 导航渲染场景
	*/
    _renderSubScene: function(route) {
        var Component = route.component;

   		if (Component) {
            return (
                <View style={[styles.scene]}>
                    {
                    	<Component 
                    		navigator={this} 
                    		route={route} 

                    		showLoading={this.props.showLoading} 
                    		hideLoading={this.props.hideLoading} 
                    		toast={this.props.toast} 
                    		refreshUser={this.props.refreshUser} 

                    		USER_LOGIN_INFO={this.state.USER_LOGIN_INFO} 
                    		showRNKeyboard={this.props.showRNKeyboard}
                    		hideRNKeyboard={this.props.hideRNKeyboard}
                    		continuePush={this._continuePush} 
                    		{...route.passProps} 
                    	/>
                   	}
                    {
                    	route.hideNavBar === true ? null : 
                    		React.createElement(
                    			NavBar, 
                    			{ 
                    				navigator: this, 
                    				route: route, 
                    			}
                    		)
                    }
                </View>
            );
        }
    },

    /**
     * 场景切换配置文件
    */
    _getSubSceneConfig: function() {
    	return Platform.OS === 'ios' ? Navigator.SceneConfigs.FloatFromRight : Navigator.SceneConfigs.FadeAndroid;
    },

    render: function() {
        return (
    		<Navigator
    			ref='SUB_NAVIGATOR' 
	            debugOverlay={false} 
	            style={{flex: 1}} 
	            initialRoute={this.state.initialRoute} 
	            configureScene={(route) => {
	                if (route.sceneConfig) {
	                    return route.sceneConfig;
	                }
	                return this._getSubSceneConfig();
	            }} 
	            renderScene={this._renderSubScene} />
        );
    }
});

var styles = StyleSheet.create({
	scene: {
		flex: 1,
		backgroundColor: Global.colors.IOS_BG,
	},
});

module.exports = SubNavigator;
