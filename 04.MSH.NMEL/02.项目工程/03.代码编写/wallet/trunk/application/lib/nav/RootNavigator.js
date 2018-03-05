/**
 * 根导航容器
*/
'use strict';

import React, {
    Component,
    PropTypes,
} from 'react';

import {
    View,
    StyleSheet,
    Navigator,
    Animated,
    Easing,
    BackAndroid,
    Text,
} from 'react-native';

import * as Global 	from '../../Global';
import UserStore    from '../../flux/UserStore';
import AuthStore    from '../../flux/AuthStore';
import AuthAction   from '../../flux/AuthAction';
import InputPwdStore from '../../flux/InputPwdStore';

import SubNavigator from './SubNavigator';
import NavBar 		from 'rn-easy-navbar';
import TabBar 		from './TabBar';

import Toast 		from '../Toast';
import Loading 		from '../Loading';
import InputPwd		from '../sec/InputPwd'
import Login 		from '../../el/me/Login';

export default class RootNavigator extends Component {

	_nav 	= null;
	_timer 	= [];
    _bbpc 	= 0;

    state = {
		subNavTopPos: new Animated.Value(Global.getScreen().height),
		showSubNav: false,
		subRoute: null,
    };

    /**
    * 构造函数
    */
    constructor (props) {

        super(props);

        this.handleExitAppAndroid 			= this.handleExitAppAndroid.bind(this);
        this.clearBackButtonPressCount 		= this.clearBackButtonPressCount.bind(this);
        this.onAuthStoreChange 				= this.onAuthStoreChange.bind(this);
        this._continuePush 					= this._continuePush.bind(this);
        this._showSubNav 					= this._showSubNav.bind(this);
        this._hideSubNav 					= this._hideSubNav.bind(this);
        this._renderScene 					= this._renderScene.bind(this);
        this._getSceneConfig 				= this._getSceneConfig.bind(this);
        this._getNavigator 					= this._getNavigator.bind(this);

        this.push 							= this.push.bind(this);
        
    }

	/**
	 * 当已经退到首页时，如果按两次后退键退出app
	 */
	handleExitAppAndroid() {
		if(this._bbpc == 0) {
			this._bbpc = 1;
			this.clearBackButtonPressCount();
			this.toast("再按一次后退键退出易民生");
			return true;
		} else if(this._bbpc == 1) {
			this._bbpc = 0;
			return false;
		}
		return true;
	}

	/**
	 * 捕获一次后退键 1s 后如果未捕获第二次后退键，则将计数器清零
	 */
	clearBackButtonPressCount () {
		this._timer[0] = setTimeout(
            () => {
                this._bbpc = 0;
            },
            1000
        );
	}

    componentDidMount () {

		//监听AuthStore
		AuthStore.listen(this.onAuthStoreChange);

        this.getCurrentRoutes 				= this._nav.getCurrentRoutes;
        this.jumpBack 						= this._nav.jumpBack;
        this.jumpForward 					= this._nav.jumpForward;
        this.jumpTo 						= this._nav.jumpTo;
        this.pop 							= this._nav.pop;
        this.replace 						= this._nav.replace;
        this.replaceAtIndex 				= this._nav.replaceAtIndex;
        this.replacePrevious 				= this._nav.replacePrevious;
        this.resetTo 						= this._nav.resetTo;
        this.immediatelyResetRouteStack 	= this._nav.immediatelyResetRouteStack;
        this.popToRoute 					= this._nav.popToRoute;
        this.popToTop 						= this._nav.popToTop;

		//注册Android的后退按钮事件
		if(Global._os == 'android') {
			BackAndroid.addEventListener('hardwareBackPress', () => {
				if ( InputPwdStore.getShowState() == true ) {
					InputPwdStore.hidePwd();
					return true;
				}

				if (this._nav.getCurrentRoutes().length == 1) {
					return this.handleExitAppAndroid();
				}

				/**
				 * 这里添加一个判断页面是否需要Android物理按键返回的程序段
				*/
				const routers = this._nav.getCurrentRoutes();
				if (routers.length > 1) {
					const top = routers[routers.length - 1];
					if (top.ignoreBack || top.component.ignoreBack) {
						return true;
					}
				}

				this._nav.pop();
				return true;
			});
		}
	}

	/**
	 * 监听AuthStore变化，如果遇到需要登录的请求，则转向到登录
	 * @param  {[type]} auth [description]
	 * @return {[type]}      [description]
	 */
	onAuthStoreChange (auth) {
		//console.log(auth);
		//TODO:跳转到登录
		if(auth.needLogin) {

			this._showSubNav({
				component: Login,
				hideNavBar: true,
			});

			//将需要登录指令清空
			AuthAction.clearNeedLogin();
		} else if(auth.continuePush) {
			this._continuePush();
		}
	}

	componentWillUnmount () {
		
		// 如果存在this._timer，则使用clearTimeout清空。
    	// 如果你使用多个_timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
    	if(this._timer.length!=0){
    		for(let t in this._timer){
    			clearTimeout(t);
    		}
    	}

	}

	push (route) {
		var Component = route.component;
		/*console.log('===================== Component displayName in push.');
		console.log(Component);
		console.log(Component.displayName);*/
		if(UserStore.getUser() == null && Global._needLoginComp.contains(Component.displayName)){
			//console.log('===================== needLogin when push.');
			AuthAction.needLogin(route);
			return;
		}

		//调用Navigator的push方法
		this._nav.push(route);
	}

	/**
	 * 恢复跳转到被阻断的场景
	 */
	_continuePush () {
		//console.log('%%%%%%%%%%%%%%%%%%%%%% continuePush');

		//隐藏登录导航容器
		this._hideSubNav();

		//如果存在被阻断的场景路由，则重新跳转到该场景
		if(AuthStore.getInterceptedRoute())
			this.push(AuthStore.getInterceptedRoute());

		//跳转后清空被阻断的场景路由
		AuthAction.clearInterceptedRoute();

		//跳转后清空继续跳转状态
		AuthAction.clearContinuePush();
	}

	/**
	* 显示辅助导航容器
	*/
	_showSubNav (route) {
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
	}

	/**
	* 隐藏辅助导航容器
	*/
	_hideSubNav () {
		Animated.timing(
	       	this.state.subNavTopPos,
	       	{
	       		toValue: Global.getScreen().height,
	       		duration: 200,
	       	},
	    ).start();
	}

	/**
	* 导航渲染场景
	*/
    _renderScene (route) {
        var Component = route.component;
   		if (Component) {
            return (
                <View style = {[styles.scene]}>
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
                    {
                    	<Component 
                    		navigator = {this} 
                    		route = {route} 
                    		{...route.passProps} 
                    	/>
                    }
                </View>
            );
        }
    }

    /**
     * 场景切换配置文件
    */
    _getSceneConfig () {
    	return Global._os == 'ios' ? Navigator.SceneConfigs.PushFromRight : Navigator.SceneConfigs.FadeAndroid;
    }

    /**
     * 取主导航容器
     */
    _getNavigator () {
    	return (
    		<Navigator
    			ref 			= {(c) => this._nav = c} 
	            debugOverlay 	= {false} 
	            style 			= {[{flex: 1}]} 
	            initialRoute 	= {{
	            	component: 	TabBar,
	            	hideNavBar: true,
	            }} 
	            configureScene	= {this._getSceneConfig} 
	            renderScene 	= {this._renderScene} 
	        />
        );
    }

    render () {

        var subNav = this.state.showSubNav ? 
        	<SubNavigator 
 	        	initialRoute = {this.state.subRoute} 
 	        	hideSubNav = {this._hideSubNav} 
         	/> 
        	: null;

        return (
        	<View style = {styles.container}>
        		{this._getNavigator()}
        		<Animated.View style = {[styles.subNavigator, {top: this.state.subNavTopPos}]} >
        			{subNav}
        		</Animated.View>
        		<InputPwd />
        		<Loading />
        		<Toast />
            </View>
        );
    }

}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
	},
	scene: {
		flex: 1,
		backgroundColor: Global._colors.VIEW_BG,
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


