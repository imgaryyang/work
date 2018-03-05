/**
 * 根导航容器
*/
'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../Global');

var SubNavigator = require('./SubNavigator');
var NavBar = require('./NavBar');
var TabBar = require('./TabBarIOS');
var TabView = require('./TabView');
var Login = require('./login');
var Register = require("./me/Register");

var Loading = require('./lib/Loading');
var Toast = require('./lib/Toast');
var RNKeyboard = require('./lib/RandomNumberKeyboard');
var Modal = require('./lib/Modal');
var UserStore = require('./stores/UserStore');
// var TimerMixin = require('react-timer-mixin');

var {
	Platform,
    View,
    StyleSheet,
    Navigator,
    Animated,
    Easing,
    BackAndroid,
} = React;

var RootNavigator = React.createClass({

	// mixins: [TimerMixin],

	timer:[],

	_nav: null,

    toastMsgs: [],

    _bbpc: 0,

    _titles: [],

	getInitialState: function () {
		return {
			subNavTopPos: new Animated.Value(Global.getScreen().height),
			showSubNav: false,
			subRoute: null,
			showLoading: false,
			USER_LOGIN_INFO: null,
			showKeyboard: false,
			RNKeyboardCB: null,
			showModal: false,
			modalComponent: null,
		};
	},

	/**
	 * 当已经退到首页时，如果按两次后退键退出app
	 */
	handleExitAppAndroid: function() {
		if(this._bbpc == 0) {
			this._bbpc = 1;
			this.clearBackButtonPressCount();
			this._toast("再按一次后退键退出小企业管家");
			return true;
		} else if(this._bbpc == 1) {
			this._bbpc = 0;
			return false;
		}
		return true;
	},

	/**
	 * 捕获一次后退键 1s 后如果未捕获第二次后退键，则将计数器清零
	 */
	clearBackButtonPressCount: function() {
		this.timer[0] = setTimeout(
            () => {
                this._bbpc = 0;
            },
            1000
        );
	},

    componentDidMount:async function() {
    	let userInfo = await UserStore.getUserInfo();
		this.setState({
			USER_LOGIN_INFO: userInfo
		});
		this.unsubscribe = UserStore.listen(this.onChange);
		//取渲染后的Navigator对象
		if(this._nav == null) this._nav = this.refs['ROOT_NAVIGATOR'];

		//注册Android的后退按钮事件
		if(Global.os == 'android') {
			BackAndroid.addEventListener('hardwareBackPress', () => {
				if (this._nav.getCurrentRoutes().length == 1) {
					return this.handleExitAppAndroid();
				}
				this._nav.pop();
				return true;
			});
		}
	},

	onChange:function(userInfo){
		this.setState({
			USER_LOGIN_INFO:userInfo
		});
	},
	componentWillUnmount:function(){

		this.unsubscribe();
		// 如果存在this.timer，则使用clearTimeout清空。
    	// 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
    	if(this.timer.length!=0){
    		for(let t in this.timer){
    			clearTimeout(t);
    		}
    	}

	},

	getCurrentRoutes: function() {
		return this._nav.getCurrentRoutes();
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

		var Component = route.component;
		// console.log('RootNavigator.push() route.component..............');
		// console.log(Component.displayName);
		if(Global.USER_LOGIN_INFO == null && Global.needLoginComp.contains(Component.displayName)){
			Component = Login;
			this._showSubNav({
				component: Component,
				hideNavBar: true,
			});
			Global.interceptedRoute = route;
			return;
		}

		//调用Navigator的push方法
		this._nav.push(route);
	},
	pop: function() {
		this._hideRNKeyboard();
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
		if(Global.interceptedRoute)
			this.push(Global.interceptedRoute);
		Global.interceptedRoute = null;
	},

	/**
	* 导航渲染场景
	*/
    _renderScene: function(route) {
        var Component = route.component;

   		if (Component) {
            return (
                <View style={[styles.scene]}>
                    {
                    	<Component 
                    		navigator={this} 
                    		route={route} 

                    		showLoading={this._showLoading} 
                    		hideLoading={this._hideLoading} 
                    		toast={this._toast} 
                    		refreshUser={this._refreshUser} 
			        		showRNKeyboard={this._showRNKeyboard} 
			        		hideRNKeyboard={this._hideRNKeyboard} 
			        		showModal={this._showModal}
			        		hideModal={this._hideModal}

                    		USER_LOGIN_INFO={this.state.USER_LOGIN_INFO} 

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
    _getSceneConfig: function() {
    	return Platform.OS === 'ios' ? Navigator.SceneConfigs.FloatFromRight : Navigator.SceneConfigs.FadeAndroid;
    },

    _getNavigator: function() {
    	return (
    		<Navigator
    			ref='ROOT_NAVIGATOR' 
	            debugOverlay={false} 
	            style={[{flex: 1}]} 
	            initialRoute={{
	            	component: Global.os === 'ios' ? TabBar : TabView,
	            	hideNavBar: true,
	            }} 
	            configureScene={(route) => {
	                if (route.sceneConfig) {
	                    return route.sceneConfig;
	                }
	                return this._getSceneConfig();
	            }} 
	            renderScene={this._renderScene} />
        );
    },

	/**
	* 显示辅助导航容器
	*/
	_showSubNav: function(route) {
		this.setState({
			showSubNav: true, 
			subRoute: route,
		}, () => {
			Animated.timing(
		       	this.state.subNavTopPos,
		       	{
		       		toValue: 0,
		       		duration: 200,
		       		easing: Easing.inOut(Easing.ease),
		       		delay: 0,
		       	},
		    ).start();
		});
	},

	_goToLogin: function() {
		this._showSubNav({
			component: Login,
			hideNavBar: true,
		});
	},

	/**
	* 隐藏辅助导航容器
	*/
	_hideSubNav: function() {
		Animated.timing(
	       	this.state.subNavTopPos,
	       	{
	       		toValue: Global.getScreen().height,
	       		duration: 200,
	       	},
	    ).start();
	},

	/**
	 * 显示载入遮罩
	 */
	_showLoading: function() {
		this.setState({showLoading: true});
	},

	/**
	 * 隐藏载入遮罩
	 */
	_hideLoading: function() {
		this.setState({showLoading: false});
	},

	/**
	 * toast message
	 */
	_toast: function(msg) {
		this.toastMsgs.push(msg);
		this.setState({toastMsgs: this.toastMsgs});
		this._clearToast();
	},

	//修改此处删除mixins参数，兼容ES6写法
    _clearToast: function() {
    	this.timer[1] = setTimeout(
    		() => {
    			this.toastMsgs.splice(0, 1);
                this.setState({toastMsgs: this.toastMsgs});
    		},
    		2000
    	);
        // this.setTimeout(
        //     () => {
        //         this.toastMsgs.splice(0, 1);
        //         this.setState({toastMsgs: this.toastMsgs});
        //     },
        //     2000
        // );
    },

    _refreshUser: function() {
    	this.setState({USER_LOGIN_INFO: Global.USER_LOGIN_INFO});
    },

    _showRNKeyboard: function(callback) {
    	this.setState({
    		showKeyboard: true,
    		RNKeyboardCB: callback,
    	});
    },

    _hideRNKeyboard: function() {
    	this.setState({
    		showKeyboard: false,
    		RNKeyboardCB: null,
    	});
    },

    _showModal: function(modalComponent) {
    	this.setState({
    		showModal: true,
    		modalComponent: modalComponent,
    	});
    },

    _hideModal: function() {
    	this.setState({
    		showModal: false,
    		//modalComponent: null,
    	});
    },

    render: function() {

        var subNav = this.state.showSubNav ? 
        	<SubNavigator 
	        	initialRoute={this.state.subRoute} 
	        	hideSubNav={this._hideSubNav} 
	        	continuePush={this._continuePush} 

        		showLoading={this._showLoading} 
        		hideLoading={this._hideLoading} 
        		toast={this._toast} 
        		refreshUser={this._refreshUser} 
        		showRNKeyboard={this._showRNKeyboard} 
        		hideRNKeyboard={this._hideRNKeyboard} 
                showModal={this._showModal}
                hideModal={this._hideModal}
        	/> 
        	: null;

        return (
        	<View style={styles.container}>
        		{this._getNavigator()}
        		<Animated.View style={[styles.subNavigator, {top: this.state.subNavTopPos}]} >
        			{subNav}
        		</Animated.View>
				<Modal show={this.state.showModal} comp={this.state.modalComponent} />
				<Loading show={this.state.showLoading} />
				<Toast msgs={this.state.toastMsgs} />
				<RNKeyboard input={this.state.RNKeyboardCB} show={this.state.showKeyboard} />
            </View>
        );
    },

});


var styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
	},
	scene: {
		flex: 1,
		backgroundColor: Global.colors.IOS_BG,
	},

	subNavigator: {
		flex: 1,
		width: Global.getScreen().width,
		height: Global.getScreen().height,
		backgroundColor: '#ffffff',
		position: 'absolute',
		left: 0,
	},
});

module.exports = RootNavigator;
