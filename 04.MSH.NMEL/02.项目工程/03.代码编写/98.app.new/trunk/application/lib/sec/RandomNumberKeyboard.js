'use strict';

/**
 * 随机数字键盘使用
*/

import React, {
	Component,
	
} from 'react';
import * as Global from '../../Global';
import IonIcon from 'react-native-vector-icons/Ionicons';

import {
	StyleSheet,
	View,
	Text,
	Animated,
	Easing,
	TouchableOpacity,
} from 'react-native';

import PropTypes from 'prop-types';

var height = 240;

class RandomNumberKeyboard extends Component {

    static propTypes = {

        /**
        * 输入时回调方法
        */
        input: PropTypes.func,

        /**
        * 清除时回调方法
        */
        show: PropTypes.bool,

    };

	constructor( props ) {
		super(props);

		this.state = {
			bottomPos: new Animated.Value(Global.getScreen().height),
			numbers: this.getRandomNumber(),
			show: false,
		};
	}

	componentWillReceiveProps(props) {
    	if(props.show === true && props.show != this.state.show){
    		this.show();
    	}
    	else if(props.show === false && props.show != this.state.show){
    		this.hide();
    	}
	}

    componentDidMount() {
    	if(this.props.show === true)
    		this.show();
    	else
    		this.hide();
    	this.setState({show: this.props.show});
	}

	/**
     * 显示键盘
    */
	show() {
		this.setState({numbers: this.getRandomNumber()});
		Animated.timing(
	       	this.state.bottomPos,
	       	{
	       		toValue: Global.getScreen().height - height,
	       		duration: 200,
	       		easing: Easing.inOut(Easing.ease),
	       		delay: 0,
	       	},
	    ).start();
	    this.setState({show: true});
	}

	/**
     * 隐藏键盘
    */
	hide() {
		Animated.timing(
	       	this.state.bottomPos,
	       	{
	       		toValue: Global.getScreen().height,
	       		duration: 800,
	       		easing: Easing.inOut(Easing.ease),
	       		delay: 0,
	       	},
	    ).start();
	    this.setState({show: false});
	}

	/**
	 * 生成0~9随机数字组成的数组
	*/
	getRandomNumber() {
		var a = new Array(10);  
		a[0]=0;a[1]=1;a[2]=2;a[3]=3;a[4]=4;a[5]=5;a[6]=6;a[7]=7;a[8]=8;a[9]=9;
		var randomNum;
		var times = 10;
		for(var i = 0 ; i < 10 ; i++){
			randomNum = parseInt(Math.random()*10);
			var tmp = a[0];
			a[0] = a[randomNum];
			a[randomNum] = tmp;
		}
		return a;
	}

	/**
	 * 回退
	*/
	del() {
		this.input('del');
	}

	/**
	 * 清除
	*/
	clear() {
		this.input('clear');
	}

	/**
	 * 输入
	*/
	input(num) {
		/*console.log('press a number.');
		console.log(num);*/
		// this.toast(num);
		if(this.props.input)
			this.props.input(num);
	}

	render() {
			// <Animated.View style={[styles.container, {top: this.state.bottomPos}]} >
			// </Animated.View>
// this.toast( Global.getScreen().width );
// <IonIcon name='close-circled' size={20} color={'#000000'} />
						// <IonIcon name='backspace' size={20} color={'#000000'} />
		return (
			<Animated.View style={[styles.container, {top: this.state.bottomPos}]}>
				<View style={[styles.row, styles.firstRow]} >
					<TouchableOpacity style={[styles.col, styles.firstCol, Global._styles.CENTER]} onPress={() => this.input(this.state.numbers[0])} ><Text style={[styles.number]} >{this.state.numbers[0]}</Text></TouchableOpacity>
					<TouchableOpacity style={[styles.col, Global._styles.CENTER]} onPress={() => this.input(this.state.numbers[1])} ><Text style={[styles.number]} >{this.state.numbers[1]}</Text></TouchableOpacity>
					<TouchableOpacity style={[styles.col, Global._styles.CENTER]} onPress={() => this.input(this.state.numbers[2])} ><Text style={[styles.number]} >{this.state.numbers[2]}</Text></TouchableOpacity>
				</View>
				<View style={[styles.row]} >
					<TouchableOpacity style={[styles.col, styles.firstCol, Global._styles.CENTER]} onPress={() => this.input(this.state.numbers[3])} ><Text style={[styles.number]} >{this.state.numbers[3]}</Text></TouchableOpacity>
					<TouchableOpacity style={[styles.col, Global._styles.CENTER]} onPress={() => this.input(this.state.numbers[4])} ><Text style={[styles.number]} >{this.state.numbers[4]}</Text></TouchableOpacity>
					<TouchableOpacity style={[styles.col, Global._styles.CENTER]} onPress={() => this.input(this.state.numbers[5])} ><Text style={[styles.number]} >{this.state.numbers[5]}</Text></TouchableOpacity>
				</View>
				<View style={[styles.row]} >
					<TouchableOpacity style={[styles.col, styles.firstCol, Global._styles.CENTER]} onPress={() => this.input(this.state.numbers[6])} ><Text style={[styles.number]} >{this.state.numbers[6]}</Text></TouchableOpacity>
					<TouchableOpacity style={[styles.col, Global._styles.CENTER]} onPress={() => this.input(this.state.numbers[7])} ><Text style={[styles.number]} >{this.state.numbers[7]}</Text></TouchableOpacity>
					<TouchableOpacity style={[styles.col, Global._styles.CENTER]} onPress={() => this.input(this.state.numbers[8])} ><Text style={[styles.number]} >{this.state.numbers[8]}</Text></TouchableOpacity>
				</View>
				<View style={[styles.row]} >
					<TouchableOpacity style={[styles.col, styles.firstCol, Global._styles.CENTER, {flexDirection: 'row'}]} onPress={() => this.clear(this)} >
						<Text style={[styles.clear, {marginLeft: 5,}]} >C</Text>
					</TouchableOpacity>
					<TouchableOpacity style={[styles.col, Global._styles.CENTER]} onPress={() => this.input(this.state.numbers[9])} ><Text style={[styles.number]} >{this.state.numbers[9]}</Text></TouchableOpacity>
					<TouchableOpacity style={[styles.col, Global._styles.CENTER]} onPress={() => this.del()} >
						<Text style={[styles.clear, {marginLeft: 5,}]} >del</Text>
					</TouchableOpacity>
				</View>
			</Animated.View>
		);
	}

};

var styles = StyleSheet.create({
	container: {
		position: 'absolute',
		left: 0,
		width: Global.getScreen().width,
		height: height,
		backgroundColor: '#ffffff',
		flexDirection: 'column',
	},
	row: {
		flex: 1,
		flexDirection: 'row',
		borderTopWidth: 1 / Global._pixelRatio,
		borderTopColor: Global._colors.IOS_SEP_LINE,
	},
	firstRow: {
	},
	col: {
		flex: 1,
		borderLeftWidth: 1 / Global._pixelRatio,
		borderLeftColor: Global._colors.IOS_SEP_LINE,
	},
	firstCol: {
		borderLeftWidth: 0,
	},
	number: {
		color: '#000000',
		fontSize: 20,
	},
	clear: {
		color: '#000000',
		fontSize: 15,
	},
});

module.exports = RandomNumberKeyboard;
