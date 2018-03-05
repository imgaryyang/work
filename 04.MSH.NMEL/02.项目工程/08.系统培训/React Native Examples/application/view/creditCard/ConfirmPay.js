'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Global = require('../../Global');
var Icon = require('react-native-vector-icons/Ionicons');
var InputPayPwd = require('../lib/InputPayPwd');
var BankList = require('../assets/BankList');
var UtilsMixin = require('../lib/UtilsMixin');
var TimerMixin = require('react-timer-mixin');
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
	InteractionManager,
	ListView,
	TextInput,
	Alert,
} = React;

var ACCOUNTINFO = {};
var TRANSFER_URL = 'account/transfer';
var ConfirmPay = React.createClass({

	mixins:[UtilsMixin,FilterMixin],
	
	getInitialState:function(){
		console.log("inter ConfirmPay");
		console.log(this.props.backRoute);
		return{
				out_AcctNo:null,
				out_balance:null,
				out_bankNo:null,
				out_bankName:null
    		}
	},
	componentDidMount: async function() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({
				doRenderScene: true,
			});
		});
	},
	inputPwd:function(){
		console.log(this.props.rowID);
		if(this.state.out_AcctNo == null){
			Alert.alert(
	                '警告',
	                '请选择支付账户!',
	            );
			return;
		}
		if(this.state.out_balance< this.props.amount){
			Alert.alert(
	                '错误',
	                '余额不足，请更换支付方式!',
	            );
		}else{
			
			this.props.navigator.push({
			component: InputPayPwd,
			hideNavBar: true,
			passProps: {
				pwdChecked: this.done,
				backRoute:this.props.backRoute
			},
		});
		}
	},
	done: async function(){
		console.log("^^^^^^^^^^^^^BanksTransferIn2^^^^^^^^^^^^^^");
		this.showLoading();
		try {
			let responseData = await this.request(Global.host + TRANSFER_URL, {
				body: JSON.stringify({
					amount: this.props.amount,
					outAcctNo:this.state.out_AcctNo,
					out_balance:this.state.out_balance,
				}),
			});
			if(responseData.status=='success'){
				AccountAction.updateAccount(responseData.body[0]);
			}
			this.hideLoading();
			
			var data = {
				amount:this.props.amount,
				rowID:this.props.rowID,
			}
			
			if(this.props.backRoute == 'Assets'){
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
	getBankList: function(){
		this.props.navigator.push({
			title: '付款方式',
			component: BankList,
			passProps:{
				acctNo: this.props.acctNo,
				kind: '3',
				outAcctName: this.state.outAcctName,
				refresh: this.refresh,
			},
		});
	},
	refresh: function(data){
		console.log("ConfirmPay refresh data:");
		console.log(data);
		this.setState({
			out_bankName:data.bankName,
			out_AcctNo:data.acctNo,
			out_balance:data.balance,
			out_bankNo:data.bank_no

		})
	},
	render: function() {
		return(
			<View style={Global.styles.CONTAINER}>
				<ScrollView style={styles.sv}>
                	<View style={styles.paddingPlace} />

            		<View style={Global.styles.FULL_SEP_LINE} />
					<View style={[styles.rend_row,{height:50}, Global.styles.CENTER]}>
		            	<Text style={{width: 90, textAlign: 'left'}} >信用卡还款：</Text>
		            	<Text style={[styles.text]}>
		              		{this.props.bankName}(尾号{this.filterCardNumLast4(this.props.acctNo)})
		            	</Text>
			        </View>
            		<View style={Global.styles.FULL_SEP_LINE} />
			        <View style={[styles.rend_row,{height:50}, Global.styles.CENTER]}>
			        	<Text style={{width: 90, textAlign: 'left'}} >需  付  款：</Text>
		            	<Text style={[styles.text]}>
		              		{' ' + this.filterMoney(this.props.amount)} 元
		            	</Text>
			        </View>
            		<View style={Global.styles.FULL_SEP_LINE} />

            		<View style={Global.styles.PLACEHOLDER20} />

            		<View style={Global.styles.FULL_SEP_LINE} />
			        <TouchableOpacity style={[styles.rend_row,{height:50}]} onPress={()=>{this.getBankList()}}>
 		            	{this.state.out_bankNo != null?Global.bankLogos[this.state.out_bankNo]:null}
				            <View style={{paddingLeft:10}}>
				            	<Text style={[styles.text],{fontSize:15}}>
			              		{this.state.out_bankName == null?'请选择支付账户':this.state.out_bankName}
				            	</Text>
				            	{this.state.out_AcctNo == null?null:
				            		<Text style={[styles.text],{fontSize:12,color:'grey',paddingTop:5}}>
				            			{'尾号('+this.filterCardNumLast4(this.state.out_AcctNo)+')'}
				            		</Text>}
				            </View>
				            <Icon name='ios-arrow-right' size={18} color={Global.colors.IOS_DARK_GRAY} style={[Global.styles.ICON, {width: 20,marginLeft: 135,}]} />
				       </TouchableOpacity>
            		<View style={Global.styles.FULL_SEP_LINE} />

					<View style={Global.styles.PLACEHOLDER20} />

			    	<TouchableOpacity 
						style={[Global.styles.BLUE_BTN, {margin: 20}]} 
						onPress={()=>{this.inputPwd()}} >
			    		<Text style={{color: '#ffffff'}}>确认还款</Text>
			    	</TouchableOpacity>

				</ScrollView>
			</View>
		)
	},
});
var styles = StyleSheet.create({
	paddingPlace: {
		flex: 1,
		height: Global.NBPadding + 20,
	},
	sv: {
	},

	rend_row: {
    	flexDirection: 'row',
		//width: Dimensions.get('window').width,
    	//paddingTop:8,
    	// height:50,
    	paddingLeft:10,
    	backgroundColor:'#FFFFFF',
    	borderWidth: 1 / PixelRatio.get(),
    	borderColor:Global.colors.TAB_BAR_LINE,
    	//justifyContent: 'center',
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
  	},
  	icon: {
		textAlign: 'center',
	},

});

module.exports = ConfirmPay;