'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Global = require('../../Global');
var Icon = require('react-native-vector-icons/Ionicons');
var t = require('tcomb-form-native');
var UtilsMixin = require('../lib/UtilsMixin');
var TimerMixin = require('react-timer-mixin');

var {
	StyleSheet,
	ScrollView,
	View,
	Text,
	Image,
    PixelRatio,
	TouchableOpacity,
	Navigator,
	Dimensions,
	TextInput,
	Alert,
	AsyncStorage,
	InteractionManager,
} = React;

var SAVE_URL = 'person/updatePassword';
var CONFIRM_PWD_URL = 'person/confirmPassword';
var Form = t.form.Form;
var pwd = t.refinement(t.String, function(s) {
			return s.length>=6 && s.length<=30;
		});
	
var PwdInfo = t.struct({
	
	oldPwd:pwd,
	newPwd: pwd,
	confirmPwd:pwd,
});

var options = {
	fields:{
		oldPwd:{
			label:'原密码',
			error: '原密码必须填写且长度大于等于6小于等于20',
			help: '请填写您的原密码',
			maxLength:30,
			password:true,
		},
		newPwd:{
			label:'新密码',
			error: '新密码必须填写且长度大于等于6小于等于20',
			help: '请填写您的新密码',
			password:true,
			maxLength:30,
		},
		confirmPwd:{
			label:'确认密码',
			error: '新密码必须填写且长度大于等于6小于等于20',
			help: '请填写您的确认密码',
			password:true,
			maxLength:30,
		},
	}
};

var password = React.createClass({
	mixins: [UtilsMixin, TimerMixin],

	getInitialState: function() {
		return {
			oldPwd:null,
			newPwd:null,
			value:null,
			doRenderScene:false,
			pwdCorrect : false
		};
	},
	componentDidMount: function() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
			this.pwdOnFocus();
		});
	},
	pwdOnFocus:function(){
		this.refs.form.getComponent('oldPwd').refs.input.focus();
	},
	comparePwd:function(value, objName){
		//var value = this.refs.form.getValue();
		console.log("on comparePwd*****");
		console.log(value);
		
	},
	save:function(){
		var value = this.refs.form.getValue();
		if(value)
			this.doSave(value);
	},
	onFormChange: function(value, objName) {
		this.setState({value: value});
	},
	doSave: async function(value) {
		console.log("in save password");
		console.log(value.oldPwd);
		//var value = this.refs.form.getValue();
		try {
			let responseData1 = await this.request(Global.host + CONFIRM_PWD_URL, {
				body: JSON.stringify({
					id: Global.USER_LOGIN_INFO.id,
					pwd: value.oldPwd,
				})
			});
			this.setState({
				pwdCorrect: responseData1.body
			});
			this.hideLoading();
		} catch (e) {
			this.requestCatch(e);
		}
		if (this.state.pwdCorrect == false) {
			Alert.alert(
				'错误',
				'原密码输入错误!',
			);
			return;
			//value.oldPwd = '';
		}
		if (value.newPwd != value.confirmPwd) {
			Alert.alert(
				'错误',
				'新密码和确认密码不一致!',
			);
			return;
		}
		//console.log(this.state.personInfo);
		this.showLoading();
		try {
			let responseData = await this.request(Global.host + SAVE_URL, {
				body: JSON.stringify({
					encryptedPassword: value.newPwd,
					id: Global.USER_LOGIN_INFO.id,
				})
			});
			this.hideLoading();
			// var updateInfo = {
			// 	password: value.newPwd
			// };
			// await this.updateUserInfo(updateInfo);
			this.props.navigator.pop();
		} catch (e) {
			this.requestCatch(e);
		}

	},
		
	render:function(){
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		return (
			<View style={[styles.container]}>
				<ScrollView style={styles.sv}>
					<View style={styles.paddingPlace} />

					<Form
						ref="form"
						type={PwdInfo}
						options={options}
						value={this.state.value}/>

				</ScrollView>
				<NavBar 
					rootNavigator={this.props.rootNavigator} 
					navigator={this.props.navigator} 
					route={this.props.route}
					rightButtons={(
						<View style={[Global.styles.NAV_BAR.BUTTON_CONTAINER, Global.styles.NAV_BAR.RIGHT_BUTTONS]}>
							<TouchableOpacity style={[Global.styles.NAV_BAR.BUTTON]} onPress={()=>{this.save()}}>
								<Text style={{color: Global.colors.IOS_BLUE,}}>保存</Text>
							</TouchableOpacity>
						</View>
					)} 
					hideBackButton = {false}/>
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
	
});

module.exports = password;