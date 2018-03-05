'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Global = require('../../Global');
var Icon = require('react-native-vector-icons/Ionicons');

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
	Alert,
} = React;

var BankList = [];

var GET_BANKS_LIST = 'banks/list';

var CreditBankList = React.createClass({

	mixins: [UtilsMixin, AccountMixin, FilterMixin],

	data: {},
	item: null,
	rowID: null,

	getInitialState: function(){
		var ds = new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2,
		});
		return{
			doRenderScene: false,
			dataSource: ds.cloneWithRows(this._genRows({})),
			showLoading: false,
			showAlert: false,
			showConfirm: false,
		}
	},

	componentDidMount: async function() {
		try {
			this.showLoading();
			let response = await this.request(Global.host + GET_BANKS_LIST);
			this.hideLoading();
			BankList = response.body;
			this.setState({
				doRenderScene: true,
				dataSource: this.state.dataSource.cloneWithRows(BankList),
			});
		} catch(e) {
			this.requestCatch(e);
		}
	},

	_genRows: function(pressData: {[key: number]: boolean}): Array<string> {
		var dataBlob = [];
		/*for (var ii = 0; ii < 1; ii++) {
			var pressedText = pressData[ii] ? ' (pressed)' : '';
			dataBlob.push('Row ' + ii + pressedText);
		}*/
		return dataBlob;
	},
	changePayWay:function(item){
		console.log("changePayWay item:");
		//console.log(item);
		this.props.refreshCredit.call(this,item);
		this.props.navigator.pop();
	},
	refreshBankList:async function(){
		console.log("banklist refresh");
		ACCOUNTINFO = await this.listAccountsFilter(this.props.acctNo);
		if(this.props.kind == '3'){

			ACCOUNTINFO.accts = ACCOUNTINFO.accts;
			ACCOUNTINFO.accts.push(ACCOUNTINFO.elecAcct);
		}
		this.setState({
			doRenderScene: true,
			dataSource:this.state.dataSource.cloneWithRows(ACCOUNTINFO.accts),
		});

	},
	render:function(){
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		var listView = null;
		return (
			<View style={Global.styles.CONTAINER}>
				<ScrollView style={[styles.sv]}>
				<View style={styles.paddingPlace} />

					<ListView
				        dataSource={this.state.dataSource}
				        renderRow={this.renderItem} />

					<View style={Global.styles.PLACEHOLDER20} />
				      
				</ScrollView>
			</View>
		)
	},
	renderItem: function(item: string, sectionID: number, rowID: number) {
		//console.log(item);
            
        var topLine = rowID === '0' ? <View style={Global.styles.FULL_SEP_LINE} /> : null;
        var bottomLine = (<View style={Global.styles.FULL_SEP_LINE} />);

		return (	
			<View style={styles.bankList}>
				{topLine}
				<TouchableOpacity 
					style={[Global.styles.CENTER, styles.rend_row]} 
					onPress={()=>{this.changePayWay(item)}} >

					{Global.bankLogos[item.bankno]}
	            	<Text style={[styles.text, {fontSize: 13, marginLeft: 10}]}>
	             		{item.bankName}
	            	</Text>

	            </TouchableOpacity>
	            {bottomLine}
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
		//paddingTop: 40,
	},

	bankList:{
		//padding: 10,
    	backgroundColor: '#FFFFFF',
	},
	rend_row: {
    	flexDirection: 'row',
		flex: 1,
    	height: 45,
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

module.exports = CreditBankList;