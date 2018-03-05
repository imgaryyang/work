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
	AsyncStorage,
	InteractionManager,
	Alert,
} = React;

var SAVE_URL = 'person/updateName';

var UserName = React.createClass({
	mixins: [UtilsMixin, TimerMixin],
	getInitialState: function() {
		return {
			doRenderScene:false,
			userName:Global.USER_LOGIN_INFO.name,
			//value:null,
		};
	},
	componentDidMount: function() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		});
	},	
	save:async function(){
		console.log("in save userName");
		this.showLoading();
		try {
			let responseData = await this.request(Global.host + SAVE_URL, {
				body: JSON.stringify({
					name: this.state.userName,
					id:Global.USER_LOGIN_INFO.id,
				})
			});
			this.hideLoading();
			var updateInfo =  {
				name:this.state.userName
			};
			console.log(updateInfo);
			UserAction.updateUser(updateInfo);
			// await this.updateUserInfo(updateInfo);
			this.props.navigator.pop();				
		} catch(e) {
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
					<TextInput style={[Global.styles.FORM.TEXT_INPUT, styles.textInput]} placeholder="姓名" value={this.state.userName} onChangeText={(value) => this.setState({userName: value})}/>
				</ScrollView>
				<NavBar 
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

module.exports = UserName;