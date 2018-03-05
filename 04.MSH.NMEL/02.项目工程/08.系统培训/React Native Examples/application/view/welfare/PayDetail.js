'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Global = require('../../Global');
var Icon = require('react-native-vector-icons/Ionicons');
var BankList = require('../assets/BankList');
var UtilsMixin = require('../lib/UtilsMixin');
var InputPayPwd = require('../lib/InputPayPwd');
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
	Alert
} = React;

var WELFARE_PAY_URL =  'welfareinfo/pay';

var PayDetail = React.createClass({

	mixins: [UtilsMixin,FilterMixin],
	
	getInitialState:function(){
		return {
			accountInfo: {
				bankName: null,
				acctNo: null,
				bank_no: null,
				balance: 0
			},
			doRenderScene: false,
		}
	},
	componentDidMount: function() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({
				doRenderScene: true,
			});
		});
	},
    _genRows: function(pressData: {[key: number]: boolean}): Array<string> {
        var dataBlob = [];
        return dataBlob;
    },
	bankList:function(){
		this.props.navigator.push({
			title:'付款方式',
			component:BankList,
			passProps:{
				kind:'3',
				refresh:this.refresh
			},
		});
	},
	refresh:function(data){
		this.setState({
			accountInfo:{
				bankName : data.bankName,
				acctNo : data.acctNo,
				bank_no : data.bank_no,
				balance : data.balance
			}
		})
	},
	next:function(){
		if (this.state.accountInfo.acctNo == null) {
			Alert.alert(
				'Warning',
				'请选择支付账户!',
			);
			return;
		}

		if (parseFloat(this.state.accountInfo.balance) < parseFloat(this.props.totalamt)) {
			Alert.alert(
				'Warning',
				'账户余额不足!',
			);
			return;
		}
		this.props.navigator.push({
        		title: "确认支付",
                // component: confirmPay,
                component:InputPayPwd,
                passProps: {
                	pwdChecked:this.pay,
                },
        });
		
	},

	pay: async function() {
		this.showLoading();
		try {
			let responseData = await this.request(Global.host +WELFARE_PAY_URL, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
                	//付款信息
                    overview:this.props.overview,
                    totalamt:this.props.totalamt,
                    mobile: Global.USER_LOGIN_INFO.mobile,
                    acctNo : this.state.accountInfo.acctNo,
				}),
			});
			this.hideLoading();
			this.props.refresh.call(this,0);
			this.props.navigator.popToRoute(this.props.backRoute); 
			this.toast('发放成功');
		} catch (e) {
			this.requestCatch(e);
		}
	},

	render: function() {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();
		return(
				<View style={styles.container}>
					<ScrollView style={styles.sv}>
					<View style={styles.paddingPlace} />
						 <TouchableOpacity style={[styles.rend_row,{marginTop:10}]} onPress={()=>{this.bankList()}}>
 		            	{this.state.accountInfo.bank_no != null?Global.bankLogos[this.state.accountInfo.bank_no]:<Icon style={{paddingLeft:11,paddingRight:11}} name="social-yen" size={20} color={Global.colors.IOS_RED}/>}
				            <View style={{paddingLeft:10}}>
				            	<Text style={[styles.text],{fontSize:15}}>
			              		{this.state.accountInfo.bankName == null?'请选择支付账户':this.state.accountInfo.bankName}
				            	</Text>
				            	{this.state.accountInfo.acctNo == null?null:
				            		<Text style={[styles.text],{fontSize:12,color:'grey',paddingTop:5}}>
				            			{'尾号('+this.filterCardNumLast4(this.state.accountInfo.acctNo)+')'}
				            		</Text>}
				            </View>
				            <Icon name='ios-arrow-right' size={18} color={Global.colors.IOS_DARK_GRAY} style={[Global.styles.ICON, {width: 20,marginLeft: 135,}]} />
				        </TouchableOpacity>
				        <View style={[styles.rend_row]}>
				        	<Icon style={[styles.icon,{paddingLeft:10}]} name='information-circled' size={15} color={Global.colors.IOS_BLUE}/>
				        	<Text style={{fontSize:10}}>06:00:00-21:30:00期间转出，支持5万额度最快2小时到账.</Text>
				        </View>
				        <View style={styles.rend_row1}>
				            <View style={styles.placeholder} />
				            	<Text style={{fontSize:20,color:Global.colors.FONT,textAlign:'center',}}>发放总金额：{this.filterMoney(this.props.totalamt)}</Text>
				        </View>
				        <View style={[styles.rend_row]}>
				        	<Text style={{color:Global.colors.IOS_RED}}>2小时内到账</Text>
				        </View>
				        <View style={[{flex: 1, flexDirection: 'row', marginTop: 10}]}>
					    	<TouchableOpacity 
								style={[Global.styles.CENTER, {height: 40, flex: 1, backgroundColor: Global.colors.IOS_BLUE, borderRadius: 3,}]} 
								onPress={()=>{this.next()}}>
					    		<Text style={{color: '#ffffff',}}>发放</Text>
					    	</TouchableOpacity>
						</View>
					</ScrollView>
					<NavBar 
					route={this.props.route}
					navigator={this.props.navigator} 
					hideBottomLine={false}/>
				</View>
			)
	},
    _renderPlaceholderView: function() {
		return (
			<View style={styles.container}></View>
		);
	},
});
var styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Global.colors.IOS_GRAY_BG,
	},
	paddingPlace: {
		flex: 1,
		height: Global.NBPadding,
	},
	sv: {
		paddingLeft: 20,
		paddingRight: 20,
	},
	rend_row: {
    	flexDirection: 'row',
		//width: Dimensions.get('window').width,
    	//paddingTop:8,
    	height:50,
    	paddingLeft:10,
    	backgroundColor:'#FFFFFF',
    	borderWidth: 1 / PixelRatio.get(),
    	borderColor:Global.colors.TAB_BAR_LINE,
    	//justifyContent: 'center',
		alignItems: 'center',
    },
    rend_row1: {
    	// flexDirection: 'row',
		//width: Dimensions.get('window').width,
    	//paddingTop:8,
    	height:50,
    	paddingLeft:10,
    	backgroundColor:'#FFFFFF',
    	borderWidth: 1 / PixelRatio.get(),
    	borderColor:Global.colors.TAB_BAR_LINE,
    	justifyContent: 'center',
		alignItems: 'center',
    },

    thumb: {
    	width: 30,
    	height: 20,
    	// borderRadius:15,
    },
    text: {
    	flex: 1,
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
	},
	item: {
        flexDirection: 'row',
        height : 30
    },

});

module.exports = PayDetail;