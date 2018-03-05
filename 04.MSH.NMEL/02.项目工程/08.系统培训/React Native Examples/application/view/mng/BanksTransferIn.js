'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Global = require('../../Global');
var Icon = require('react-native-vector-icons/Ionicons');
var BankList = require('../assets/BankList');
var BanksTransfer2 = require('./BanksTransfer2');

var AccountMixin = require('../AccountMixin');
var UtilsMixin = require('../lib/UtilsMixin');
var TimerMixin = require('react-timer-mixin');
var FilterMixin = require('../../filter/FilterMixin');

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

var FIND_URL = 'account/getAcctInfoByAcctNo';

var BanksTransferIn = React.createClass({

	mixins: [UtilsMixin, AccountMixin, FilterMixin],

	getInitialState: function(){
		console.log("BanksTransferIn****");
		console.log(this.props.acctNo);
		console.log(this.props.balance);

		return{
				amount:null,
				loaded:false,
				bankName:null,
				acctName:null,
				inAcctNo:this.props.acctNo,
				in_balance:this.props.balance,
				outAcctName:null,
				outAcctNo:this.props.outAcctNo,
				out_balance:this.props.out_balance,
    		}
	},

	componentDidMount: function() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		});
		if(this.props.acctNo && this.props.acctNo != '')
			this.fetchData();
	},

	fetchData: async function() {
		console.log("^^^^^^^^^^^^^BanksTransferIn^^^^^^^^^^^^^^");
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

	next: function(){
		this.props.navigator.push({
			title: "转入",
	        component: BanksTransfer2,
	        passProps: {
            	outAcctNo:this.state.outAcctNo,
            	inAcctNo:this.state.inAcctNo,
            	in_balance:this.state.in_balance,
            	out_balance:this.state.out_balance,
            	amount:this.state.amount,
            	refreshTransfer:this.props.refreshTransfer,
            	backRoute:this.props.backRoute,
            },
		});
	},

	getBankList:function(){
		this.props.navigator.push({
			title: '付款方式',
			component: BankList,
			passProps: {
				acctNo: this.props.acctNo,
				kind: '3',
				outAcctName: this.state.outAcctName,
				refresh: this.refresh
			},
		});
	},

	refresh: function(data){
		console.log("BanksTransferIn refresh data:");
		console.log(data);
		this.setState({
			outAcctName: data.bankName,
			outAcctNo: data.acctNo,
			out_balance: data.balance,
		})
	},

	checkAmt:function(){
		if(this.state.out_balance != null && this.state.amount > this.state.out_balance){
			Alert.alert(
                '错误',
                '账户余额不足！',
            );
		}
	},

	render: function() {

		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		return(
			<View style={Global.styles.CONTAINER}>
				<ScrollView style={styles.sv}>
					<View style={styles.paddingPlace} />

					<View style={Global.styles.FULL_SEP_LINE} />
					<View style={[styles.rend_row, Global.styles.CENTER, {paddingTop: 10, paddingBottom: 10}]} >
					 	{Global.bankLogos[this.props.bank_no]}
			            <View style={{flex: 1, paddingLeft: 10}}>
			            	<Text style={{fontSize: 15, marginBottom: 3}}>
			              		{this.state.bankName}
			            	</Text>
			            	<Text style={{fontSize: 12, color: Global.colors.IOS_GRAY_FONT}}>
			              		{'********' + this.filterCardNumLast4(this.state.inAcctNo)}
			            	</Text>
			            	<Text style={{fontSize: 12, color: Global.colors.IOS_GRAY_FONT}}>
			              		{this.state.acctName}
			            	</Text>
			            </View>
			        </View>
            		<View style={Global.styles.FULL_SEP_LINE} />

			        <TouchableOpacity style={[styles.rend_row, Global.styles.CENTER, {height: 50}]} onPress={()=>{this.getBankList()}}>
		            	<Text style={[styles.text]}>
		              		{'付款方式：'}
		              		{this.state.outAcctName == null ? '电子账户' : this.state.outAcctName}
		              		{this.state.outAcctNo == null ? '' : '(' + this.filterCardNumLast4(this.state.outAcctNo) + ')'}
		            	</Text>
			            <Icon name='ios-arrow-right' size={18} color={Global.colors.IOS_DARK_GRAY} style={[Global.styles.ICON, {width: 25}]} />
			        </TouchableOpacity>
            		<View style={Global.styles.FULL_SEP_LINE} />

			        <View style={[Global.styles.CENTER, {flexDirection: 'row', marginTop: 8, marginLeft: 10}]} >
			        	<Icon style={[styles.icon, {width: 15}]} name='information-circled' size={15} color={Global.colors.IOS_BLUE} />
			        	<Text style={{flex: 1, marginLeft: 5, fontSize: 12}}>2小时内到账</Text>
			        </View>

            		<View style={Global.styles.PLACEHOLDER20} />

            		<View style={Global.styles.FULL_SEP_LINE} />
		        	<View style={[styles.rend_row, Global.styles.CENTER, {height: 50}]}>
		        		<Text style={{marginLeft: 10, fontSize: 15, width: 40}} >金额</Text>
						<TextInput style={[Global.styles.FORM.NO_BORDER_TEXT_INPUT, {flex: 1, height: 50}]} placeholder='' value={this.state.amount} onChangeText={(value)=>{this.setState({amount: value})}} onBlur={()=>{this.checkAmt()}} />				            
			        </View>
            		<View style={Global.styles.FULL_SEP_LINE} />

            		<View style={Global.styles.PLACEHOLDER20} />

			    	<TouchableOpacity 
						style={[Global.styles.BLUE_BTN, {margin: 20}]} 
						onPress={()=>{this.next()}} >
			    		<Text style={{color: '#ffffff'}}>下一步</Text>
			    	</TouchableOpacity>

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
	},

	rend_row: {
    	flexDirection: 'row',
    	paddingLeft: 10,
    	paddingRight: 10,
    	borderWidth: 0,
    	backgroundColor: 'white',
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

module.exports = BanksTransferIn;