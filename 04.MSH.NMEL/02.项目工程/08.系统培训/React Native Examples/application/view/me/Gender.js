'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Global = require('../../Global');
var Icon = require('react-native-vector-icons/Ionicons');
var Loading = require('../lib/Loading');
var t = require('tcomb-form-native');
var TcombSelect = require('../lib/TcombSelect');
var tStyles = require('../lib/TcombStylesThin');
var UtilsMixin = require('../lib/UtilsMixin');
var TimerMixin = require('react-timer-mixin');
var UserAction = require('../actions/UserAction');

var FIND_URL = Global.host + 'samperson/find';
var DEL_URL = Global.host + 'samperson/destory';

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
	InteractionManager,
	Alert,
	AsyncStorage,
} = React;

var SAVE_URL = 'person/updateGender';

var Form = t.form.Form;
t.form.Form.stylesheet = tStyles;

var Person = t.struct({
	gender: t.String,
});

var options = {
	fields: {
		gender: {
			label: '性别',
			factory: TcombSelect,
			type: 'single',
			display: 'one-row',
			disabled: false,
			options: {
				'1': '男',
				'0': '女',
			},
			icon: (<Icon name='ios-circle-outline' size={18} color={Global.colors.IOS_DARK_GRAY} style={[Global.styles.ICON, {marginRight: 10,}]} />),
			activeIcon: (<Icon name='ios-checkmark' size={18} color={Global.colors.ORANGE} style={[Global.styles.ICON, {marginRight: 10,}]} />),
			help: '请选择性别',
			error: '请选择性别',
		}
	}};
var Gender = React.createClass({
	mixins: [UtilsMixin, TimerMixin],

	getInitialState: function() {
		return {
			doRenderScene:false,
			value:{
				gender:Global.USER_LOGIN_INFO.gender
			}
		};
	},
	componentDidMount: function() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		});
	},

	save:function(){
		var value = this.refs.form.getValue();
		if(value)
			this.doSave(value);
	},
	doSave: async function(value){
		console.log("in save Gender");
		this.showLoading();
		try {
			let responseData = await this.request(Global.host + SAVE_URL, {
				body: JSON.stringify({
					gender: value.gender,
					id:Global.USER_LOGIN_INFO.id,
				})
			});
			this.hideLoading();
			var updateInfo =  {
				gender:value.gender
			};
			//console.log(updateInfo);
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
			<View style={[styles.container]}>
				<ScrollView style={styles.sv}>
					<View style={styles.paddingPlace} />

					<Form ref="form"
						type={Person}
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
	
});

module.exports = Gender;