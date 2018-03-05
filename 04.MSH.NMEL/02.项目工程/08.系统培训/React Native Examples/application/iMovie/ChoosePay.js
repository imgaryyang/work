'use strict';

var InputPayPwd = require('../view/lib/InputPayPwd');
var React = require('react-native');
var NavBar = require('../view/NavBar');
var Global = require('../Global');
var Icon = require('react-native-vector-icons/Ionicons');
var BankList = require('../view/assets/BankList');
var UtilsMixin = require('../view/lib/UtilsMixin');
var FilterMixin = require('../filter/FilterMixin');

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

var Movie_Pay_URL = 'iMovie/yppt/handoutQrcode';

var ChoosePay = React.createClass({
	mixins: [UtilsMixin, FilterMixin],

	getInitialState:function() {
		
		return {
			accountInfo: {
				bankName: null,
				acctNo: null,
				bank_no: null,
				balance: 0
			},
			doRenderScene: false,
			price: this.props.price,
			filmName: this.props.filmName,
			id: this.props.id,
		}
	},
	componentDidMount: function() {
		console.log(this.props.loans);
		InteractionManager.runAfterInteractions(() => {
			this.setState({
				doRenderScene: true,
			});
		});
	},
    _genRows: function(pressData: {[key: number]: boolean}): Array<string> {
        var dataBlob = [];
        for (var ii = 0; ii < 5; ii++) {
            var pressedText = pressData[ii] ? ' (pressed)' : '';
            dataBlob.push('Row ' + ii + pressedText);
        }
        return dataBlob;
    },
	bankList:function(){
		console.log('*****************acctNo******************************');
		console.log(this.props.acctNo);
		var nav = this.props.navigator ? this.props.navigator : this.props.rootNavigator;
		nav.push({
			title:'付款方式',
			component:BankList,
			passProps:{
				acctNo:this.props.acctNo,
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
		let total = parseFloat(this.props.price);
		
		if (parseFloat(this.state.accountInfo.balance) < parseFloat(total)) {
			Alert.alert(
				'Warning',
				'账户余额不足!',
			);
			return;
		}
		
		this.props.navigator.push({
			component: InputPayPwd,
			hideNavBar: true,
			passProps: {
                    backRoute: this.props.backRoute,
                    pwdChecked: this.done,
			},
		});
	},
	done: async function() {
		this.showLoading();
		try {
			console.log('hhhhhhhhhhhhhhhhhhhhhhhh');
			console.log(Global.movieHost+Movie_Pay_URL+'.do?payment_sn=8&order_code=8a81808553a11b390153a1808666000a&merchant_code=1&pay_status=0&pay_channel=PO_UPMP&amount='+this.state.price);

			let responseData = await this.request(Global.movieHost+Movie_Pay_URL+'.do?payment_sn=8&order_code=8a81808553a11b390153a1808666000a&merchant_code=1&pay_status=0&pay_channel=PO_UPMP&amount='+this.state.price);
			console.log('wwwwwwwwwwwww');
			console.log(responseData);
			this.toDetail();
			
		} catch (e) {
			this.requestCatch(e);
		}
		this.hideLoading();
	},

	toDetail:function() {
        this.props.navigator.push({
            title: "订单详情",
            component: MoviePay,
            passProps: {
                id: this.props.id,
                refresh: this.refresh,
            },
        });
    },

	render: function() {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();
		return(
				<View style={styles.container}>
					<ScrollView style={styles.sv}>
						<View style={styles.paddingPlace} />
						<View style={Global.styles.FULL_SEP_LINE} />
						 <TouchableOpacity style={[styles.rend_row,]} onPress={()=>{this.bankList()}}>
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
				        <View style={Global.styles.FULL_SEP_LINE} />
				        <View style={[styles.rend_row,{paddingTop:10,paddingBottom:10}]}>
	                       	<Text style={{fontSize:15}}>{this.state.filmName}</Text>
	                       	<Text style={{fontSize:15}}>{this.state.price}元</Text>
				        </View>
				        <View style={Global.styles.FULL_SEP_LINE} />
				        <View style={{height:20}}/>
				        <View style={[{flex: 1, flexDirection: 'row', marginTop: 10}]}>
					    	<TouchableOpacity 
								style={[Global.styles.CENTER, {height: 40, flex: 1, backgroundColor: Global.colors.IOS_BLUE, borderRadius: 3,}]} 
								onPress={()=>{this.next()}}>
					    		<Text style={{color: '#ffffff',}}>下一步</Text>
					    	</TouchableOpacity>
						</View>
					</ScrollView>
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
		height: Global.NBPadding+20,
	},
	sv: {
		paddingLeft: 20,
		paddingRight: 20,
	},
	rend_row: {
    	flexDirection: 'row',
    	height:50,
    	paddingLeft:10,
    	backgroundColor:'#FFFFFF',
    	borderLeftWidth: 1 / PixelRatio.get(),
    	borderRightWidth: 1 / PixelRatio.get(),
    	borderColor:Global.colors.TAB_BAR_LINE,
		alignItems: 'center',
    },
   
    separator: {
    	height: 1,
    	backgroundColor: '#CCCCCC',
    },
    thumb: {
    	width: 30,
    	height: 20,
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

module.exports = ChoosePay;