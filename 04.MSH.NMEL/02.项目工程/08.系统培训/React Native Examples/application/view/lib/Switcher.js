'use strict';

/**
 * 6位支付密码
 * 配合随机数字键盘使用
*/

var React = require('react-native');
var Global = require('../../Global');

var {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	PropTypes,
	Animated,
	Easing,
} = React;

var width = 55, height = 28;

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

	/**
	 * 默认状态
    */
	getInitialState: function() {
		width = this.props.width ? this.props.width : 55;
		height = this.props.height ? this.props.height : 28;
		this.activeLeftPos = width - height;

		var initValue = this.props.value === true ? true : false;
		var initPos = initValue === true ? this.activeLeftPos : this.inactiveLeftPos;
		return {
	    	value: initValue,
	    	buttonLeftPos: new Animated.Value(initPos),
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

		return (
			<TouchableOpacity style={[this.getStyles().containerSize, this.getStyles().container]} onPress={this.onSwitch} >
				<View style={[this.getStyles().containerSize, this.getStyles().bgContainer, {backgroundColor: bgColor}]} />
				<Animated.View style={[this.getStyles().buttonSize, this.getStyles().buttonContainer, Global.styles.CENTER, {left: this.state.buttonLeftPos}]} >
					{<View style={[this.getStyles().buttonSize, this.getStyles().buttonShadow]} />}
					<View style={[this.getStyles().buttonSize, this.getStyles().button]} />
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
				borderRadius: height / 2,
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
				borderRadius: height / 2,
			},
			buttonShadow: {
				position: 'absolute',
				top: 2,
				left: 2,
				backgroundColor: 'rgba(167, 167, 170, .5)',
				borderRadius: (height - 2) / 2,
			},

			containerSize: {
				width: width,
				height: height,
			},
			buttonSize: {
				width: height - 2,
				height: height - 2,
			},
		});
	},

});

module.exports = Switcher;
