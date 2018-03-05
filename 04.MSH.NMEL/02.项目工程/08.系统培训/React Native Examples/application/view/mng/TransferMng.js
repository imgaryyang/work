'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Global = require('../../Global');
var Icon = require('react-native-vector-icons/Ionicons');
var AccountMixin = require('../AccountMixin');
var TransferIn = require('./BanksTransferIn');
var TransferOut = require('./BanksTransferOut');
var UtilsMixin = require('../lib/UtilsMixin');
// var BindBanksCard = require('../assets/BindBanksCard');
var FilterMixin = require('../../filter/FilterMixin');

var AccountStore = require('../stores/AccountStore');

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
} = React;

// var ACCOUNTINFO = {};

// var electInfo = {};

var TransferMng = React.createClass({

	item: null,
	rowID: null,
	mixins:[UtilsMixin, FilterMixin],

	getInitialState: function() {
		var ds = new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2,
		});
		return {
			doRenderScene:false,
			dataSource: ds.cloneWithRows(this._genRows({})),
			isRefreshing: false
		};
	},
	componentDidMount: async function() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({
				doRenderScene: true,
			});
		});
		if(Global.USER_LOGIN_INFO != null){
			this.fetchData();
			this.unsubscribe = AccountStore.listen(this.onChange);
			
		}		
	},
	componentWillUnmount: function() {
	    this.unsubscribe();
	},
	onChange: function(accounts) {
		if (Global.USER_LOGIN_INFO != null) {
			this.setState({
				ACCOUNTINFO : accounts
			});
			this.data=JSON.stringify(accounts);
			this.setState({
				dataSource:this.state.dataSource.cloneWithRows(this.state.ACCOUNTINFO.accts),
			});
		}
	},
	/*bindBanksCard: function(){
		console.log("in bindBanksCard**********");
		//console.log(this.props.navigator.getCurrentRoutes());
        this.props.navigator.push({
        	title: "绑定银行卡",
            component: BindBanksCard,
            passProps:{
            	refreshBankList:this.refreshBankList,
            	backRoute:this.props.route,
            }
        });
	},
	refreshBankList:async function(){
		console.log("TransferMng banklist refresh");
		ACCOUNTINFO = await this.listAccountsFilter(this.props.acctNo);
		electInfo = ACCOUNTINFO.elecAcct;
		this.setState({
			dataSource:this.state.dataSource.cloneWithRows(ACCOUNTINFO.accts),
		});
	},*/

	_genRows: function(pressData: {[key: number]: boolean}): Array<string> {
		var dataBlob = [];
		return dataBlob;
	},
	
	fetchData:async function(){
		var ACCOUNTINFO = await AccountStore.getAccounts();
		this.data = JSON.stringify(ACCOUNTINFO);
		this.setState({
			ACCOUNTINFO:ACCOUNTINFO,
		});
		this.setState({
			doRenderScene: true,
			dataSource: this.state.dataSource.cloneWithRows(this.state.ACCOUNTINFO.accts),
		});
		this.setState({isRefreshing: false});
	},

	Transfer: function(title, component, acctNo, balance, bankNo,bankName){
	    this.props.navigator.push({
	        title: title,
	        component: component,
	        passProps: {
            	acctNo: acctNo,
            	balance: balance,
            	// refreshTransfer: this.refresh,
            	bankName:bankName,
            	// outAcctNo: electInfo.acctNo,
            	// out_balance: electInfo.balance,
            	bank_no: bankNo,
            	backRoute: this.props.route
            },
	   });
	},

	refresh: async function() {
		this.setState({isRefreshing: true});
		this.fetchData();
	},

	render: function() {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		var listView = null;
		return (
			<View style={Global.styles.CONTAINER}>
				<ScrollView style={[styles.sv]} automaticallyAdjustContentInsets={false}  refreshControl={this.getRefreshControl(this.refresh)}>
					<View style={styles.paddingPlace} />
					<ListView
						key={this.data}
				        dataSource={this.state.dataSource}
				        renderRow={this.renderItem}
				        style={[styles.list]} />

				    {/*<TouchableOpacity style={[Global.styles.CENTER, {height: 40,marginLeft:20,marginRight:20,flexDirection:'row', flex: 1,backgroundColor: Global.colors.IOS_BLUE, borderRadius: 3, marginTop: 20,}]} onPress={()=>{this.bindBanksCard()}}>
			    		<Icon name='plus' size={20} color={'#FFFFFF'} style={[Global.styles.ICON,{marginRight:5,}]} />
			    		<Text style={{color:'#FFFFFF'}}>绑定银行卡</Text>
			    	</TouchableOpacity>*/}

					<View style={Global.styles.PLACEHOLDER20} />

				</ScrollView>
			</View>
		)
	},
	renderItem: function(item: string, sectionID: number, rowID: number) {

		var topLine = rowID === '0' ? <View style={Global.styles.FULL_SEP_LINE} /> : null;
        var bottomLine = (<View style={Global.styles.FULL_SEP_LINE} />);

		return (		
			<TouchableOpacity style={styles.bankList} onPress={()=>{this.Transfer('转账',TransferOut,item.acctNo,item.balance,item.bank_no,item.bankName)}}>
				{topLine}
		        <View style={[styles.rend_row,Global.styles.CENTER]}>
					{Global.bankLogos[item.bank_no]}
		            <View style={[{flex: 0.7, paddingLeft: 5}]}>
						<Text style={{fontSize: 12}} >
					  		{item.bankName}
						</Text>
						<Text style={{fontSize: 12, marginTop: 5, color: Global.colors.IOS_GRAY_FONT}}>
					  		(尾号{this.filterCardNumLast4(item.acctNo)})
						</Text>
					</View>
					<Text style={{flex: 1, fontSize: 13, color: Global.colors.ORANGE, textAlign: 'right'}}>
				  		余额：{this.filterMoney(item.balance)}
					</Text>
					<Icon name='ios-arrow-right' size={18} color={Global.colors.IOS_DARK_GRAY} style={[Global.styles.ICON, {width: 20, marginLeft: 10}]} />

		        </View>
		          
   	         	{bottomLine}
		    </TouchableOpacity>
		);
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
		//paddingTop: 40,
	},

	bankList:{
		//padding: 10,
    	backgroundColor: '#FFFFFF',
	},
	rend_row: {
    	flexDirection: 'row',
		width: Dimensions.get('window').width,
    	padding:10,
    	// paddingLeft:5,
    	// paddingRight: 10,
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

module.exports = TransferMng;

