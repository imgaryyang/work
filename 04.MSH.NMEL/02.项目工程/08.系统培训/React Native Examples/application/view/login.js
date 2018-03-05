'use strict';

var React = require('react-native');
var NavBar = require('./NavBar');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../Global');
var t = require('tcomb-form-native');
var Register = require("./me/Register");
var MngIdx = require('./mng/MngIdx');
var UtilsMixin = require('./lib/UtilsMixin');
var TimerMixin = require('react-timer-mixin');
var UserAction = require('./actions/UserAction');
var {
	StyleSheet,
	ScrollView,
	View,
	Text,
	Image,
	TouchableOpacity,
	InteractionManager,
	AsyncStorage,
	Alert,
} = React;


var LOGIN_URL = 'login';

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

var Form = t.form.Form;

var LoginInfo = t.struct({
	mobile:t.String,
	encryptedPassword: t.String,
});

var options = {
	fields: {
		mobile: {
			label:'手机号',
			error: '手机号必须填写且长度不能超过11个字符',
			//help: '请填写您的手机号',
			maxLength: 11,
			autoFocus: true,
			keyboardType: 'numeric', 	//'default', 'email-address', 'numeric', 'phone-pad', 'ascii-capable', 'numbers-and-punctuation', 
										//'url', 'number-pad', 'name-phone-pad', 'decimal-pad', 'twitter', 'web-search'
		},
		encryptedPassword: {
			label: '密码',
			error: '密码必须填写且长度大于等于6小于等于20',
			//help: '请填写您的密码',
			password: true,
			maxLength: 20,
		}
	}
};

var Login = React.createClass({
	mixins: [UtilsMixin, TimerMixin],

    componentDidMount: function() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
	    	//give focus to the name textbox
	    	//this.mobileOnFocus();
		});
	},

	getInitialState: function() {
		return {
			value:null,
			doRenderScene: false,
		};
	},
	
  	mobileOnFocus:function(){
  		console.log("this.mobileOnFocus confirm");
  		this.refs.form.getComponent('mobile').refs.input.focus();

  	},
  	register: function() {
  		console.log("register**********");
  		console.log(this.props.route);
		var nav = this.props.navigator ? this.props.navigator : this.props.rootNavigator;
		nav.push({
			title: "注册",
			component:Register,
			showLoading:this.props.showLoading,
			hideLoading:this.props.hideLoading,
			//preComponent:Login,

		});
	},
	login:async function(){
		var value = this.refs.form.getValue();
		var body = JSON.stringify(value);
		try {
			this.showLoading();
			let responseData = await this.request(Global.host + LOGIN_URL, {
				body: body,
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
				var Component = this.props.route.component;
				// Global.USER_LOGIN_INFO = responseData.body;
				UserAction.login(responseData.body);
				// AsyncStorage.setItem(Global.ASK_USER, JSON.stringify(responseData.body));
				this.props.continuePush();
			}
		} catch(e) {
			console.log("login catch");
			console.log(e);
			this.requestCatch(e);
		}
		
	},
	
	render:function(){
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		//console.log(this.props.route);
		return(
			<View style={[styles.container]}>
				<ScrollView style={styles.sv}>
					<View style={styles.paddingPlace} />

					<Form
						ref="form"
						type={LoginInfo}
						options={options}
						value={this.state.value}/>

			    	<TouchableOpacity style={[Global.styles.BLUE_BTN, {marginTop: 10}]} onPress={this.login} >
			    		<Text style={{color: '#ffffff',}}>登录</Text>
			    	</TouchableOpacity>

			    	<Text style={[{flex: 1, textAlign: 'center', margin: 10, color: Global.colors.IOS_GRAY_FONT, fontSize: 12}]} >还未注册？点击“注册”按钮免费注册。</Text>

					<TouchableOpacity style={[Global.styles.ORANGE_BTN]} onPress={this.register} >
			    		<Text>注册</Text>
			    	</TouchableOpacity>

					<View style={{flex: 1, height: 40,}} />
			    </ScrollView>

			    <NavBar 
			    	title='登录' 
			    	navigator={this.props.navigator}
			    	route={this.props.route} />

			</View>
		);
	},

	_renderPlaceholderView: function() {
		return (
			<View style={{flex: 1}} >
			    <NavBar 
			    	title='登录' 
			    	navigator={this.props.navigator}
			    	route={this.props.route} />
			</View>
		);
	},
});

module.exports = Login;


