'use strict';

/**
 * 6位支付密码
 * 配合随机数字键盘使用
*/

import React, {
	Component,
	PropTypes,
} from 'react';

import * as Global from '../../Global';

import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	Dimensions,
} from 'react-native';

class Password6 extends Component {

	/**
	 * 属性列表
	*/
    static propTypes = {

    	inputEnded: PropTypes.func,

    	inputting: PropTypes.string,

    };

    /**
	 * 默认属性
    */
    static defaultProps = {
    }

	constructor( props ) {

		super(props);
		this.state = {
	    	pwdLen: 0,
			pwd: '',
			displayPwd: ['', '', '', '', '', ''],
		}
	}

	componentWillReceiveProps(props) {
		/*console.log('in Password6.componentWillReceiveProps...');
		console.log(props);*/
		if(props.inputting === 'del')
			this.del();
		else if(props.inputting === 'clear')
			this.clear();
		else
			this.input(props.inputting);
		
	}

	input(num) {
		if(this.state.pwdLen == 6)
			return;
		else {
			var dPwd = this.state.displayPwd;
			dPwd[this.state.pwdLen] = '*';
			this.setState({
				pwdLen: this.state.pwdLen + 1,
				pwd: this.state.pwd + num + '',
				displayPwd: dPwd,
			}, () => {
				//console.log(this.state);
				if(this.state.pwdLen == 6 && this.props.inputEnded) {
					this.props.inputEnded(this.state.pwd);
				}
			});
		}
	}

	del() {
		if(this.state.pwdLen == 0)
			return;
		else {
			var dPwd = this.state.displayPwd;
			dPwd[this.state.pwdLen - 1] = '';
			this.setState({
				pwdLen: this.state.pwdLen - 1,
				pwd: this.state.pwd.substr(0, this.state.pwdLen - 1),
				displayPwd: dPwd,
			}/*, () => {console.log(this.state)}*/);
		}
	}

	clear() {
		this.setState({
			pwdLen: 0,
			pwd: '',
			displayPwd: ['', '', '', '', '', ''],
		}/*, () => {console.log(this.state)}*/);
	}

    componentDidMount() {
	}

	render() {
		return (
			<TouchableOpacity style={styles.container} >
				<View style={[styles.pwdHolder, styles.center, styles.firstPwdHolder]} ><Text style={[styles.pwd]} >{this.state.displayPwd[0]}</Text></View>
				<View style={[styles.pwdHolder, styles.center]} ><Text style={[styles.pwd]} >{this.state.displayPwd[1]}</Text></View>
				<View style={[styles.pwdHolder, styles.center]} ><Text style={[styles.pwd]} >{this.state.displayPwd[2]}</Text></View>
				<View style={[styles.pwdHolder, styles.center]} ><Text style={[styles.pwd]} >{this.state.displayPwd[3]}</Text></View>
				<View style={[styles.pwdHolder, styles.center]} ><Text style={[styles.pwd]} >{this.state.displayPwd[4]}</Text></View>
				<View style={[styles.pwdHolder, styles.center]} ><Text style={[styles.pwd]} >{this.state.displayPwd[5]}</Text></View>
			</TouchableOpacity>
		);
	}

}

var styles = StyleSheet.create({
	container: {
		//flex: 1,
		backgroundColor: '#ffffff',
		borderWidth: 1 / Global._pixelRatio,
		borderColor: '#dcdce1',
		height: (Dimensions.get('window').width / 6) - 10,
		flexDirection: 'row',
	},
	pwdHolder: {
		flex: 1,
		borderLeftWidth: 1 / Global._pixelRatio,
		borderLeftColor: '#dcdce1',
		height: (Dimensions.get('window').width / 6) - 10,
		backgroundColor: 'rgba(0, 0, 0, 0)',
	},
	firstPwdHolder: {
		borderLeftWidth: 0,
	},
	pwd: {
		color: 'rgba(142,142,147,1)',
		fontSize: 30,
		lineHeight: 44,
		backgroundColor: 'rgba(0, 0, 0, 0)',
	},
	center: {
		alignItems: 'center',
		justifyContent: 'center',
	}
});

module.exports = Password6;
