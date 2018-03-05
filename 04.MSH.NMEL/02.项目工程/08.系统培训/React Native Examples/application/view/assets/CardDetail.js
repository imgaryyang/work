'use strict';

var React = require('react-native');
var Global = require('../../Global');
var Icon = require('react-native-vector-icons/Ionicons');
var FAIcon = require('react-native-vector-icons/FontAwesome');
var BindBanksCard = require('./BindBanksCard');
var TransferIn = require('../mng/BanksTransferIn');
var TransferOut = require('../mng/BanksTransferOut');
var CreditCardPayDetail = require('../creditCard/CreditCardPayDetail');

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
	Alert,
} = React;

var DELETE_CARD = 'account/updateAcct';
var FIND_CARD_URL = 'account/getAcctInfoByAcctNo';

var CardDetail = React.createClass({

	mixins:[UtilsMixin, TimerMixin, FilterMixin],

	getInitialState: function() {
		
		return {
			doRenderScene: false,
			pay_info: null,
			balance: 0,
		};
	},

	componentDidMount:  function() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({
				doRenderScene: true,
			});
			if(this.props.acctInfo.type =='1' && this.props.acctInfo.bankName == Global.bank.name){
				this.fetchData();
			}
		});
	},
	fetchData:async function(){
		this.showLoading();
		try {
			let responseData = await this.request(Global.host + FIND_CARD_URL, {
				body: JSON.stringify({
					acctNo: this.props.acctInfo.acctNo,
				})
			});
			this.hideLoading();
			this.setState({
				balance : responseData.body[0].balance
			});
		} catch(e) {
			this.requestCatch(e);
		}

	},
	transfer : function(){
		this.props.acctInfo.acctNo,this.props.acctInfo.bank_no,this.props.acctInfo.balance,this.props.acctInfo.bankName
		this.props.navigator.push({
			title:'转账',
			component:TransferOut,
			passProps: {
            	acctNo: this.props.acctInfo.acctNo,
            	balance:this.state.balance,
            	bank_no:this.props.acctInfo.bank_no,
            	backRoute:this.props.route,
            	bankName :this.props.acctInfo.bankName,
            	refreshTransfer : this.props.refresh
            },
		});
	},

	confirmDelete: function() {
    	Alert.alert(
            '提示',
            '您确定要解除绑定吗？',
            [
            	{text: '取消', style: 'cancel'},
            	{text: '确定', onPress: () => this.deleteCardAS()},
            ]
        );
    },
	deleteCardAS: async function() {
		this.showLoading();
		try {

			let responseData = await this.request(Global.host + DELETE_CARD, {
				body: JSON.stringify({
					acctNo: this.props.acctInfo.acctNo,
				})
			});
			this.hideLoading();
			this.props.refresh.call();
			this.props.navigator.pop();
		} catch(e) {
			this.requestCatch(e);
		}
	},
	refreshCredit:function(data){
		console.log("CreditCard refreshTransfer is call ------------");
		this.setState({
			pay_info: "正在还款，金额 " + this.filterMoney(data.amount) + " 元",
			rowID: data.rowID,
		})
	},
	pay:function(){
		//console.log(item);
		console.log("CreditCard*******");
		this.props.navigator.push({
			title: '还款',
			component: CreditCardPayDetail,
			passProps:{
				bankName: this.props.acctInfo.bankName,
            	bank_no: this.props.acctInfo.bank_no,
            	acctNo: this.props.acctInfo.acctNo,
            	acctName: this.props.acctInfo.acctName,
            	refreshTransfer: this.refreshCredit,
            	backRoute: this.props.route,
            	// rowID: rowID,
			}
		});
	},
	render: function() {
		var funcList = null;
		if(this.props.acctInfo.type =='1'){
			if(this.props.acctInfo.bankName == Global.bank.name  ){
				var funcList=(<View style={[styles.funcList]}>
					<View style={Global.styles.FULL_SEP_LINE} />
                		<View style={{flex:1,flexDirection:'row'}}>
	                		<TouchableOpacity style={[styles.btn,Global.styles.CENTER]} onPress={()=>this.transfer()}>
	                			<FAIcon style={[styles.icon,]} name={'random'} size={20} color={Global.colors.ORANGE} />
	                			<Text style={{fontSize:15}}>转账</Text>
	                		</TouchableOpacity>
	                		<TouchableOpacity style={[styles.btn,{borderLeftWidth:1/Global.pixelRatio,borderColor:Global.colors.IOS_SEP_LINE},Global.styles.CENTER]}>
	                			<FAIcon style={[styles.icon,]} name={'list-alt'} size={20} color={Global.colors.ORANGE} />
	                			<Text style={{fontSize:15}}>明细</Text>
	                		</TouchableOpacity>
                		</View>
                	<View style={Global.styles.FULL_SEP_LINE} />
                	</View>);
			}
		}else if(this.props.acctInfo.type =='2'){
			if(this.props.acctInfo.bankName == Global.bank.name  ){
				var funcList=(<View style={[styles.funcList]}>
						<View style={Global.styles.FULL_SEP_LINE} />
                		<View style={{flex:1,flexDirection:'row'}}>
	                		<TouchableOpacity style={[styles.btn,Global.styles.CENTER]}>
	                			<FAIcon style={[styles.icon,]} name={'list-alt'} size={20} color={Global.colors.ORANGE} />
	                			<Text style={{fontSize:15}}>查账单</Text>
	                		</TouchableOpacity>
	                		<TouchableOpacity style={[styles.btn,{borderLeftWidth:1/Global.pixelRatio,borderColor:Global.colors.IOS_SEP_LINE},Global.styles.CENTER]} onPress={()=>{this.pay()}}>
	                			<FAIcon style={[styles.icon,]} name={'money'} size={20} color={Global.colors.ORANGE} />
	                			<Text style={{fontSize:15}}>还款</Text>
	                		</TouchableOpacity>
                		</View>
                		<View style={Global.styles.FULL_SEP_LINE} />
                	</View>);
			}else{
				var funcList=(<View style={[styles.funcList]}>
                		<View style={Global.styles.FULL_SEP_LINE} />
                		<View style={{flex:1,flexDirection:'row'}}>
	                		
	                		<TouchableOpacity style={[styles.btn,Global.styles.CENTER]}  onPress={()=>{this.pay()}}>
	                			<FAIcon style={[styles.icon,]} name={'money'} size={20} color={Global.colors.ORANGE} />
	                			<Text style={{fontSize:15}}>还款</Text>
	                		</TouchableOpacity>
	                		{/*<TouchableOpacity style={[styles.btn,{borderLeftWidth:1/Global.pixelRatio,borderColor:Global.colors.IOS_SEP_LINE},Global.styles.CENTER]} >
	                			                			
	                			                		</TouchableOpacity>*/}
                		</View>
                		<View style={Global.styles.FULL_SEP_LINE} />
                	</View>);

			}
		}

		var pay_info = this.state.pay_info != null ?
			 (
				<View>
					<View style={{height:20}} />
					<View style={[{flex:1,padding:10,paddingLeft:20,backgroundColor:'#ffffff',flexDirection:'row'},Global.styles.BORDER]}>
							<Icon style={[styles.icon,{paddingLeft:10}]} name='information-circled' size={18} color={Global.colors.IOS_BLUE}/>
                			<Text style={{fontSize:14}}>{this.state.pay_info}</Text>
                		</View>
				</View>
			):null;
		
		return (
			<View style={Global.styles.CONTAINER}>
                <View style={styles.paddingPlace} />
                <ScrollView style={[styles.sv]} >
                	<View style={[{backgroundColor:Global.colors.ORANGE,flex:1,flexDirection:'row',height: 100}]}>
                		<View style={[{width:35,height:35,borderRadius:17.5,backgroundColor:'#ffffff',margin:20,marginTop:30}, Global.styles.CENTER,]}>
                			{Global.bankLogos[this.props.acctInfo.bank_no]}
                		</View>
                		<View style={{flex:1,marginTop:30}}>
                			<Text style={[styles.text,{fontSize:12}]}>{this.props.acctInfo.bankName}</Text>
                			<Text style={[styles.text,{fontSize:14}]}>**** **** **** {this.filterCardNumLast4(this.props.acctInfo.acctNo)}</Text>
                			<Text style={[styles.text,{fontSize:12}]}>{this.props.acctInfo.acctName}</Text>
                		</View>
                	</View>
                	<View style={{height:20}} />
                	{funcList}
                	{pay_info}
                	<View style={{height:40}} />
                	<View style={Global.styles.FULL_SEP_LINE} />
                	<TouchableOpacity style={[{flex:1,height:40,backgroundColor:'#ffffff'},Global.styles.CENTER]} onPress={()=>{this.confirmDelete()}}>
	                	<Text style={{fontSize:15,color:'red'}}>解除绑定</Text>
	                </TouchableOpacity>
	                <View style={Global.styles.FULL_SEP_LINE} />
	                <View style={{height:40}} />
                </ScrollView>
            </View>
			);
	},

	_renderPlaceholderView: function() {
		return (
			<View style={Global.styles.CONTAINER} />
		);
	},	

});
var styles = StyleSheet.create({
	sv: {
		flex: 1,
	},
    paddingPlace: {
        height: Global.NBPadding,
    },
    text:{
    	color:'#ffffff'
    },
    funcList:{
    	backgroundColor:'#ffffff',
    	flex:1,
    },
    icon: {
		textAlign: 'center',
		paddingRight:10
	},
	btn:{
		flex: 1,
		padding: 10,
		flexDirection: 'row',
		height:40
	}
	
});

module.exports = CardDetail;
