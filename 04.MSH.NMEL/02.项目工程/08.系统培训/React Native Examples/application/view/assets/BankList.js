'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Global = require('../../Global');
var Icon = require('react-native-vector-icons/Ionicons');
var BindBanksCard = require('./BindBanksCard');

var AccountMixin = require('../AccountMixin');
var UtilsMixin = require('../lib/UtilsMixin');
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

var BankList = React.createClass({

	mixins:[UtilsMixin, AccountMixin, FilterMixin],

	getInitialState: function(){
		var ds = new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2,
		});

		return{
			doRenderScene:false,
			dataSource: ds.cloneWithRows(this._genRows({})),
		}
	},

	componentDidMount: async function() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({
				doRenderScene: true,
			});
		});
		if(Global.USER_LOGIN_INFO != null){
			ACCOUNTINFO = await this.listAccountsFilter(this.props.acctNo);
			if(this.props.kind == '3') {	//本储、电子账户
				ACCOUNTINFO.accts = ACCOUNTINFO.accts;
				if(ACCOUNTINFO.elecAcct.acctNo)
					ACCOUNTINFO.accts.push(ACCOUNTINFO.elecAcct);
			} else if(this.props.kind == '2') {		//储蓄卡
				ACCOUNTINFO.accts = ACCOUNTINFO.accts.concat(ACCOUNTINFO.acctsOther);
			}else if(this.props.kind == '1'){		//本储
				ACCOUNTINFO.accts = ACCOUNTINFO.accts;
			}
			this.setState({
				dataSource:this.state.dataSource.cloneWithRows(ACCOUNTINFO.accts),
			});
		}
	},

	// bindBanksCard: function(){
	// 	this.props.navigator.push({
	// 		title:'绑定银行卡',
	// 		component:BindBanksCard,
	// 		passProps:{
	// 			refreshBankList:this.refreshBankList,
	// 			backRoute: this.props.route,
	// 		}
	// 	});
	// },

	_genRows: function(pressData: {[key: number]: boolean}): Array<string> {
		var dataBlob = [];
		return dataBlob;
	},

	changePayWay: function(item){
		console.log("changePayWay item:");
		console.log(item);
		this.props.refresh(item);
		this.props.navigator.pop();
	},

	/*refreshBankList: async function(){
		console.log("banklist refresh");
		ACCOUNTINFO = await this.listAccountsFilter(this.props.acctNo);
		if(this.props.kind == '3') {

			ACCOUNTINFO.accts = ACCOUNTINFO.accts;
			ACCOUNTINFO.accts.push(ACCOUNTINFO.elecAcct);
		}
		this.setState({
			doRenderScene: true,
			dataSource:this.state.dataSource.cloneWithRows(ACCOUNTINFO.accts),
		});
	},
*/
	render: function() {
		var listView = null;
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();
		return (
			<View style={Global.styles.CONTAINER}>
				<ScrollView style={[styles.sv]}>
					<View style={styles.paddingPlace} />

					<ListView
					        dataSource={this.state.dataSource}
					        renderRow={this.renderItem}
					        style={[styles.list]} />

			        {/*<View style={[{flex: 1, flexDirection: 'row', marginTop: 10,paddingLeft:20,paddingRight:20,}]}>
				    	<TouchableOpacity 
							style={[Global.styles.CENTER, {height: 40,backgroundColor: Global.colors.IOS_BLUE, flex:1,borderRadius: 3,flexDirection:'row'}]} 
							onPress={()=>{this.bindBanksCard()}}>
				        	<Icon name='plus' size={20} color={'#FFFFFF'} style={[Global.styles.ICON]} />

				    		<Text style={{color: '#ffffff',paddingLeft:5}}>绑定银行卡</Text>
				    	</TouchableOpacity>
					</View>*/}

					<View style={Global.styles.PLACEHOLDER20} />

				</ScrollView>
				<NavBar title="银行卡列表" navigator={this.props.navigator} route={this.props.route} />
			</View>
		)
	},

	renderItem: function(item: string, sectionID: number, rowID: number) {

		var logo = item.type != '0' ? Global.bankLogos[item.bank_no] : <View style={{width: 30}} />;
            
        var topLine = rowID === '0' ? <View style={Global.styles.FULL_SEP_LINE} /> : null;
        var bottomLine = (<View style={Global.styles.FULL_SEP_LINE} />);

		return (	
			<View style={styles.bankList}>
				{topLine}
				<TouchableOpacity style={[styles.rend_row, Global.styles.CENTER, {paddingTop: 10, paddingBottom: 10}]} onPress={()=>{this.changePayWay(item)}}>
	            	{logo}
		            <View style={{paddingLeft: 10, flex: 1}}>
		            	<Text style={[styles.text, {fontSize: 15}]}>
		              		{item.type == '1' ? item.bankName + '(尾号' + this.filterCardNumLast4(item.acctNo) + ')' : '电子账户'}
		            	</Text>
		            	<Text style={[styles.text, {fontSize: 12, color: Global.colors.IOS_GRAY_FONT}]}>
		              		可用额度{this.filterMoney(item.balance)}元
		            	</Text>
		            </View>
	            </TouchableOpacity>
		        {bottomLine}
			</View>
		)
	},

	_renderPlaceholderView: function() {
		return (
			<View>
				<NavBar title="银行卡列表" navigator={this.props.navigator} route={this.props.route} />
			</View>
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

	bankList:{
		//padding: 10,
    	backgroundColor: '#FFFFFF',
	},
	rend_row: {
    	flexDirection: 'row',
		flex: 1,
    	paddingLeft: 10,
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

module.exports = BankList;


