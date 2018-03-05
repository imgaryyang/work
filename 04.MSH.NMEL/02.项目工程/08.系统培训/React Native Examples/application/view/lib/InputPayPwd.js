'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Global = require('../../Global');
var Password6 = require('./Password6');

var UtilsMixin = require('./UtilsMixin');
var AccountMixin = require('../AccountMixin');

var {
	StyleSheet,
	ScrollView,
	View,
	Text,
    PixelRatio,
	TouchableOpacity,
	Navigator,
	Dimensions,
	InteractionManager,
	TextInput,
	Alert,
} = React;

var CONFIRMPWD_URL = 'person/confirmPwd';

var InputPayPwd = React.createClass({

	mixins: [UtilsMixin, AccountMixin],

	getInitialState: function(){
		return {
			pwd: '',
			doRenderScene: false,
			elecPwd: null,
			num: -1,
			del: false,
			clear: false,
			checked: false,
			correctMsg: null,
		}
	},

	componentDidMount: async function(){
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		});

		
		this.props.showRNKeyboard(this.input);
	},

	input: function(key) {
		this.setState({inputting: key + ''});
	},

	inputEnded: async function(pwd) {
		// console.log('input password ended....');
		// console.log(this.state.elecPwd);

		//TODO:调用后台逻辑校验支付密码
		this.showLoading();
		try {
			let responseData = await this.request(Global.host + CONFIRMPWD_URL, {
				body: JSON.stringify({
					pwd: pwd,
					id: Global.USER_LOGIN_INFO.id
				}),
			});
			this.hideLoading();
			if (responseData.body == false) {
				Alert.alert(
					'提示',
					'支付密码输入错误,请重新输入!', [{
						text: '确定',
						onPress: () => {
							this.setState({
								pwd: '',
								inputting: 'clear',
							})
						}
					}]
				);
			} else {
				this.props.hideRNKeyboard();
				this.setState({
					checked: true,
					correctMsg: '密码校验正确！',
				});
			}
		} catch (e) {
			this.requestCatch(e);
		}
	},

	done: async function(){
		//密码校验成功后回调业务逻辑
		if(typeof this.props.pwdChecked == 'function') {
			// this.props.navigator.pop();
			this.props.pwdChecked();
		}
	},

	render: function(){
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		var btnStyle = this.state.checked == true ? Global.styles.BLUE_BTN : Global.styles.GRAY_BTN;
		var btnPress = this.state.checked == true ? this.done : null;

		return(
			<View style={Global.styles.CONTAINER} >
				{this._getNavBar()}
				<ScrollView style={styles.sv}>

					<Text>请输入6位交易密码</Text>
					<View style={Global.styles.PLACEHOLDER20} />

					<Password6 
						inputEnded={this.inputEnded} 
						inputting={this.state.inputting} />

					<Text style={{height: 20, color: Global.colors.IOS_BLUE, fontSize: 14, marginTop: 8, marginLeft: 5}} >{this.state.correctMsg}</Text>

			    	<TouchableOpacity 
						style={[Global.styles.CENTER, btnStyle, {marginTop: 20}]} 
						onPress={btnPress}>
			    		<Text style={{color: '#ffffff',}}>完成</Text>
			    	</TouchableOpacity>

					<View style={Global.styles.PLACEHOLDER20} />
				</ScrollView>
			</View>
		)
	},
	_renderPlaceholderView: function() {
		return (
			<View style={Global.styles.CONTAINER} >
				{this._getNavBar()}
			</View>
		);
	},

	_getNavBar: function() {
		return (
			<NavBar 
				title='输入支付密码' 
				route={this.props.route}
				navigator={this.props.navigator} 
				backText='返回'				
				flow={false} />
		);
	}
});
var styles = StyleSheet.create({
	paddingPlace: {
		flex: 1,
		height: Global.NBPadding + 20,
	},
	sv: {
		flex: 1,
		padding: 20,
	},
	inputBlock:{
		flexDirection:'row',
		//padding:5,
		//width:Dimensions.get('window').width,
		borderColor: 'gray', 
		borderWidth: 1 / PixelRatio.get(),
		//backgroundColor: '#FFFFFF',
		//height:100,
	},
	textInput:{
		height:40,
		fontSize:13,
		width:(Dimensions.get('window').width-41)/6,
		borderColor: 'gray', 
		borderWidth: 1 / PixelRatio.get(),
		borderBottomWidth: 0,
		borderTopWidth: 0,
		borderLeftWidth:1,
		borderRightWidth:0,
		textAlign:'center',
		backgroundColor: '#FFFFFF',
	},
});

module.exports = InputPayPwd;
