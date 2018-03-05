'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Global = require('../../Global');
var Icon = require('react-native-vector-icons/Ionicons');
var AccountMixin = require('../AccountMixin');
var AddCreditCard = require('./AddCreditCard');
var ConfirmPay = require('./ConfirmPay');

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
} = React;

var ACCOUNTINFO = {};

var CreditCardPayDetail = React.createClass({

	mixins:[UtilsMixin, FilterMixin],

	getInitialState:function(){
		return{
			amount: '',
		}
	},

	confirmPay: function(){
		//console.log("begin confirmPay");
		// console.log(this.props.rowID);
		this.setState({amount: this.state.amount.replace(/\,/g, '')}, () => {
			var re = /^[1-9]+[0-9]*(.[0-9]+)?$/;
			if(re.test(this.state.amount))
				this.props.navigator.push({
					title: "付款详情",
			        component: ConfirmPay,
			        passProps: {
		            	amount: this.state.amount.replace(/\,/g, ''),
		            	bankName:this.props.bankName,
		            	bank_no:this.props.bank_no,
		            	acctNo:this.props.acctNo,
		            	refreshTransfer:this.props.refreshTransfer,
		            	backRoute: this.props.backRoute,
		            	rowID:this.props.rowID,
		            },
				});
			else
				this.toast('请输入正确的还款金额！');
		});
	},

	render: function() {
		return(
			<View style={Global.styles.CONTAINER}>
				<ScrollView style={styles.sv} >
            		<View style={styles.paddingPlace} />

					<View style={Global.styles.FULL_SEP_LINE} />
					<View style={[styles.rend_row, Global.styles.CENTER, {paddingTop: 10, paddingBottom: 10}]} >
					 	{Global.bankLogos[this.props.bank_no]}
			            <View style={{flex: 1, paddingLeft: 10}}>
			            	<Text style={{fontSize: 15, marginBottom: 3}}>
			              		{this.props.bankName}
			            	</Text>
			            	<Text style={{fontSize: 12, color: Global.colors.IOS_GRAY_FONT}}>
			              		{'********' + this.filterCardNumLast4(this.props.acctNo)}
			            	</Text>
			            	<Text style={{fontSize: 12, color: Global.colors.IOS_GRAY_FONT}}>
			              		{this.props.acctName}
			            	</Text>
			            </View>
			        </View>
            		<View style={Global.styles.FULL_SEP_LINE} />

            		{/*<View style={Global.styles.FULL_SEP_LINE} />
					<View style={[styles.rend_row, {paddingTop: 15}]} >
					 	{Global.bankLogos[this.props.bank_no]}
			            <View style={{flex: 1, paddingLeft: 10, top: -5}}>
			            	<Text style={{fontSize: 15, marginBottom: 3}}>
			              		{this.props.bankName}
			            	</Text>
			            	<Text style={{fontSize: 12, marginBottom: 2, color: Global.colors.IOS_GRAY_FONT}}>
			              		{'********' + this.filterCardNumLast4(this.props.acctNo)}
			            	</Text>
			            	<Text style={{fontSize: 12, marginBottom: 7, color: Global.colors.IOS_GRAY_FONT}}>
			              		{this.props.acctName}
			            	</Text>
			            </View>
			        </View>
            		<View style={Global.styles.FULL_SEP_LINE} />*/}
		        	<TouchableOpacity style={[styles.rend_row, Global.styles.CENTER, {height: 32}]}>
		        		<Text style={{flex: 1, marginLeft: 5}} >查询信用卡账单</Text>
			        	<Icon name='ios-arrow-right' size={18} color={Global.colors.IOS_DARK_GRAY} style={[Global.styles.ICON, {width: 20,marginLeft: 175,}]} />
		        	</TouchableOpacity>
            		<View style={Global.styles.FULL_SEP_LINE} />

			        <View style={[Global.styles.CENTER, {flexDirection: 'row', marginTop: 8, marginLeft: 10}]} >
			        	<Icon style={[styles.icon, {width: 15}]} name='information-circled' size={15} color={Global.colors.IOS_BLUE} />
			        	<Text style={{flex: 1, marginLeft: 5, fontSize: 12}}>00:00-23:30当天到账 23:00-24:00次日到账</Text>
			        </View>

            		<View style={Global.styles.PLACEHOLDER20} />

            		<View style={Global.styles.FULL_SEP_LINE} />
		        	<View style={[styles.rend_row, Global.styles.CENTER, {height: 50}]}>
		        		<Text style={{marginLeft: 10, fontSize: 15, width: 40}} >金额</Text>
						<TextInput style={[Global.styles.FORM.NO_BORDER_TEXT_INPUT, {flex: 1, height: 50}]} 
							placeholder='每笔最高2.5万(免服务费)' 
							value={this.state.amount} onChangeText={(value) => 
								this.setState({amount: value})
							} 
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

            		<View style={Global.styles.PLACEHOLDER20} />

            		{/*<View style={Global.styles.PLACEHOLDER10} />
            		<Text style={{marginLeft: 10, marginBottom: 2}} >还款金额:</Text>

            		<View style={Global.styles.FULL_SEP_LINE} />

		        	<View style={[styles.rend_row, Global.styles.CENTER, {height: 60}]}>
						<TextInput style={[Global.styles.FORM.TEXT_INPUT, {flex: 1}]} placeholder='每笔最高2.5万(免服务费)' value={this.state.amount} onChangeText={(value)=>{this.setState({amount: value})}}/>				            
			        </View>
			        
            		<View style={Global.styles.FULL_SEP_LINE} />

			        <View style={[Global.styles.CENTER, {flexDirection: 'row', marginTop: 5}]} >
			        	<Icon style={[styles.icon, {width: 15}]} name='information-circled' size={15} color={Global.colors.IOS_BLUE} />
			        	<Text style={{flex: 1, marginLeft: 5, fontSize: 12}}>00:00-23:30当天到账 23:00-24:00次日到账</Text>
			        </View>*/}

			    	<TouchableOpacity 
						style={[Global.styles.BLUE_BTN, {margin: 20}]} 
						onPress={()=>{this.confirmPay()}} >
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
    	borderRadius:20,
    },
    text: {
    	flex: 1,
    	marginLeft: 10,
  	},
  	icon: {
		textAlign: 'center',
	},

	button:{
		marginLeft:90,
		width:50,
		height:25,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor:'#ef473a',
		borderColor:'#ffffff',
		borderWidth:1 / PixelRatio.get(),
	}

});

module.exports = CreditCardPayDetail;