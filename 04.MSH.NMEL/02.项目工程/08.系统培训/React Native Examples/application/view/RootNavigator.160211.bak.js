/**
	根导航栏
*/
'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../Global');
var MngIdx = require('./mng/MngIdx');
var SampleList = require('./sample/list');

var NavBar = require('./NavBar');
var TabBar = require('./TabBarIOS');
var TabView = require('./TabView');
var Login = require('./login');
var Register = require("./me/Register");

var {
	Animated,
    TouchableOpacity,
    View,
    Text,
    PixelRatio,
    Dimensions,
    StyleSheet,
    Platform,
    Navigator,
    Easing,
} = React;

//var _navigator ;//全局navigator
var RootNavigator = React.createClass({

	getInitialState: function (){
		return {
			pushInRoot: false,
			route: null,
			scale: new Animated.Value(1),
		};
	},

	//缩小主视图
	shrinkMainScene: function() {
		/*Animated.spring(
	       	this.state.scale,
	       	{
	       		toValue: 0.85,
	       		friction: 5,
	       		tension: 70,
	       	},
	    ).start(()=>{});*/
		Animated.timing(
	       	this.state.scale,
	       	{
	       		toValue: 0.85,
	       		duration: 200,
	       	},
	    ).start();
	},

	//还原主视图
	restoreMainScene: function() {
		Animated.timing(
	       	this.state.scale,
	       	{
	       		toValue: 1,
	       		duration: 200,
	       	},
	    ).start();
	},

	//使用 RootNavigator 导航
	push: function(route) {
		//this.shrinkMainScene();
		this.setState({
			pushInRoot: true,
			route: route,
		});
	},

	//关闭导航视图
	closeRootNav: function () {
		this.setState({
			pushInRoot: false,
		});
	},

    render: function() {
		var mainScene = Global.os === 'ios' ? (<TabBar rootNavigator={this} />) : (<TabView rootNavigator={this} />);//(<TabView rootNavigator={this} />);
        return (
        	<View style={styles.container}>
        		<View style={styles.bgView} />
        		<Animated.View 
        			style={[styles.mainScene, {transform: [{scale: this.state.scale}]}]}>
        			{mainScene}
        		</Animated.View>
            	<NavView 
            		pushInRoot={this.state.pushInRoot} 
            		route={this.state.route} 
            		rootNavigator={this} />
            </View>
        );
    }
});

var NavView = React.createClass({

	getInitialState: function() {
		return {
			slideAnim: new Animated.Value(Global.getScreen().height),
			showMask: false,
			pushInRoot: false,
			route: null,
			renderScene: false,
		};
	},

	/**
	* 隐藏遮罩
	*/
	hideMask: function() {
		this.setState({
			showMask: false,
		});
	},

	/**
	* 导航容器渲染完毕后开始渲染场景
	*/
	doRenderScene: function() {
		this.setState({
			renderScene: true,
		})
	},

	/**
	* 显示根导航容器
	*/
	showRootNav: function() {
		/*Animated.spring(
	       	this.state.slideAnim,
	       	{
	       		toValue: 0,
	       		friction: 6,
	       		tension: 50,
	       		duration: 50,
	       	},
	    ).start();*/
		Animated.timing(
	       	this.state.slideAnim,
	       	{
	       		toValue: 0,
	       		duration: 200,
	       		easing: Easing.inOut(Easing.ease),
	       		delay: 0,
	       	},
	    ).start();
	},

	/**
	* 隐藏根导航容器
	*/
	hideRootNav: function() {
		Animated.timing(
	       	this.state.slideAnim,
	       	{
	       		toValue: Global.getScreen().height,
	       		duration: 200,
	       	},
	    ).start(this.hideMask);
	},

	/**
	* 组件接收参数变化
	*/
	componentWillReceiveProps: function(props) {
		console.log("**************"+props);
		this.setState(props);
		if(props.pushInRoot){
			this.showRootNav();
			this.props.rootNavigator.shrinkMainScene();
			this.setState({
				showMask: true,
			});
		} else {
			this.hideRootNav();
			this.props.rootNavigator.restoreMainScene();
		}
	},

	/**
	* 导航渲染场景
	*/
	
    renderScene: function(route, navigator) {
    	console.log('**************route in renderscene:');
    	//console.log(route);
    	//_navigator = navigator;
        var Component = route.component;
        var rootNavigator = this.props.rootNavigator;
       	console.log(Component.displayName);
       	//console.log(Global.USER_LOGIN_INFO)
       if(Global.USER_LOGIN_INFO == null && Component.displayName != 'Register'){
       		Component = Login;
       } else if(Global.USER_LOGIN_INFO == null && Component.displayName == 'Register'){
       		Component = Register;
       }
   		if (Component) {
            return (
                <View style={[styles.scene]}>
                    {<Component navigator={navigator} route={route} rootNavigator={rootNavigator} {...route.passProps} />}
                    {route.hideNavBar === true ? null : React.createElement(NavBar, { rootNavigator, navigator, route, })}
                </View>
            );
        }
       
        
    },

    _getSceneConfig: function() {
    	return Platform.OS === 'ios' ? Navigator.SceneConfigs.FloatFromRight : Navigator.SceneConfigs.FadeAndroid;
    },

	render: function() {
		var nav = null;
		if(this.props.pushInRoot && this.props.route)
			nav = (<Navigator
	            debugOverlay={false}
	            style={[{flex: 1}]}
	            initialRoute={this.state.route}
	            configureScene={(route) => {
	                if (route.sceneConfig) {
	                    return route.sceneConfig;
	                }
	                return this._getSceneConfig();
	            }}
	            renderScene={this.renderScene} />
	        );
		var maskHeight = this.state.showMask ? Global.getScreen().height : 0;
        return (
        	<View style={[styles.mask, {height: maskHeight}]}>
	        	<Animated.View style={[styles.rootNavigator, {top: this.state.slideAnim}]}>
		        	{nav}
	        	</Animated.View>
        	</View>
        );
    },
});

var styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
	},
	bgView: {
		backgroundColor: '#000000',
		position: 'absolute',
		width: Global.getScreen().width,
		height: Global.getScreen().height,
	},
	mainScene: {
		flex: 1, 
		overflow: 'hidden', 
	},
	rootNavigator: {
		width: Global.getScreen().width,
		height: Global.getScreen().height,
        position: 'absolute',
        left: 0,
        backgroundColor: 'rgba(255, 255, 255, 1)',
	},
	scene: {
		flex: 1,
		backgroundColor: Global.colors.IOS_BG,
	},
	mask: {
		width: Global.getScreen().width,
		height: Global.getScreen().height,
        position: 'absolute',
        top: 0,
        left: 0,
		backgroundColor: 'rgba(0, 0, 0, .75)',
	},
});

module.exports = RootNavigator;
