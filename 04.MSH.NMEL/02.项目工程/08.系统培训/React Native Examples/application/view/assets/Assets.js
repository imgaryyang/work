'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Global = require('../../Global');
var Icon = require('react-native-vector-icons/Ionicons');
// var AccountMixin = require('../AccountMixin');
var OpenElectAcct = require('./OpenElectAcct');
var BindBanksCard = require('./BindBanksCard');
var TransferIn = require('../mng/BanksTransferIn');
var TransferOut = require('../mng/BanksTransferOut');
var ElecTransferIn = require('./ElecTransferIn');
var ElecTransferOut = require('./ElecTransferOut');
var CardDetail = require('./CardDetail');
var CreditCardPayDetail = require('../creditCard/CreditCardPayDetail');
var UtilsMixin = require('../lib/UtilsMixin');
var TimerMixin = require('react-timer-mixin');
var FilterMixin = require('../../filter/FilterMixin');

var AccountStore = require('../stores/AccountStore');
// var UserStore = require('../stores/UserStore');

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
var Assets = React.createClass({
	mixins:[UtilsMixin,TimerMixin,FilterMixin],
	data1: [],
	data2: [],
	item: null,
	rowID: null,

	getInitialState: function() {
		var ds1 = new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2,
		});
		var ds = new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2,
		});
		return {
			doRenderScene: false,
			dataSource: ds.cloneWithRows(this._genRows({})),
			dataSource1: ds1.cloneWithRows(this._genRows({})),
			USER_LOGIN_INFO: this.props.USER_LOGIN_INFO,
			ACCOUNTINFO:{
				balance: '0.00',
				creditCardNum: 0,
				debitCardNum: 0,
			},
			isRefreshing: false,
		};
	},

	componentWillReceiveProps: async function(props) {
		if (props.USER_LOGIN_INFO != this.state.USER_LOGIN_INFO) {
			this.setState({
				USER_LOGIN_INFO: props.USER_LOGIN_INFO
			}, async() => {
				if (props.USER_LOGIN_INFO != null) {
					await this.getAccounts();
				} 
				this.refresh();
			});
		}
	},

	componentDidMount: async function() {
		
		InteractionManager.runAfterInteractions(() => {
			this.setState({
				doRenderScene: true,
			}, async() => {
				// await this.getAccounts();
				// this.refresh();
				this.unsubscribe = AccountStore.listen(this.onChange);
			});
		});
	},
	componentWillUnmount: function() {
	    this.unsubscribe();
	},
	onChange: function(accounts) {
		if (this.state.USER_LOGIN_INFO) {
			this.setState({
				ACCOUNTINFO : accounts
			});
			this.refresh();
		}
	},
	openElec: function() {
        this.props.navigator.push({
        	title: "电子账户开户",
            component: OpenElectAcct,
            hideNavBar: true,
            // passProps: {
            // 	refresh: this.refresh,
            // },
	        sceneConfig: Global.os == 'ios' ? Navigator.SceneConfigs.FloatFromBottom : Navigator.SceneConfigs.FloatFromBottomAndroid,
        });
    },
    getAccounts:async function(){
    	if(this.state.USER_LOGIN_INFO){
    		let ACCOUNTINFO =await AccountStore.getAccounts();
    		this.setState({
    			ACCOUNTINFO : ACCOUNTINFO
    		});
    	}
    },
	refresh:  function() {
		// console.log(this.state.ACCOUNTINFO);
		this.setState({
			isRefreshing: true
		});
		if (this.state.USER_LOGIN_INFO) {
			try {
				// var ACCOUNTINFO = await this.listAccounts();
				//合并储蓄卡
				var accountInfo ={};
				accountInfo.accts = this.state.ACCOUNTINFO.accts.concat(this.state.ACCOUNTINFO.acctsOther);
				accountInfo.debitCardNum = this.state.ACCOUNTINFO.debitCardNum + this.state.ACCOUNTINFO.debitCardNumOther;
				//合并信用卡
				accountInfo.acctsCredit = this.state.ACCOUNTINFO.acctsCredit.concat(this.state.ACCOUNTINFO.acctsOtherCredit);
				accountInfo.creditCardNum = this.state.ACCOUNTINFO.creditCardNum + this.state.ACCOUNTINFO.creditCardNumOther;
				this.data1 = accountInfo.accts;
				this.key1 = JSON.stringify(accountInfo.accts);
				this.data2 = accountInfo.acctsCredit;
				this.key2 = accountInfo.acctsCredit;
				this.setState({
					dataSource: this.state.dataSource.cloneWithRows(accountInfo.accts),
					dataSource1: this.state.dataSource1.cloneWithRows(accountInfo.acctsCredit),
					isRefreshing: false,
				});
			} catch (e) {
				console.warn(e);
				this.setState({
					isRefreshing: false,
				});
			}
		} else {
			this.data1 = [];
			this.data2 =[];
			this.setState({
				ACCOUNTINFO: {
					balance: '0.00',
					creditCardNum: 0,
					debitCardNum: 0,
				},
				dataSource1: this.state.dataSource1.cloneWithRows(this._genRows({})),
				dataSource: this.state.dataSource.cloneWithRows(this._genRows({})),
				isRefreshing: false,
			});
		}
	},
	
	_genRows: function(pressData: {[key: number]: boolean}): Array<string> {
		var dataBlob = [];
		return dataBlob;
	},
	
	/*chooseCardType: function(type) {
		if(type == '1'){
			this.data = this.state.ACCOUNTINFO.cards;
			this.setState({
				dataSource:this.state.dataSource.cloneWithRows(this.state.ACCOUNTINFO.cards),
			});
		}else if(type == '2'){
			this.data = this.state.ACCOUNTINFO.cardsOther;
			this.setState({
				dataSource:this.state.dataSource.cloneWithRows(this.state.ACCOUNTINFO.cardsOther),
			});
		}else if(type == '3'){
			this.data = this.state.ACCOUNTINFO.acctsOther;
			this.setState({
				dataSource:this.state.dataSource.cloneWithRows(this.state.ACCOUNTINFO.acctsOther),
			});
		}else{
			this.data = this.state.ACCOUNTINFO.acctsOtherCredit;
			this.setState({
				dataSource:this.state.dataSource.cloneWithRows(this.state.ACCOUNTINFO.acctsOtherCredit),
			});
		}
	},*/

	bindBanksCard: function() {
        this.props.navigator.push({
        	title: "绑定银行卡",
            component: BindBanksCard,
            hideNavBar: true,
            passProps: {
            	// refreshBankList: this.refreshBankList,
            	backRoute: "Assets",
            },
	        sceneConfig: Global.os == 'ios' ? Navigator.SceneConfigs.FloatFromBottom : Navigator.SceneConfigs.FloatFromBottomAndroid,
        });
	},

	confirmDelete: function(item, rowID) {
    	this.item = item;
    	this.rowID = rowID;
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
					acctNo: this.item.acctNo,
				})
			});
			this.hideLoading();
			//从前端数组中删除该条数据
			this.data.splice(this.rowID, 1);
			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(this.data),
			});
			this.refresh();
		} catch(e) {
			this.requestCatch(e);
		}
	},

	Transfer: function(title, component, acctNo, balance, bankNo,bankName) {
		console.log("in Transfer**********");
		console.log(typeof component);
		//console.log(this.props.navigator.getCurrentRoutes());

		this.props.navigator.push({
			title:title,
			component:component,
			passProps: {
            	acctNo: acctNo,
            	balance:balance,
            	bank_no:bankNo,
            	bankName:bankName,
            	outAcctNo:this.state.ACCOUNTINFO.elecAcct.acctNo,
            	out_balance:this.state.ACCOUNTINFO.elecAcct.balance,
            	// refreshTransfer:this.refreshAssets,
            	backRoute:'Assets',
            },
	        sceneConfig: Global.os == 'ios' ? Navigator.SceneConfigs.FloatFromBottom : Navigator.SceneConfigs.FloatFromBottomAndroid,
		});
	},
	elecTransfer:function(title,component){
		this.props.navigator.push({
			title:title,
			component:component,
			passProps:{
				outAcctName:this.state.ACCOUNTINFO.accts[0].bankName,
				outAcctNo:this.state.ACCOUNTINFO.accts[0].acctNo,
				out_balance:this.state.ACCOUNTINFO.accts[0].balance,
				inAcctNo:this.state.ACCOUNTINFO.elecAcct.acctNo,
				in_balance:this.state.ACCOUNTINFO.elecAcct.balance,
				inAcctName:this.state.ACCOUNTINFO.elecAcct.bankName,
				// refreshTransfer:this.refreshAssets,
				bank_no:this.state.ACCOUNTINFO.accts[0].bank_no,
				backRoute:'Assets'
			},
	        sceneConfig: Global.os == 'ios' ? Navigator.SceneConfigs.FloatFromBottom : Navigator.SceneConfigs.FloatFromBottomAndroid,
		})
	},

	//查询卡功能详情
	showCardDetail: function(item){
		// console.log(item);
		let title = '';
		if(item.type == '1') {
			title = '储蓄卡详情';
		} else if(item.type == '2') {
			title = '信用卡详情';
		}
		this.props.navigator.push({
			title: title,
			component: CardDetail,
			passProps: {
				acctInfo: item,
				refresh: this.refresh,
				backRoute : 'Assets'
			},
	        sceneConfig: Global.os == 'ios' ? Navigator.SceneConfigs.FloatFromBottom : Navigator.SceneConfigs.FloatFromBottomAndroid,
		});
	},
	pay:function(item,rowID){
		//console.log(item);
		this.props.navigator.push({
			title: '还款',
			component: CreditCardPayDetail,
			passProps:{
				bankName: item.bankName,
            	bank_no: item.bank_no,
            	acctNo: item.acctNo,
            	acctName: item.acctName,
            	// refreshTransfer: this.refreshCreditList,
            	backRoute: 'Assets',
            	rowID: rowID,
			},
	        sceneConfig: Global.os == 'ios' ? Navigator.SceneConfigs.FloatFromBottom : Navigator.SceneConfigs.FloatFromBottomAndroid,
		});
	},
	//暂未使用
	refreshCreditList:function(data){
		console.log("CreditCard refreshTransfer is call ------------");
		this.setState({
			pay_info: "正在还款，金额 " + this.filterMoney(data.amount) + " 元",
			rowID: data.rowID,
		})
	},
	refreshBankList: async function() {
		console.log("assets banklist refresh");
		// var ACCOUNTINFO = await this.listAccountsFilter(this.props.acctNo);
		// this.setState({
		// 	dataSource: this.state.dataSource.cloneWithRows(ACCOUNTINFO.accts),
		// });
		this.refresh();
	},

	refreshAssets: async function() {
		/*console.log("refreshAssets refresh**********");
		var ACCOUNTINFO = await this.listAccounts(this.state.USER_LOGIN_INFO.mobile);
		this.setState({
			doRenderScene: true,
			dataSource:this.state.dataSource.cloneWithRows(ACCOUNTINFO.accts),
		});*/
		this.refresh();
	},

	render: function() {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		var listView = null;
		var elecAcctFlag = null;
		var btnStyle = null;
		var btnPress = null ;

		if(this.state.ACCOUNTINFO && this.state.ACCOUNTINFO.elecAcct && this.state.ACCOUNTINFO.elecAcct.acctNo) {
			elecAcctFlag = (
				<View style={{backgroundColor: '#ffffff'}}>

					<View style={[styles.row]}>
						<Text style={{flex: 1, fontSize: 10}}>电子账户</Text>
						<Text style={{flex: 1, textAlign: 'right', fontSize: 10}}>余额</Text>
					</View>

					<View style={[styles.row, {paddingTop: 3, paddingBottom: 13}]}>
						<Text style={{flex: 1, fontSize: 15}} >
							{this.filterBankCard(this.state.ACCOUNTINFO.elecAcct.acctNo)}
						</Text>
						<Text style={{width: 100, textAlign: 'right', color: Global.colors.ORANGE, fontSize: 15}} >
							{this.filterMoney(this.state.ACCOUNTINFO.elecAcct.balance)}
						</Text>
					</View>

					<View style={Global.styles.FULL_SEP_LINE} />
		            <View style={{flex: 1, flexDirection: 'row', height: 35}} >
		            	<TouchableOpacity style={[Global.styles.CENTER, {flex: 1, flexDirection: 'row'}]} onPress={()=>{this.elecTransfer('电子账户转入',ElecTransferIn)}} >
		          			<Icon name='ios-download-outline' size={16} color={Global.colors.IOS_GRAY_FONT} style={Global.styles.ICON} />
		          			<Text style={{fontSize: 14, marginLeft: 8, color: Global.colors.IOS_BLUE}} >转入</Text>
		          		</TouchableOpacity>
		          		<TouchableOpacity style={[Global.styles.CENTER, {flex: 1, flexDirection: 'row', borderLeftWidth: 1 / Global.pixelRatio, borderLeftColor: Global.colors.IOS_SEP_LINE}]} onPress={()=>{this.elecTransfer('电子账户转出',ElecTransferOut)}} >
		          			<Icon name='ios-upload-outline' size={16} color={Global.colors.IOS_GRAY_FONT} style={Global.styles.ICON} />
		          			<Text style={{fontSize: 14, marginLeft: 8, color: Global.colors.IOS_BLUE}} >转出</Text>
		          		</TouchableOpacity>
		          		<TouchableOpacity style={[Global.styles.CENTER, {flex: 1, flexDirection: 'row', borderLeftWidth: 1 / Global.pixelRatio, borderLeftColor: Global.colors.IOS_SEP_LINE}]} >
		          			<Icon name='ios-settings' size={16} color={Global.colors.IOS_GRAY_FONT} style={Global.styles.ICON} />
		          			<Text style={{fontSize: 14, marginLeft: 8, color: Global.colors.IOS_BLUE}} >明细</Text>
		          		</TouchableOpacity>
		            </View>

				</View>
			);
			btnStyle = Global.styles.BLUE_BTN;
			btnPress = this.bindBanksCard;
		} else {
			elecAcctFlag = (
				<View style={[styles.item, Global.styles.CENTER]}> 
					<Text style={{flex: 1, fontSize: 15, textAlign: 'right', color: 'grey'}}>您还没有电子账户，</Text>
					<TouchableOpacity style={{flex: 1, marginLeft: 0}} onPress={()=>this.openElec()}>
						<Text style={{fontSize: 15, color:Global.colors.IOS_BLUE}}>点击免费在线开户。</Text>
					</TouchableOpacity>
				</View>
			);
			btnStyle =Global.styles.GRAY_BTN;
		}

		return (
			<View style={Global.styles.CONTAINER}>
			    {this._getNavBar()}
			    <View style={[styles.fixedMenuHolder]} >
			    	<View style={[styles.totalAssest, Global.styles.CENTER]}>
			    		<Text style={{fontSize: 10, color: 'white'}}>—— 总资产(元) ——</Text>
			    		<Text style={{fontSize: 25, color: 'white', fontWeight: '400', marginTop: 5}}>{this.filterMoney(this.state.ACCOUNTINFO.balance)}</Text>
			    	</View>
			    </View>
				<ScrollView 
					automaticallyAdjustContentInsets={false} 
					style={[styles.sv]}
					//refreshControl={this.getRefreshControl(this.refresh)} 
					>

			    	{/*<View style={Global.styles.FULL_SEP_LINE} />*/}
					{/*<View style={[styles.totalAssest, Global.styles.CENTER]}>
			    		<Text style={{fontSize: 12}}>总资产(元)</Text>
			    		<Text style={{fontSize: 25, color: Global.colors.ORANGE, fontWeight: '400', marginTop: 5,}}>{this.filterMoney(this.state.ACCOUNTINFO.balance)}</Text>
			    	</View>
			    	<View style={Global.styles.FULL_SEP_LINE} />*/}

					<View style={Global.styles.PLACEHOLDER20} />

					<View style={Global.styles.FULL_SEP_LINE} />
					{elecAcctFlag}
			    	<View style={Global.styles.FULL_SEP_LINE} />

					{this.data1.length > 0 ?
				    	(<View style={[{flex:1,flexDirection:'row',paddingTop:15,paddingBottom:5,paddingLeft:10}]}>
				    		<Text>储蓄卡（{this.state.ACCOUNTINFO.debitCardNum}张）</Text>
				    	</View>):null
				   	}
							
					<ListView
						key={this.key1}
				        dataSource={this.state.dataSource}
				        renderRow={this.renderItem}
				        style={[styles.list]} />

			        {this.data2.length > 0 ?
				    	(<View style={[{flex:1,flexDirection:'row',paddingTop:15,paddingBottom:5,paddingLeft:10}]}>
				    		<Text>信用卡（{this.state.ACCOUNTINFO.creditCardNum}张）</Text>
				    	</View>):null
				    }

				    <ListView
						key={this.key2}
				        dataSource={this.state.dataSource1}
				        renderRow={this.renderItem}
				        style={[styles.list]} />

				    <TouchableOpacity 
				    	style={[Global.styles.BLUE_BTN, {margin: 20},btnStyle]} 
				    	onPress={btnPress} >
			    		<Icon name='plus' size={20} color={'#FFFFFF'} style={[Global.styles.ICON,{marginRight: 5,}]} />
			    		<Text style={{color:'#FFFFFF'}}>绑定银行卡</Text>
			    	</TouchableOpacity>

			    </ScrollView>
		    </View>
		);
	},

	renderItem: function(item, sectionID, rowID) {
         var  card = null;
         if(item.type == 1){
         	if(item.bankName == Global.bank.name) {
         		card = (<View style={{flex: 1, height: 55}} >
	         		<View style={[styles.rend_row, Global.styles.CENTER]}>
						{Global.bankLogos[item.bank_no]}
						<View style={[{flex: 1, paddingLeft: 5, flexDirection: 'row'}]}>
							<Text style={{fontSize: 12}} >
						  		{item.bankName}
							</Text>
							<Text style={{fontSize: 12, color: Global.colors.IOS_GRAY_FONT}}>
						  		（尾号{this.filterCardNumLast4(item.acctNo)}）
							</Text>
						</View>
						<Text style={{width: 120, fontSize: 11, textAlign: 'right', color: Global.colors.IOS_GRAY_FONT, marginRight: 10}}>
							余额：{this.filterMoney(item.balance)}
						</Text>
					</View>
	 	         	<View style={[Global.styles.ACCT.OPTION_ROW]} >
		          		<TouchableOpacity style={[Global.styles.ACCT.OPTION_BTN]} onPress={()=>{this.Transfer('转账',TransferOut,item.acctNo,item.balance,item.bank_no,item.bankName)}}>
		          			<Text style={[Global.styles.ACCT.OPTION_BTN_TEXT]}>转账</Text>
		          		</TouchableOpacity>
		          		<TouchableOpacity style={[Global.styles.ACCT.OPTION_BTN]} >
		          			<Text style={[Global.styles.ACCT.OPTION_BTN_TEXT]}>明细</Text>
		          		</TouchableOpacity>
	 		        </View>
		        </View>);
         	} else {
         		card = 
	         		(<View style={[styles.rend_row, Global.styles.CENTER, {height: 45}]}>
						{Global.bankLogos[item.bank_no]}
						<View style={[{flex: 1, paddingLeft: 5, flexDirection: 'row'}]}>
							<Text style={{fontSize: 12}} >
						  		{item.bankName}
							</Text>
							<Text style={{fontSize: 12, color: Global.colors.IOS_GRAY_FONT}}>
						  		（尾号{this.filterCardNumLast4(item.acctNo)}）
							</Text>
						</View>
					</View>);
			}
        } else {
         	if(item.bankName == Global.bank.name){
         		card = (
	         		<View style={[styles.rend_row, Global.styles.CENTER, {height: 45}]}>
						{Global.bankLogos[item.bank_no]}
						<View style={[{flex: 1, paddingLeft: 5, flexDirection: 'row'}]}>
							<Text style={{fontSize: 12}} >
						  		{item.bankName}
							</Text>
							<Text style={{fontSize: 12, color: Global.colors.IOS_GRAY_FONT}}>
						  		（尾号{this.filterCardNumLast4(item.acctNo)}）
							</Text>
						</View>
						<View style={[Global.styles.ACCT.OPTION_ROW]} >
			          		<TouchableOpacity style={[Global.styles.ACCT.OPTION_BTN]} >
			          			<Text style={[Global.styles.ACCT.OPTION_BTN_TEXT]}>账单</Text>
			          		</TouchableOpacity>
			          		<TouchableOpacity style={[Global.styles.ACCT.OPTION_BTN]} onPress={()=>{this.pay(item,rowID)}}>
			          			<Text style={[Global.styles.ACCT.OPTION_BTN_TEXT]}>还款</Text>
			          		</TouchableOpacity>
		 		        </View>
					</View>
		        );
	         	
	        } else {
	        	card = (
	         		<View style={[styles.rend_row, Global.styles.CENTER, {height: 45}]}>
						{Global.bankLogos[item.bank_no]}
						<View style={[{flex: 1, paddingLeft: 5, flexDirection: 'row'}]}>
							<Text style={{fontSize: 12}} >
						  		{item.bankName}
							</Text>
							<Text style={{fontSize: 12, color: Global.colors.IOS_GRAY_FONT}}>
						  		（尾号{this.filterCardNumLast4(item.acctNo)}）
							</Text>
						</View>
						<View style={[Global.styles.ACCT.OPTION_ROW]} >
			          		<TouchableOpacity style={[Global.styles.ACCT.OPTION_BTN]} onPress={()=>{this.pay(item,rowID)}}>
			          			<Text style={[Global.styles.ACCT.OPTION_BTN_TEXT]}>还款</Text>
			          		</TouchableOpacity>
		 		        </View>
					</View>
		        );
	        }
         }
        var topLine = rowID === '0' ? <View style={Global.styles.FULL_SEP_LINE} /> : null;
        var bottomLine = (<View style={Global.styles.FULL_SEP_LINE} />);
		return (
			<TouchableOpacity style={styles.bankList} onPress={()=>{this.showCardDetail(item)}}>
				{topLine}
				{card}
	        	{bottomLine}
	        </TouchableOpacity>
		);
	},
	
	_renderPlaceholderView: function() {
		return (
			<View style={Global.styles.CONTAINER} >{this._getNavBar()}</View>
		);
	},

	_getNavBar: function() {
		return (
			<NavBar 
		    	title='资产' 
		    	navigator={this.props.navigator} 
				route={this.props.route}
		    	hideBackButton={true} 
		    	theme={NavBar.THEME.BLUE}
		    	statusBarStyle='light-content'
		    	flow={false} 
				rightButtons={(
					<View style={[Global.styles.NAV_BAR.BUTTON_CONTAINER, Global.styles.NAV_BAR.RIGHT_BUTTONS]}>
						<TouchableOpacity style={[Global.styles.NAV_BAR.BUTTON]} onPress={this.refresh}>
							<Text style={{color: 'white'}}>刷新</Text>
						</TouchableOpacity>
					</View>
				)} />
		);
	},
});

var styles = StyleSheet.create({
	sv: {
		flex: 1,
		marginBottom: Global.os == 'ios' ? 49 : 0,
	},

	totalAssest: {
		width: Global.getScreen().width,
		height: 70,
		backgroundColor: 'rgba(68, 92, 149, 1)',
	},

	item: {
		width: Global.getScreen().width,
		backgroundColor: '#ffffff',
        flexDirection: 'row',
        justifyContent: 'center',
		alignItems: 'center',
		height:60,
	},
	cardItem:{
		flex: 1,
		backgroundColor: '#ffffff',
        flexDirection: 'row',
	},

	row: {
		flexDirection: 'row',
		padding: 10,
	},
	col: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		width: Global.getScreen().width/4,
		textAlign:'center',
		paddingTop:5,
		paddingBottom:0,
	},
	cardType:{
		textAlign: 'center',
		fontSize: 10,
		marginTop: 5,
		marginBottom: 5,
		//marginLeft: 10,
		color: Global.colors.IOS_GRAY_FONT,
	},
	cardNumTopLine: {
		borderTopWidth: 1 / Global.pixelRatio,
		borderTopColor: Global.colors.IOS_SEP_LINE,
	},
	cardTypeText: {
		color: Global.colors.IOS_GRAY_FONT, 
		fontSize: 12,
	},
	cardTypeNum: {
		fontSize: 18,
		fontWeight: '300',
	},
	placeholder: {
		flex: 1,
		height: 20,
	},
	bankList: {
		//padding: 10,
    	backgroundColor: '#FFFFFF',
	},
	rend_row: {
    	flexDirection: 'row',
    	flex: 1,
    	paddingLeft: 5,
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
  	bankOption:{
  		flexDirection:'row',
  	},
  	textFont:{
  		color:Global.colors.IOS_BLUE,
  		paddingRight:20
  	}
	
});

module.exports = Assets;
