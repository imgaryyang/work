'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Global = require('../../Global');
var Icon = require('react-native-vector-icons/Ionicons');
var UtilsMixin = require('../lib/UtilsMixin');
var TimerMixin = require('react-timer-mixin');
var UserAction = require('../actions/UserAction');

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

var SAVE_URL = 'person/updateMail';

var Mail = React.createClass({

	mixins: [UtilsMixin, TimerMixin],

	getInitialState: function() {
		return {
			doRenderScene:false,
			mail:Global.USER_LOGIN_INFO.mail,
			value:null,
		};
	},
	componentDidMount: function() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		});
	},
	
	save: async function(){
		var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
		if(!re.test(this.state.mail)){
			Alert.alert('错误','请填写正确的邮箱！');
			return;
		}
		console.log("in save mail");
		this.showLoading();
		try {
			let responseData = await this.request(Global.host + SAVE_URL, {
				body: JSON.stringify({
					mail: this.state.mail,
					id:Global.USER_LOGIN_INFO.id,
				})
			});
			this.hideLoading();
			var updateInfo =  {
				mail:this.state.mail
			};
			// await this.updateUserInfo(updateInfo);
			UserAction.updateUser(updateInfo);
			this.props.navigator.pop();				
		} catch(e) {
			this.requestCatch(e);
		}
		/*this.state.personInfo.mail = this.state.mail;
		this.state.personInfo.encryptedPassword = Global.USER_LOGIN_INFO.password;
		this.setState({showLoading: true});
		fetch(SAVE_URL, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(this.state.personInfo),
		})
		.then((response) => response.json())
		.then((responseData) => {
			this.data = responseData;
			//console.log("save responseData");
			//console.log(responseData);
			this.setState({showLoading: false});
			
			if(Global.processResponse(responseData)) {
				Global.USER_LOGIN_INFO = responseData.body[0];
				AsyncStorage.removeItem(Global.ASK_USER);
				AsyncStorage.setItem(Global.ASK_USER, JSON.stringify(responseData.body[0]));
				this.props.navigator.pop();			
			}			
		})
		.catch((error) => {
	            this.setState({
	                fetchError: true,
	                showLoading: false,
	            });
	            Alert.alert(
	                '错误',
	                '网络连接错误！',
	            );
	            console.warn(error);
	        })
		.done();
*/	},
	render:function(){
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		return (
			<View style={[styles.container]}>
				<ScrollView style={styles.sv}>
					<View style={styles.paddingPlace} />
					<TextInput style={[Global.styles.FORM.TEXT_INPUT, styles.textInput]} placeholder="邮箱" value={this.state.mail} onChangeText={(value) => this.setState({mail: value})}/>
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
					hideBackButton = {false} />			   
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
		flex: 1,
	}
});

module.exports = Mail;