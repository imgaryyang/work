/**
 * 登录、注册导航容器
*/
'use strict';

import React, {
    Component,
    PropTypes,
} from 'react';

import {
	Platform,
    View,
    StyleSheet,
    Navigator,
    Animated,
    Easing,
} from 'react-native';

import * as Global 	from '../../Global';
import Icon 		from 'react-native-vector-icons/Ionicons';

import NavBar 		from 'rn-easy-navbar';

export default class SubNavigator extends Component {

	_nav = null;

	static propTypes = {

        /**
         * 隐藏登录、注册导航
         * 必填
         */
        hideSubNav: PropTypes.func.isRequired,

        /**
         * 初始化路由（登录场景）
         * 必填
         */
        initialRoute: PropTypes.object.isRequired,
    };

	state = {
	};

    /**
    * 构造函数
    */
    constructor (props) {

        super(props);

        this._renderSubScene 				= this._renderSubScene.bind(this);
        this._getSubSceneConfig 			= this._getSubSceneConfig.bind(this);
        this.pop                            = this.pop.bind(this);
    }

    componentDidMount () {
        this.getCurrentRoutes               = this._nav.getCurrentRoutes;
        this.jumpBack                       = this._nav.jumpBack;
        this.jumpForward                    = this._nav.jumpForward;
        this.jumpTo                         = this._nav.jumpTo;
        this.push                           = this._nav.push;
        this.replace                        = this._nav.replace;
        this.replaceAtIndex                 = this._nav.replaceAtIndex;
        this.replacePrevious                = this._nav.replacePrevious;
        this.resetTo                        = this._nav.resetTo;
        this.immediatelyResetRouteStack     = this._nav.immediatelyResetRouteStack;
        this.popToRoute                     = this._nav.popToRoute;
        this.popToTop                       = this._nav.popToTop;
	}

	getCurrentRoutes () {
		if(this._nav)
			return this._nav.getCurrentRoutes();
		return null;
	}
	jumpBack () {
		this._nav.jumpBack();
	}
	jumpForward () {
		this._nav.jumpForward();
	}
	jumpTo (route) {
		this._nav.jumpTo(route);
	}
	push (route) {
		//调用Navigator的push方法
		this._nav.push(route);
	}
	pop () {
		if(this._nav.getCurrentRoutes().length == 1) {
			this.props.hideSubNav();
			return;
		}
		this._nav.pop();
	}
	replace (route) {
		this._nav.replace(route);
	}
	replaceAtIndex (route, index) {
		this._nav.replaceAtIndex(route, index);
	}
	replacePrevious (route) {
		this._nav.replacePrevious(route);
	}
	resetTo (route) {
		this._nav.resetTo(route);
	}
	immediatelyResetRouteStack (routeStack) {
		this._nav.immediatelyResetRouteStack(routeStack);
	}
	popToRoute (route) {
		this._nav.popToRoute(route);
	}
	popToTop () {
		this._nav.popToTop();
	}

	/**
	* 导航渲染场景
	*/
    _renderSubScene (route) {
        var Component = route.component;

   		if (Component) {
            return (
                <View style = {[styles.scene]}>
                    {
                    	<Component 
                    		navigator = {this} 
                    		route = {route} 
                    		{...route.passProps} 
                    	/>
                   	}
                    {
                    	route.hideNavBar == true ? null : 
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
    }

    /**
     * 场景切换配置文件
    */
    _getSubSceneConfig () {
    	return Global._os == 'ios' ? Navigator.SceneConfigs.PushFromRight : Navigator.SceneConfigs.FadeAndroid;
    }

    render () {
        return (
    		<Navigator
    			ref 			= {(c) => this._nav = c} 
	            debugOverlay 	= {false} 
	            style 			= {{flex: 1}} 
	            initialRoute 	= {this.props.initialRoute} 
	            configureScene 	= {this._getSubSceneConfig} 
	            renderScene 	= {this._renderSubScene} />
        );
    }
}

const styles = StyleSheet.create({
	scene: {
		flex: 1,
		backgroundColor: Global._colors.IOS_BG,
	},
});






