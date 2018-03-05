/**
 * 主导航容器
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
import NavBar 		from './NavBar';

export default class MainNavigator extends Navigator {

	/**
     * 构造函数
     */
    constructor (props) {
        super(props);
        this.push = this.push.bind(this);
        this.props.renderScene.bind(this);
        //super.push = this.push.bind(this);
    }

    /**
     * 重载push，实现权限拦截
     */
    push (route) {
    	console.log('xxxxxxxxxxxxxxxx');
    	super.push(route);
    }

}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
	},
	scene: {
		flex: 1,
		backgroundColor: Global._colors.IOS_BG,
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




