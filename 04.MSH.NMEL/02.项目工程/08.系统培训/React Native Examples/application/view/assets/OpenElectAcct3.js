'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Global = require('../../Global');
var Icon = require('react-native-vector-icons/Ionicons');
var OpenElectAcct4 = require('./OpenElectAcct4');
var Password6 = require('../lib/Password6');
//var RNKeyboard = require('../lib/RandomNumberKeyboard');
var AccountAction = require('../actions/AccountAction');
var UtilsMixin = require('../lib/UtilsMixin');
var TimerMixin = require('react-timer-mixin');

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

var FIND_MAX_ELEC_URL = 'account/findMaxAcct';
var OPEN_ELEC_URL = 'account/openAcct';

var OpenElecAcct3 = React.createClass({
	mixins: [UtilsMixin, TimerMixin],

	getInitialState: function(){
		return {
			value: this.props.value,
			//showKeyboard: true,

			pwd: '',
			pwdConfirm: '',
			inputStep: 1,
			pwdConfirmed: false,

			num: -1,
			del: false,
			clear: false,
			acctNo: '',
		}
	},

	componentDidMount: function(){
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		});
		this.props.showRNKeyboard(this.input);
	},

	findMaxAcct: async function(){
		try {
			this.showLoading();
			var response = await this.request(Global.host + FIND_MAX_ELEC_URL);
			/*console.log('OpenElecAcct3.findMaxAcct() - response:');
			console.log(response);*/
			var value = this.state.value;
			value.acctNo = response.body.acctNo + "";
			this.setState({
				acctNo: response.body.acctNo + "",
				value: value,
			})
			this.openElecAcct();
		} catch(e) {
			this.requestCatch(e);
		}
	},

	openElecAcct: async function(){
		try {
			/*console.log('OpenElecAcct3.openElecAcct() - before submit - state.value:');
			console.log(this.state.value);*/
			let responseData = await this.request(Global.host + OPEN_ELEC_URL, {
				body: JSON.stringify({
					encryPwd: this.state.pwd,
					bankCode: Global.bank.code,
					bankName: Global.bank.name,
					mobile: this.state.value.mobile,
					phone: this.state.value.cardMobile,
					acctNo: this.state.acctNo,	//TODO:应在后台逻辑中创建账户号
					name: this.state.value.name,
					cardNo: this.state.value.cardNo,
					type: '1',
				}),			
			});
			if(responseData.status =='success'){
				AccountAction.createAccount(responseData.body.elecAccount);
				AccountAction.createAccount(responseData.body.account);
			}
			this.hideLoading();
			this.next();
		} catch(e) {
			this.requestCatch(e);
		}
	},

	next: function() {
		console.log(this.state.value);
		this.props.navigator.push({
			title: "开户成功",
	        component: OpenElectAcct4,
	        hideBackButton: true,
            hideNavBar: true,
	        passProps: {
	        	value: this.state.value,
            	// refresh: this.props.refresh,
	        },
		});
	},

	input: function(key) {
		this.setState({inputting: key + ''});
	},

	inputEnded: function(pwd) {
		console.log('input password ended....');
		if(this.state.inputStep == 1) {
			this.setState({
				pwd: pwd,
				inputStep: 2,
			    inputting: 'clear',
			});
		} else {
			this.setState({
				pwdConfirm: pwd,
			}, () => {
				if(this.state.pwd != this.state.pwdConfirm) {
					console.log('not confirmed');
					Alert.alert(
						'提示', 
						'您两次输入的密码不一致，请重新设置！',
			            [
			            	{text: '确定', onPress: () => {
			            		this.setState({
			            			pwd: '',
			            			pwdConfirm: '',
			            			inputStep: 1,
			            			inputting: 'clear',
			            		});
			            	}},
			            ]
					);
				} else {
					console.log('setting password success!');
					this.setState({
						pwdConfirmed: true,
						//showKeyboard: false,
					});
					this.props.hideRNKeyboard();
					//TODO: 调用业务逻辑
					this.findMaxAcct();
				}
			});
		}
	},

	render:function(){
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		/*var btnStyle = this.state.pwdConfirmed === true ? Global.styles.BLUE_BTN : Global.styles.GRAY_BTN;
		var btnPress = this.state.pwdConfirmed === true ? this.next : null;*/

		var confirmText = this.state.inputStep == 2 ? 
			(<View style={{height: 20}} ><Text style={{color: Global.colors.IOS_RED, marginTop: 8}} >请再次输入支付密码</Text></View>) : 
			(<View style={{height: 20}} ></View>);
		if(this.state.pwdConfirmed === true)
			confirmText = (<View style={{height: 20}} ><Text style={{color: Global.colors.IOS_RED, marginTop: 8}} >支付密码设置成功</Text></View>);

		return(
			<View style={styles.container}>
				<ScrollView style={styles.sv} >
					<View style={styles.paddingPlace} />

                    <View style={[{flex: 1, marginBottom: 20,}]} >
						<Text style={{fontSize: 15}}>请设置6位交易密码</Text>
					</View>

					<Password6 inputEnded={this.inputEnded} inputting={this.state.inputting} />
					{confirmText}
					
					<View style={{marginTop: 15}} >
						<Text style={{color:'grey'}}>1 . 此密码用于支付、转账、购买、赎回等操作时，验证您的身份；</Text>
						<Text style={{color:'grey'}}>2 . 交易密码为6位数字密码。</Text>
					</View>

			    	{/*<TouchableOpacity 
						style={[Global.styles.CENTER, btnStyle, {marginTop: 20}]} 
						onPress={btnPress}>
			    		<Text style={{color: '#ffffff',}}>下一步</Text>
			    	</TouchableOpacity>*/}

				</ScrollView>

				<View style={[Global.styles.TOOL_BAR.BAR, styles.steps]}>
					<View style={[Global.styles.CENTER, styles.stepFlex]} ><View style={[styles.step]} ><Text style={styles.stepText} >1</Text></View></View>
					<View style={[Global.styles.CENTER, styles.stepFlex]} ><View style={[styles.step]} ><Text style={[styles.stepText]} >2</Text></View></View>
					<View style={[Global.styles.CENTER, styles.stepFlex]} ><View style={[styles.step, styles.activeStep]} ><Text style={[styles.stepText]} >3</Text></View></View>
					<View style={[Global.styles.CENTER, styles.stepFlex]} ><View style={[styles.step]} ><Text style={[styles.stepText]} >4</Text></View></View>
				</View>

				{/*<RNKeyboard input={this.input} show={this.state.showKeyboard} />*/}

				{this._getNavBar()}

			</View>
		);
	},

	_renderPlaceholderView: function() {
		return (
			<View>
				{this._getNavBar()}
			</View>
		);
	},

	_getNavBar: function() {
		return (
			<NavBar 
				title='设置支付密码' 
				rootNavigator={this.props.rootNavigator} 
				navigator={this.props.navigator} 
				hideBackButton={false} 
				backText='上一步'
				hideBottomLine={true} />
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
        height: Global.NBPadding + 64,
    },

    steps: {
    	flex: 1,
    	height: 43,
    	flexDirection: 'row',
    },
    stepFlex: {
    	flex: 1,
    	backgroundColor: 'transparent',
    },
    step: {
    	width: 24,
    	height: 24,
    	borderRadius: 12,
    	backgroundColor: Global.colors.IOS_DARK_GRAY,
    	overflow: 'hidden',
    },
    activeStep: {
    	backgroundColor: Global.colors.IOS_GREEN,
    },
    stepText: {
    	flex: 1,
    	fontSize: 16,
    	color: '#ffffff',
    	textAlign: 'center',
    	lineHeight: 21,
    },

});

module.exports = OpenElecAcct3;