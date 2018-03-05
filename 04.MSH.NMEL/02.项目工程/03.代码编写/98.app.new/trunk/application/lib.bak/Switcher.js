'use strict';

/**
 * 布尔型开关
*/

import React, {
    Component,

} from 'react';

import {
	StyleSheet,
	View,
	TouchableOpacity,
	Animated,
	Easing,
} from 'react-native';

var Switcher = React.createClass({

	activeLeftPos: 55 - 28,

	inactiveLeftPos: 0,

	/**
	 * 属性列表
	*/
    propTypes: {

    	/**
		 * 宽度
		*/
    	width: PropTypes.number,

    	/**
		 * 高度
		*/
    	height: PropTypes.number,

    },

    getDefaultProps: function() {
    	return {
	    	width: 55,
	    	height: 28,
	    }
    },

	/**
	 * 默认状态
    */
	getInitialState: function() {
		let width = this.props.width;
		let height = this.props.height;
		this.activeLeftPos = width - height;

		var initValue = this.props.value === true ? true : false;
		var initPos = initValue === true ? this.activeLeftPos : this.inactiveLeftPos;
		return {
	    	value: initValue,
	    	buttonLeftPos: new Animated.Value(initPos),
		}
	},

	componentWillReceiveProps: function(props) {
		if(props['value'] != this.state.value) {
			this.setState({value: props['value']}, () => this.changeButtonPos());
		}
	},

	onSwitch: function() {
		this.setState({
			value: !this.state.value,
		}, () => {
			this.changeButtonPos();
			if(typeof this.props.onSwitch == 'function') 
				this.props.onSwitch(this.state.value);
		});
	},

	changeButtonPos: function() {
		if(this.state.value)
			Animated.timing(
		       	this.state.buttonLeftPos,
		       	{
		       		toValue: this.activeLeftPos,
		       		duration: 100,
		       		easing: Easing.inOut(Easing.ease),
		       		delay: 0,
		       	},
		    ).start();
		else
			Animated.timing(
		       	this.state.buttonLeftPos,
		       	{
		       		toValue: this.inactiveLeftPos,
		       		duration: 100,
		       		easing: Easing.inOut(Easing.ease),
		       		delay: 0,
		       	},
		    ).start();
	},

	render: function() {

		var bgColor = this.state.value ? '#4CD964' : '#C8C7CC';

		var {style, width, height, value, ...others} = this.props;
		style = typeof style == 'object' ? [style] : style;

		return (
			<TouchableOpacity style = {[this.getStyles().containerSize, this.getStyles().container].concat(style)} onPress = {this.onSwitch} >
				<View style = {[this.getStyles().containerSize, this.getStyles().bgContainer, {backgroundColor: bgColor}]} />
				<Animated.View style = {[this.getStyles().buttonSize, this.getStyles().buttonContainer, {alignItems: 'center', justifyContent: 'center', left: this.state.buttonLeftPos}]} >
					{<View style = {[this.getStyles().buttonSize, this.getStyles().buttonShadow]} />}
					<View style = {[this.getStyles().buttonSize, this.getStyles().button]} />
				</Animated.View>
			</TouchableOpacity>
		);
	},

	getStyles: function() {
		return StyleSheet.create({
			container: {
				backgroundColor: 'rgba(0,0,0,0)',
			},
			bgContainer: {
				borderRadius: this.props.height / 2,
				backgroundColor: '#C8C7CC'
			},

			buttonContainer: {
				position: 'absolute',
				top: 0,
				left: 0,
			},
			button: {
				position: 'absolute',
				top: 1,
				left: 1,
				backgroundColor: '#FAFAFA',
				borderRadius: this.props.height / 2,
			},
			buttonShadow: {
				position: 'absolute',
				top: 2,
				left: 2,
				backgroundColor: 'rgba(167, 167, 170, .5)',
				borderRadius: (this.props.height - 2) / 2,
			},

			containerSize: {
				width: this.props.width,
				height: this.props.height,
			},
			buttonSize: {
				width: this.props.height - 2,
				height: this.props.height - 2,
			},
		});
	},

});

module.exports = Switcher;
