'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Global = require('../../Global');
var Icon = require('react-native-vector-icons/Ionicons');
var OpenElectAcct4 = require('./OpenElectAcct4');
var TcombBool = require('../lib/TcombBool');
var AccountAction = require('../actions/AccountAction');
var t = require('tcomb-form-native');
var tStyles = require('../lib/TcombStylesThin');
var UtilsMixin = require('../lib/UtilsMixin');
var TimerMixin = require('react-timer-mixin');
var AccountMixin = require('../AccountMixin');
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
	TextInput,
	Alert
} = React;

var Form = t.form.Form;
t.form.Form.stylesheet = tStyles;

var FIND_MAX_ELEC_URL = 'account/findMaxAcct';
var OPEN_ELEC_URL = 'account/openAcct';
var REGISTER_TO_ACC_URL = 'reqprocess/forCustomerRegister';

var OpenElecAcct2 = React.createClass({
	mixins: [UtilsMixin, TimerMixin,AccountMixin],

	_getCardInfo: function() {
		var cardNo = t.refinement(t.Number, function(n) {
			return  /^\d{16,19}$/.test(n);
		});
		return t.struct({
			name: t.String,
			cardNo: cardNo,
			cardMobile: t.Number,
			agreement2: t.Boolean,
		});
	},

	_getAgreementLabelComponent: function() {
		return (
			<View style={styles.agreementContainer} >
				<Text style={{width: 30,}} >同意</Text>
				<TouchableOpacity style={{flex: 1,}} onPress={this.checkAgreement} >
					<Text style={styles.href} >《扣款协议》</Text>
				</TouchableOpacity>
			</View>
		);
	},

	_getFormOptions: function() {
		
		return {
			fields: {
				name: {
					label: '姓名',
					editable: false,
				},
				cardNo: {
					label: '借记卡卡号',
					maxLength: 20,
					error: '请填写借记卡卡号',
				},
				cardMobile: {
					label: '填写银行预留手机号',
					maxLength: 11,
					minLength: 11,
					error: '银行预留手机号必须填写且长度为11位',
				},
				agreement2: {
					labelComponent: this._getAgreementLabelComponent(),
					factory: TcombBool,
					labelPos: 'tail',
				},
			},
		};
	},

	getInitialState: function() {
		var value = this.props.value;
		value.cardMobile = value.mobile;
		return {
			value: value,
			options: this._getFormOptions(),
		}
	},

    componentDidMount: function() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		});
	},

	checkAgreement: function() {
		console.log('in checkAgreement...');
	},

	save: function() {
		if(!this.state.cardInfo || this.state.cardInfo.cardType =='2'){
			Alert.alert('提示','不支持此银行卡，请使用正确的储蓄卡!');
			return;
		}

		console.log(this.state.cardInfo);
		var value = this.refs.form.getValue();
		if(value) {
			//this.findMaxAcct();
			//this.next();
			this.registerTOAcc();
		}
	},
	//调账户系统注册接口
	registerTOAcc:async function(){
		try {
			console.log('pppppppppppppp');
			console.log('channelID='+Global.channelID+'&channelCust='+Global.USER_LOGIN_INFO.custCode+'&custType=0');
			let responseData1 = await this.request( Global.acctHost+REGISTER_TO_ACC_URL , {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'charset' : 'utf-8',
				},
				body: 'channelID='+Global.channelID+'&channelCust='+Global.USER_LOGIN_INFO.custCode+'&custType=0'				
			});
			console.log(responseData1);
			if (responseData1.respCode == '00'){

				for (var i = 0; i < responseData1.accountList.length; i++) {
                	var value = this.state.value;
					value.acctNo = responseData1.accountList[i].acctNo;
					this.setState({
						acctNo: responseData1.accountList[i].acctNo,
						//accType: responseData1.accountList[i].acctType,
						value: value,
					})

            		this.openElecAcct();
            	};
            }else{
                this.toast(responseData1.respMsg);
            }
		
		} catch(e) {
			this.requestCatch(e);
		}
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
					//encryPwd: this.state.pwd,
					bankCode: this.state.cardInfo.bankCode,
					bankName: this.state.cardInfo.bankName,
					mobile: this.state.value.mobile,
					phone: this.state.value.cardMobile,
					acctNo: this.state.acctNo,	
					//accType: this.state.accType, //TODO电子账户传回来的账户类型暂时无用
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
		// console.log(this.state.value);
		
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
	/*next: function(){
		this.props.navigator.push({
			title: "设置支付密码",
	        component: OpenElectAcct3,
            hideNavBar: true,
	        passProps: {
            	value: this.state.value,
            	refresh: this.props.refresh,
            },
		});
	},*/

	onFormChange: function(value, objName) {
		if(objName=='cardNo'&&value.cardNo.length==6){
			let cardInfo=this.checkBankCardInfo(value.cardNo);
			if(cardInfo!=null){
				this.setState({cardInfo:cardInfo});
			}else{
				if(value.cardNo.length>=6)
					Alert.alert('提示','不支持此银行卡！');
			}
		}
		this.setState({value: value});
	},

	render:function(){
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		var btnStyle = this.state.value.agreement2 === true ? Global.styles.BLUE_BTN : Global.styles.GRAY_BTN;
		var btnPress = this.state.value.agreement2 === true ? this.save : null;

		return(
			<View style={styles.container}>
				<ScrollView style={styles.sv} >
                    <View style={styles.paddingPlace} />

                    <View style={[{flex: 1, marginBottom: 20,}]} >
						<Text style={{fontSize: 15}}>请绑定本人二代身份证开立的银行储蓄卡</Text>
					</View>

                    <Form
						ref="form"
						type={this._getCardInfo()}
						value={this.state.value} 
						options={this.state.options}
						onChange={this.onFormChange} />

			    	<TouchableOpacity 
						style={[Global.styles.CENTER, btnStyle, {marginTop: 10}]} 
						onPress={btnPress}>
			    		<Text style={{color: '#ffffff',}}>下一步</Text>
			    	</TouchableOpacity>

				</ScrollView>

				<View style={[Global.styles.TOOL_BAR.BAR, styles.steps]}>
					<View style={[Global.styles.CENTER, styles.stepFlex]} ><View style={[styles.step]} ><Text style={styles.stepText} >1</Text></View></View>
					<View style={[Global.styles.CENTER, styles.stepFlex]} ><View style={[styles.step, styles.activeStep]} ><Text style={[styles.stepText]} >2</Text></View></View>
					<View style={[Global.styles.CENTER, styles.stepFlex]} ><View style={[styles.step]} ><Text style={[styles.stepText]} >3</Text></View></View>
					{/*<View style={[Global.styles.CENTER, styles.stepFlex]} ><View style={[styles.step]} ><Text style={[styles.stepText]} >4</Text></View></View>*/}
				</View>
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
				title='绑卡验证' 
				rootNavigator={this.props.rootNavigator} 
				navigator={this.props.navigator} 
				route={this.props.route}
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

    agreementContainer: {
    	flexDirection: 'row',
    },
	href: {
		color: Global.colors.IOS_BLUE,
	},

		row: {
			flexDirection: 'row',
			height: Dimensions.get('window').width/8,
			backgroundColor: '#FFFFFF',
		},
		col:{
			flex:1,
			//padding:5,
			width:Dimensions.get('window').width/4,
			height: Dimensions.get('window').width/8,
			justifyContent: 'center',
			alignItems: 'center',
		},
		col_text:{
			flex:1,
			backgroundColor:'#929292',
			margin:10,
			width:20,
			height:20,
			textAlign: 'center',
			color:'#FFFFFF',
		},
		activeIcon:{
			backgroundColor:'#4cd964',
		},
		inputBlock:{
			flex:1,
			//padding:5,
			width:Dimensions.get('window').width,
			//backgroundColor: '#FFFFFF',
			//height:100,
		},
		textInput:{
			height:40,
			fontSize:13,
			borderColor: 'gray', 
			borderWidth: 1,
			borderRadius:3,
			marginTop:5,
			backgroundColor: '#FFFFFF',
		},
	});

module.exports = OpenElecAcct2;
