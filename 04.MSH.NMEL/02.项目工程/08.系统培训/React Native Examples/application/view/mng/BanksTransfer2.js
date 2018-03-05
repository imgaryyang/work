'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Global = require('../../Global');
var TransferMng = require('./TransferMng');
var Password6 = require('../lib/Password6');

var UtilsMixin = require('../lib/UtilsMixin');
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

var TRANSFER_URL = 'account/transfer';
var FIND_PAYPWD_URL = 'person/findOne';

var BanksTransferIn2 = React.createClass({

	mixins: [UtilsMixin, AccountMixin],

	getInitialState: function(){
		return {
			pwd: '',
			doRenderScene:false,
			elecPwd: null,
			num: -1,
			del: false,
			clear: false,
			correctMsg: null,
		}
	},

	componentDidMount: async function(){
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		});
		try {
			let responseData = await this.request(Global.host +FIND_PAYPWD_URL, {
				body: JSON.stringify({
					id: Global.USER_LOGIN_INFO.id
				}),
			});
			this.setState({
				elecPwd : responseData.body.payPwd,
			});
		} catch (e) {
			this.requestCatch(e);
		}
		this.props.showRNKeyboard(this.input);
	},

	input: function(key) {
		this.setState({inputting: key + ''});
	},

	inputEnded: function(pwd) {
		console.log('input password ended....');
		console.log(this.state.elecPwd);
		if(pwd != this.state.elecPwd){
			Alert.alert(
				'提示',
				'支付密码输入错误,请重新输入',
				[
				 	{
				 		text:'确定', onPress:()=>{
				 			this.setState({
				 				pwd: '',
				 				inputting: 'clear',
				 			})
				 		}
				 	}
				]
			);
		} else {
			this.props.hideRNKeyboard();
			this.setState({correctMsg: '密码校验正确！'});
		}
	},

	done: async function(){
		console.log("^^^^^^^^^^^^^BanksTransferIn2^^^^^^^^^^^^^^");
		this.showLoading();
		try {
			let responseData = await this.request(Global.host + TRANSFER_URL, {
				body: JSON.stringify({
					amount: this.props.amount,
					inAcctNo:this.props.inAcctNo,
					outAcctNo:this.props.outAcctNo,
					out_balance:this.props.out_balance,
					in_balance:this.props.in_balance,
				}),
			});
			this.hideLoading();
			this.data = responseData.body;
			console.log(responseData.body);
			this.setState({
					bankName: responseData.body[0].bankName,
					acctName:responseData.body[0].acctName,
				});
			var data = {
				amount:this.props.amount,
				rowID:this.props.rowID,
			}
			
			if(this.props.backRoute == 'Assets'){
				if(!this.props.rowID)
					this.props.refreshTransfer.call();
				this.props.navigator.popToTop();
			}
			else{
				this.props.refreshTransfer.call(this,data);
				this.props.navigator.popToRoute(this.props.backRoute);
			}


		} catch(e) {
			this.requestCatch(e);
		}
	},

	render: function(){
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		return(
			<View style={Global.styles.CONTAINER} >
				{this._getNavBar()}
				<ScrollView style={styles.sv}>

					<Text>请输入6位交易密码</Text>
					<View style={Global.styles.PLACEHOLDER20} />
					<Password6 inputEnded={this.inputEnded} inputting={this.state.inputting} />
					<Text style={{height: 20, color: Global.colors.IOS_BLUE, fontSize: 13, marginTop: 5}} >{this.state.correctMsg}</Text>
					<View style={{flex: 1, flexDirection: 'row', marginTop: 20}}>
				    	<TouchableOpacity 
							style={[Global.styles.CENTER, {height: 40, flex: 1, backgroundColor: Global.colors.IOS_BLUE, borderRadius: 3,}]} 
							onPress={()=>{this.done()}}>
				    		<Text style={{color: '#ffffff',}}>完成</Text>
				    	</TouchableOpacity>
					</View>

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
				hideBackButton={false} 
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

module.exports = BanksTransferIn2;
