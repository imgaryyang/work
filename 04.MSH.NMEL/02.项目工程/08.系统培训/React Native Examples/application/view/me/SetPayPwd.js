'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Global = require('../../Global');
var Icon = require('react-native-vector-icons/Ionicons');
var Password6 = require('../lib/Password6');
//var RNKeyboard = require('../lib/RandomNumberKeyboard');

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

//var FIND_MAX_ELEC_URL = 'account/findMaxAcct';
//var OPEN_ELEC_URL = 'account/openAcct';
var REGISTER_URL = 'login/register';
var SEQUENCE_URL = 'sequence/next';
var REGISTER_TO_ACC_URL = 'http://182.48.115.38:8081/jeesite/reqprocess/forCustomerRegister';
var SetPayPwd = React.createClass({
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
		}
	},

	componentDidMount: function(){
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		});
		this.props.showRNKeyboard(this.input);
	},

	

	/*next: function() {
		console.log(this.state.value);
		this.props.navigator.push({
			title: "开户成功",
	        component: OpenElectAcct4,
	        hideBackButton: true,
            hideNavBar: true,
	        passProps: {
	        	value: this.state.value,
            	refresh: this.props.refresh,
	        },
		});
	},
*/
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
					this.toSequ();
				}
			});
		}
	},
	//调后台自增方法，生成客户号
	toSequ: async function(){
		try{
			let responseData2 = await this.request(Global.host +SEQUENCE_URL , {
				body: JSON.stringify({
					type: '1',
				})
			});
			this.register(responseData2.body[0].sequence);
		}catch(e){
			this.requestCatch(e);
		}
	},

	//调账户系统注册接口,,本js没用，放到电子账户开户了
	registerTOAcc:async function(){
		try {
			let responseData1 = await this.request( REGISTER_TO_ACC_URL , {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'charset' : 'utf-8',
				},
				body: 'channelID=CH20160411000001&channelCust=1111111122222225&custType=0'				
			});
			
			if (responseData1.respCode == '00'){

				for (var i = 0; i < responseData1.accountList.length; i++) {
                	
            	};
            	this.register();

            }else{
                this.toast(responseData1.respMsg);
            }
		
		} catch(e) {
			this.requestCatch(e);
		}
	},


	//小管家后台注册
	register:async function(sequence){
		console.log("*******************");
		console.log(sequence);
		try {
			let responseData = await this.request(Global.host +REGISTER_URL , {
				body: JSON.stringify({
					mobile: this.state.value.mobile,
					password:this.state.value.password,
					payPwd:this.state.pwd,
					custCode: sequence,
				})
			});
			this.hideLoading();
			console.log(responseData.body);
			this.props.navigator.popToTop();
			this.toast('注册成功！');
			
		} catch(e) {
			this.requestCatch(e);
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

				
				<NavBar 
					title='设置支付密码' 
					rootNavigator={this.props.rootNavigator} 
					route={this.props.route}
					navigator={this.props.navigator} 
					hideBackButton={false} 
					hideBottomLine={true} />

			</View>
		);
	},

	_renderPlaceholderView: function() {
		return (
			<View>
				<NavBar 
					title='设置支付密码' 
					route={this.props.route}
					rootNavigator={this.props.rootNavigator} 
					navigator={this.props.navigator} 
					hideBackButton={false} />
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
        height: Global.NBPadding+10,
    },

   
});

module.exports = SetPayPwd;