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
} = React;

var Password6 = React.createClass({

	/**
	 * 属性列表
	*/
    propTypes: {

    	inputEnded: PropTypes.func,

    	inputting: PropTypes.string,

    },

    /**
	 * 默认属性
    */
    getDefaultProps: function() {
		return {
			
		};
	},

	getInitialState: function() {
		return {
	    	pwdLen: 0,
			pwd: '',
			displayPwd: ['', '', '', '', '', ''],
		}
	},

	componentWillReceiveProps: function(props) {
		/*console.log('in Password6.componentWillReceiveProps...');
		console.log(props);*/

		if(props.inputting === 'del')
			this.del();
		else if(props.inputting === 'clear')
			this.clear();
		else
			this.input(props.inputting);
		
	},

	input: function(num) {
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
	},

	del: function() {
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
	},

	clear: function() {
		this.setState({
			pwdLen: 0,
			pwd: '',
			displayPwd: ['', '', '', '', '', ''],
		}/*, () => {console.log(this.state)}*/);
	},

    componentDidMount: function() {
	},

	render: function() {

		return (
			<TouchableOpacity style={styles.container} >
				<View style={[styles.pwdHolder, Global.styles.CENTER, styles.firstPwdHolder]} ><Text style={[styles.pwd]} >{this.state.displayPwd[0]}</Text></View>
				<View style={[styles.pwdHolder, Global.styles.CENTER]} ><Text style={[styles.pwd]} >{this.state.displayPwd[1]}</Text></View>
				<View style={[styles.pwdHolder, Global.styles.CENTER]} ><Text style={[styles.pwd]} >{this.state.displayPwd[2]}</Text></View>
				<View style={[styles.pwdHolder, Global.styles.CENTER]} ><Text style={[styles.pwd]} >{this.state.displayPwd[3]}</Text></View>
				<View style={[styles.pwdHolder, Global.styles.CENTER]} ><Text style={[styles.pwd]} >{this.state.displayPwd[4]}</Text></View>
				<View style={[styles.pwdHolder, Global.styles.CENTER]} ><Text style={[styles.pwd]} >{this.state.displayPwd[5]}</Text></View>
			</TouchableOpacity>
		);
	},

});

var styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ffffff',
		borderWidth: 1 / Global.pixelRatio,
		borderColor: Global.colors.IOS_SEP_LINE,
		height: (Global.getScreen().width / 6) - 10,
		flexDirection: 'row',
	},
	pwdHolder: {
		flex: 1,
		borderLeftWidth: 1 / Global.pixelRatio,
		borderLeftColor: Global.colors.IOS_SEP_LINE,
		height: (Global.getScreen().width / 6) - 10,
		backgroundColor: 'rgba(0, 0, 0, 0)',
	},
	firstPwdHolder: {
		borderLeftWidth: 0,
	},
	pwd: {
		color: Global.colors.IOS_GRAY_FONT,
		fontSize: 30,
		lineHeight: 44,
		backgroundColor: 'rgba(0, 0, 0, 0)',
	},
});

module.exports = Password6;
