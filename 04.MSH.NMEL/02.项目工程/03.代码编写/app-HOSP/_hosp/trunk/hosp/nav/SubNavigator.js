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

import NavBar           from 'rn-easy-navbar';

import * as Global      from 'elapp/Global';

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
        this.pop                           = this.pop.bind(this);
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

	pop () {
		if(this._nav.getCurrentRoutes().length == 1) {
			this.props.hideSubNav();
			return;
		}
		this._nav.pop();
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
    			ref = {(c) => this._nav = c} 
	            debugOverlay = {false} 
	            style = {{flex: 1}} 
	            initialRoute = {this.props.initialRoute} 
	            configureScene = {this._getSubSceneConfig} 
	            renderScene = {this._renderSubScene} />
        );
    }
}

const styles = StyleSheet.create({
	scene: {
		flex: 1,
		backgroundColor: Global._colors.IOS_BG,
	},
});






