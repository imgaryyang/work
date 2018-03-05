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

var SAVE_URL = 'person/updateIdCard';

var PersonIdCard = React.createClass({

	mixins: [UtilsMixin, TimerMixin],

	getInitialState: function() {
		return {
			doRenderScene:false,
			idCard:Global.USER_LOGIN_INFO.idCard,
			value:null,
		};
	},

	componentDidMount: function() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		});
	},	

	save: async function(){
		var re =/(^\d{15}$)|(^\d{17}([0-9]|X|x)$)/;
		if(!re.test(this.state.idCard)){
			Alert.alert('警告','请输入正确的身份证！');
			return;
		}
		this.showLoading();
		try {
			let responseData = await this.request(Global.host + SAVE_URL, {
				body: JSON.stringify({
					idCard: this.state.idCard,
					id: Global.USER_LOGIN_INFO.id,
				})
			});
			this.hideLoading();
			var updateInfo =  {
				idCard:this.state.idCard
			};
			// await this.updateUserInfo(updateInfo);
			UserAction.updateUser(updateInfo);
			this.props.navigator.pop();				
		} catch(e) {
			this.requestCatch(e);
		}
	},
	
	render:function(){
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		return (
			<View style={[Global.styles.CONTAINER]}>
				<ScrollView style={styles.sv}>
					<View style={styles.paddingPlace} />
					<TextInput style={[Global.styles.FORM.TEXT_INPUT, styles.textInput]} placeholder="身份证号" value={this.state.idCard} onChangeText={(value) => this.setState({idCard: value})}/>
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
	sv: {
		paddingLeft: 20,
		paddingRight: 20,
		backgroundColor: 'white',
	},
	paddingPlace: {
		flex: 1,
		height: Global.NBPadding + 20,
	},
	
	textInput:{
		flex: 1,
	}
});

module.exports = PersonIdCard;

