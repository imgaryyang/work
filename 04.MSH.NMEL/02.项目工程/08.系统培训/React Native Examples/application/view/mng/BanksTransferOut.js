'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Global = require('../../Global');
var Icon = require('react-native-vector-icons/Ionicons');
var BanksTransfer2 = require('./BanksTransfer2');
var AllBankList = require('../assets/BankList');
var BankList = require('../creditCard/CreditBankList');
var InputPayPwd = require('../lib/InputPayPwd');
// var AccountMixin = require('../AccountMixin');
var UtilsMixin = require('../lib/UtilsMixin');
var FilterMixin = require('../../filter/FilterMixin');
var AccountAction = require('../actions/AccountAction');
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
	InteractionManager,
	Alert,
} = React;

var ACCOUNTINFO = {};
var TRANSFER_URL = 'account/transfer';
var FIND_URL = 'account/getAcctInfoByAcctNo';


var BanksTransferOut = React.createClass({

	mixins:[UtilsMixin, FilterMixin],

	getInitialState:function(){
		return{
			amount: null,
			out_AcctNo: this.props.acctNo,
			out_balance: this.props.balance,
			out_bankName:this.props.bankName,
			out_bankNo:this.props.bank_no,
			bankName: null,
			acctName: null,
			in_AcctNo: null,	//转入账户
			in_bankNo: null,
			in_balance: null,
			in_bankName:null,
			in_AcctName:null,
			loaded: false,
    	}
	},
	componentDidMount: function() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		});
		console.log(this.state.out_bankName);
		// if(this.props.acctNo && this.props.acctNo != '')
		// 	this.fetchData();
	},
	fetchData: async function() {
		console.log("^^^^^^^^^^^^^BanksTransferOut^^^^^^^^^^^^^^");
		this.showLoading();
		try {
			let responseData = await this.request(Global.host + FIND_URL, {
				body: JSON.stringify({
					acctNo: this.props.acctNo,
				}),
			});
			this.hideLoading();
			this.data = responseData.body;
			this.setState({
					bankName: responseData.body[0].bankName,
					acctName:responseData.body[0].acctName,
				});
		} catch(e) {
			this.requestCatch(e);
		}
	},

	chooseBank:function(){
		//console.log(nav.getCurrentRoutes());
		this.props.navigator.push({
			title:'选择银行',
			component:BankList,
			passProps:{
				refreshCredit:this.refresh,
			},
		});
	},
	refresh:function(data){
		console.log("BanksTransferOut refresh data:");
		console.log(data);
		this.setState({
			in_bankName:data.bankName,
			in_bankNo:data.bankno
		})
	},
	next:function(){
		this.setState({amount: this.state.amount.replace(/\,/g, '')});
		if(this.state.in_AcctName == null){
			this.toast('请输入收款人姓名！');
			return;
		}
		var pattern = /^\d{16,19}$/;
		if(!pattern.test(this.state.in_AcctNo)){
			this.toast('请输入正确的收款人卡号！');
			return;
		}
		if(this.state.in_bankName == null){
			this.toast('请选择收款银行！');
			return;
		}
		var re = /^[1-9]+[0-9]*(.[0-9]+)?$/;
		if(!re.test(this.state.amount)){
			this.toast('请输入正确的转账金额!');
			return;
		}
		if(this.state.out_balance != null && this.state.amount > this.state.out_balance){
			this.toast('账户余额不足！');
            return;
		}
		this.props.navigator.push({
			component: InputPayPwd,
			hideNavBar: true,
			passProps: {
				pwdChecked: this.done,
				backRoute:this.props.backRoute
			},
		});
	},
	done: async function(){
		console.log("^^^^^^^^^^^^^BanksTransferIn2^^^^^^^^^^^^^^");
		this.showLoading();
		try {
			let responseData = await this.request(Global.host + TRANSFER_URL, {
				body: JSON.stringify({
					amount: this.state.amount,
					outAcctNo:this.state.out_AcctNo,
					out_balance:this.state.out_balance,
				}),
			});
			//responseData.data --> account
			if(responseData.status=='success'){
				AccountAction.updateAccount(responseData.body[0]);
			}
			this.hideLoading();
			// if(this.props.refreshTransfer)
			// 	this.props.refreshTransfer.call();
			if(this.props.backRoute == 'Assets'){
				this.props.navigator.popToTop();
			}else{
				this.props.navigator.popToRoute(this.props.backRoute);
			}
			//TODO:保存收款人卡号到常用账号


		} catch(e) {
			this.requestCatch(e);
		}
	},
	// checkAmt:function(){
	// 	if(this.state.out_balance != null && this.state.amount > this.state.out_balance){
	// 		this.toast('账户余额不足！');
	// 	}
	// },
	
	render: function() {

		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();
		var bankText = this.state.in_bankName ? this.state.in_bankName : '请选择银行';
		return(
			<View style={Global.styles.CONTAINER}>
				<ScrollView style={styles.sv}>
					<View style={styles.paddingPlace} />
					<View style={Global.styles.FULL_SEP_LINE} />
					<View style={[styles.rend_row, Global.styles.CENTER, {paddingTop: 10, paddingBottom: 10}]} >
					 	{Global.bankLogos[this.props.bank_no]}
			            <View style={{flex: 1, paddingLeft: 10}}>
			            	<Text style={{fontSize: 12}}>
			              		{this.state.out_bankName}
			            	</Text>
			            	<Text style={{fontSize: 12, color: Global.colors.IOS_GRAY_FONT}}>
			              		{'**** **** ****' + this.filterCardNumLast4(this.state.out_AcctNo)}
			            	</Text>
			            	<Text style={{fontSize: 12, color: Global.colors.ORANGE}}>
			            		余额：{this.filterMoney(this.state.out_balance)}
			           		</Text>
			            </View>
			        </View>
			        <View style={Global.styles.FULL_SEP_LINE} />
            		

            		<View style={Global.styles.PLACEHOLDER20} />
            		<View style={Global.styles.FULL_SEP_LINE} />
		        	<View style={[styles.rend_row, Global.styles.CENTER, {height: 50}]}>
		        		<Text style={{marginLeft: 10, fontSize: 15, width: 40}} >姓名</Text>
						<TextInput placeholder={'收款人姓名'} style={[Global.styles.FORM.NO_BORDER_TEXT_INPUT, {flex: 1, height: 50}]}  value={this.state.in_AcctName} onChangeText={(value)=>{this.setState({in_AcctName: value})}}  />				            
			        </View>
			        <View style={Global.styles.FULL_SEP_LINE} />
			        <View style={[styles.rend_row, Global.styles.CENTER, {height: 50}]}>
		        		<Text style={{marginLeft: 10, fontSize: 15, width: 40}} >卡号</Text>
						<TextInput style={[Global.styles.FORM.NO_BORDER_TEXT_INPUT, {flex: 1, height: 50}]} placeholder='收款人储蓄卡号' value={this.state.in_AcctNo} onChangeText={(value)=>{this.setState({in_AcctNo: value})}} />				            
			        </View>
			        <View style={Global.styles.FULL_SEP_LINE} />
			        <TouchableOpacity style={[Global.styles.CENTER, styles.rend_row,{height:50}]} onPress={()=>{this.chooseBank()}}>
							<Text style={{marginLeft: 10, fontSize: 15, width: 40}} >银行</Text>
							<Text style={[{flex: 1, marginLeft: 5, fontSize: 13}]}>{bankText}</Text>	
				            <Icon name='ios-arrow-right' size={18} color={Global.colors.IOS_DARK_GRAY} style={[Global.styles.ICON, {width: 40}]} />
				    </TouchableOpacity>

				    <View style={Global.styles.FULL_SEP_LINE} />

			        <View style={[styles.rend_row, Global.styles.CENTER, {height: 50}]}>
		        		<Text style={{marginLeft: 10, fontSize: 15, width: 40}} >金额</Text>
						<TextInput style={[Global.styles.FORM.NO_BORDER_TEXT_INPUT, {flex: 1, height: 50}]} placeholder='转账金额' 
							value={this.state.amount} onChangeText={(value)=>{this.setState({amount: value})}} 
							onBlur={() => 
								this.setState({amount: this.filterMoney(this.state.amount)})
							} 
							onFocus={() => {
								if(this.state.amount) {
									var amt = this.state.amount.replace(/\,/g, '');
									this.setState({amount: amt});
								}
							}} />				            
			        </View>
			        <View style={Global.styles.FULL_SEP_LINE} />
			        <View style={Global.styles.PLACEHOLDER10} />

			        <View style={[Global.styles.CENTER, {flexDirection: 'row', marginTop: 8, marginLeft: 10}]} >
			        	<Icon style={[styles.icon, {width: 15}]} name='information-circled' size={15} color={Global.colors.IOS_BLUE} />
			        	<Text style={{flex: 1, marginLeft: 5, fontSize: 12}}>2小时内到账</Text>
			        </View>

			    	<TouchableOpacity 
						style={[Global.styles.BLUE_BTN, {margin: 20}]} 
						onPress={()=>{this.next()}} >
			    		<Text style={{color: '#ffffff'}}>下一步</Text>
			    	</TouchableOpacity>

            		<View style={Global.styles.PLACEHOLDER20} />

				</ScrollView>
			</View>
		)
	},

	_renderPlaceholderView: function() {
		return (
			<View style={Global.styles.CONTAINER} />
		);
	},
});
var styles = StyleSheet.create({
	paddingPlace: {
		flex: 1,
		height: Global.NBPadding + 20,
	},
	sv: {
		flex: 1,
		// paddingLeft:20,
		// paddingRight:20
	},

	rend_row: {
    	flexDirection: 'row',
		
    	paddingLeft:10,
    	backgroundColor:'#FFFFFF',
    	
    	justifyContent: 'center',
		alignItems: 'center',
    },

    separator: {
    	height: 1,
    	backgroundColor: '#CCCCCC',
    },
    thumb: {
    	width: 40,
    	height: 40,
    },
    text: {
    	flex: 1,
    	marginLeft: 10,
  	},
  	icon: {
		textAlign: 'center',
	},

});

module.exports = BanksTransferOut;


