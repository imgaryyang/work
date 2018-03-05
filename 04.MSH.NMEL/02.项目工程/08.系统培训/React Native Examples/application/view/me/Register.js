'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Global = require('../../Global');
var Icon = require('react-native-vector-icons/Ionicons');
var Login = require('../login');
var UtilsMixin = require('../lib/UtilsMixin');
var TimerMixin = require('react-timer-mixin');
var t = require('tcomb-form-native');
var tStyles = require('../lib/TcombStylesThin');
var SetPayPwd = require('./SetPayPwd');

var Form = t.form.Form;
t.form.Form.stylesheet = tStyles;

var {
	StyleSheet,
	ScrollView,
	View,
	Text,
	Image,
	TouchableOpacity,
	TextInput,
	InteractionManager,
	AsyncStorage,
	Alert,
} = React;


var GETUSER_URL = 'login/findUser';
var Register = React.createClass({
	mixins: [UtilsMixin, TimerMixin],

	_getRegisterInfo: function() {
		var mobile = t.refinement(t.String, function(s) {
			return /^1[34578]\d{9}$/.test(s);
		});
		var password = t.refinement(t.String, function(s) {
			return s.length>=6 && s.length<=30;
		});
		var confirmPwd = t.refinement(t.String, function(s) {
			return s.length>=6 && s.length<=30;
		});
		var smsCode = t.refinement(t.String, function(s) {
			return s.length==6 ;
		});
		return  t.struct({
			mobile: mobile,
			password: password,
			confirmPwd: confirmPwd,
			smsCode: smsCode,
		})
	},

	_getFormOptions: function() {

		return {
			fields: {
				mobile: {
					label: '手机号',
					error: '手机号必须填写且长度为11位',
					autoFocus: true,
					keyboardType: 'numeric',
				},
				password: {
					label: '登录密码',
					maxLength: 30,
					password: true,
					error: '密码必须填写且长度大于6小于30',
				},
				confirmPwd: {
					label: '确认密码',
					maxLength: 30,
					password: true,
					error: '密码必须填写且长度大于6小于30',
					help: '请再次输入密码进行验证',
				},
				smsCode: {
					label: '手机验证码',
					maxLength: 6,
					error: '验证码必须填写且长度为6位',
					help: '请填写验证短信中的6位数字验证码',
				},
			}
		}
	},

	getInitialState: function() {
		return {
			mobile:null,
			smsCode:null,
			password:null,
			confirmPwd:null,
			doRenderScene: false,
			options: this._getFormOptions(),
			value: {},
		};
	},

    componentDidMount: function() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
	    	//give focus to the name textbox
	    	//this.mobileOnFocus();
		});
	},
	mobileOnFocus:function(){
  		this.refs.form.getComponent('mobile').refs.input.focus();

  	},
	register: async function() {
		console.log("Global.USER_LOGIN_INFO***");
		console.log(Global.USER_LOGIN_INFO);
		var value = this.refs.form.getValue();

		if(value) {
			
			if (value.password != value.confirmPwd) {
				Alert.alert(
	                '提示',
	                "登录密码和确认密码不一致",
	            );
			} else {
				this.showLoading();
				try {
					// console.log(this);
					let responseData = await this.request(Global.host + GETUSER_URL, {
						body: JSON.stringify({
							mobile: value.mobile,
							encryptedPassword: value.password,
							smsCode: value.smsCode,
						})
					});
					console.log(responseData);
					this.hideLoading();
					if(responseData.status == 'error'){
						Alert.alert(
							'提示',
							 responseData.msg+',请重新输入!',
							 [
							 	{
							 		text:'确定', onPress:()=>{
							 			this.setState({
							 				value:'',
							 			});
							 			this.mobileOnFocus();
							 		}
							 	}
							 ]

							);
					}else{
						//this.props.navigator.popToTop();	
						this.next();		
					}
				} catch(e) {
					this.requestCatch(e);
				}
			}
		}
	},
	next:function(){
		console.log("register value:")
		console.log(this.state.value);
		this.props.navigator.push({
			title: "设置支付密码",
	        component: SetPayPwd,
            hideNavBar: true,
            passProps:{
            	value:this.state.value
            }
	        
		});
	},
	onFormChange: function(value, objName) {
		this.setState({value: value});
	},

	render:function(){
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		return(
			<View style={[styles.container]}>
				<ScrollView style={styles.sv}>
					<View style={styles.paddingPlace} />

					<Form
						ref="form" 
						type={this._getRegisterInfo()} 
						value={this.state.value} 
						options={this.state.options} 
						onChange={this.onFormChange} />

			    	<TouchableOpacity style={[Global.styles.BLUE_BTN, {marginTop: 10}]} onPress={this.register}>
			    		<Text style={{color: '#ffffff'}}>下一步</Text>
			    	</TouchableOpacity>

					<View style={{flex: 1, height: 40,}} />

			    </ScrollView>

			    <NavBar 
			    	title='注册' 
			    	route={this.props.route} 
			    	navigator={this.props.navigator} />

			</View>
		);
	},

	_renderPlaceholderView: function() {
		return (
			<View>
				<NavBar 
					rootNavigator={this.props.rootNavigator} 
					navigator={this.props.navigator} 
					route={this.props.route} />
		    </View>
		);
	},
});

var styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ffffff',
	},
	sv: {
		paddingLeft: 20,
		paddingRight: 20,
	},
	paddingPlace: {
		flex: 1,
		height: Global.NBPadding + 20,
	},

	textInput:{
		height:40,
		fontSize:13,
		borderColor: 'gray', 
		borderWidth: 1,
		borderRadius:3,
		marginTop:5
	},
		
});

module.exports = Register;



