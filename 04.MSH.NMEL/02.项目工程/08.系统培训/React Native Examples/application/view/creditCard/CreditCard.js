'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Global = require('../../Global');
var Icon = require('react-native-vector-icons/Ionicons');
var AddCreditCard = require('./AddCreditCard');
var CreditCardPayDetail = require('./CreditCardPayDetail');
var CardDetail = require('../assets/CardDetail');

var UtilsMixin = require('../lib/UtilsMixin');
var FilterMixin = require('../../filter/FilterMixin');
var AccountMixin = require('../AccountMixin');

var {
	StyleSheet,
	ScrollView,
	View,
	Text,
	Image,
	TouchableOpacity,
	Navigator,
	InteractionManager,
	ListView,
	TextInput,
} = React;

var ACCOUNTINFO = {};

var CreditCard = React.createClass({

	mixins:[UtilsMixin, AccountMixin, FilterMixin],

	getInitialState:function(){
		var ds = new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2,
		});
		return{
			amount:null,
			dataSource: ds.cloneWithRows(this._genRows({})),
			pay_info :null,
			rowID:null,
		}
	},

	componentDidMount: async function() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({
				doRenderScene: true,
			});
		});
		if(Global.USER_LOGIN_INFO != null){
			ACCOUNTINFO = await this.getCreditCardList();
			//console.log("*****ACCOUNTINFO*acctsCredit****");
			//console.log(ACCOUNTINFO);
			this.setState({
				dataSource:this.state.dataSource.cloneWithRows(ACCOUNTINFO.creditCardList),
			});
		}
		
	},
	_genRows: function(pressData: {[key: number]: boolean}): Array<string> {
		console.log("_genRows");
		var dataBlob = [];
		/*for (var ii = 0; ii < 1; ii++) {
			var pressedText = pressData[ii] ? ' (pressed)' : '';
			dataBlob.push('Row ' + ii + pressedText);
		}*/
		return dataBlob;
	},
	refresh: async function(){
		console.log("refresh call***************");
		ACCOUNTINFO = await this.getCreditCardList();
		console.log(ACCOUNTINFO);
		this.setState({
					dataSource:this.state.dataSource.cloneWithRows(ACCOUNTINFO.creditCardList),
				});

	},
	addCreditCard:function(){
		this.props.navigator.push({
			title: "添加信用卡",
	        component: AddCreditCard,
	        passProps: {
            	refresh: this.refresh,
            	backRoute:this.props.route,
            },
		});
	},
	pay:function(item,rowID){
		//console.log(item);
		console.log("CreditCard*******");
		this.props.navigator.push({
			title: '还款',
			component: CreditCardPayDetail,
			passProps:{
				bankName: item.bankName,
            	bank_no: item.bank_no,
            	acctNo: item.acctNo,
            	acctName: item.acctName,
            	refreshTransfer: this.refreshCreditList,
            	backRoute: this.props.route,
            	rowID: rowID,
			}
		});
	},
	refreshCreditList:function(data){
		console.log("CreditCard refreshTransfer is call ------------");
		this.setState({
			pay_info: "正在还款，金额 " + this.filterMoney(data.amount) + " 元",
			rowID: data.rowID,
		})
	},
	// 查询卡功能详情
	showCard: function(item){
		this.props.navigator.push({
			title:'信用卡详情',
			component: CardDetail,
			passProps: {
				acctInfo: item,
				refresh: this.refresh,
				backRoute: this.props.route
			}
		});
	},
	render: function() {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		return(
			<View style={Global.styles.CONTAINER}>
				{this._getNavBar()}
				<ScrollView style={styles.sv}>

					<ListView
						key={this.state.pay_info}
				        dataSource={this.state.dataSource}
				        renderRow={this.renderItem}
				        style={[styles.list]} />

			    	<TouchableOpacity 
						style={[Global.styles.BLUE_BTN, {marginTop: 10}]} 
						onPress={()=>{this.addCreditCard()}}>
		    			<Icon name='plus' size={20} color={'#FFFFFF'} style={[Global.styles.ICON,{marginRight: 5,}]} />
			    		<Text style={{color: '#ffffff'}}>添加信用卡</Text>
			    	</TouchableOpacity>

					<View style={Global.styles.PLACEHOLDER20} />

				</ScrollView>
			</View>
		)
	},

	renderItem:function(item, sectionID, rowID) {
		return(
			<TouchableOpacity style={[styles.ccHolder]} onPress={()=>{this.showCard(item)}}>

				<View style={[styles.ccRow]} >
					<View style={[styles.bankLogo, Global.styles.CENTER]} >
						{Global.bankLogos[item.bank_no]}
					</View>
					<View style={{flex: 1, paddingLeft: 15}} >
						<Text style={{fontSize: 15, color: 'white', marginTop: 3, marginBottom: 5}}>
		              		{item.bankName}
		            	</Text>
		            	<Text style={{fontSize: 12, color: 'white', marginBottom: 2}}>
		              		{'******** ' + this.filterCardNumLast4(item.acctNo)}
		            	</Text>
		            	<Text style={{fontSize: 12, color: 'white', marginBottom: 7}}>
		              		{item.acctName}
		            	</Text>
					</View>
				</View>

				<View style={[styles.ccRow, Global.styles.CENTER, {height: 42, backgroundColor: 'rgba(0,0,0,.2)'}]} >
		        	<TouchableOpacity style={{flex: 1}} >
		        		<Text style={{fontSize: 12, color: '#ffffff'}}>{(this.state.rowID == rowID&&this.state.pay_info != null)?this.state.pay_info:'查询信用卡账单'}</Text>
		        	</TouchableOpacity>
		        	<TouchableOpacity style={[styles.button, Global.styles.CENTER]} onPress={()=>{this.pay(item,rowID)}}>
		        		<Text style={{fontSize: 12, color: '#ffffff', textAlign: 'center'}}>还款</Text>
		        	</TouchableOpacity>
				</View>

			</TouchableOpacity>
		)
	},

	_renderPlaceholderView: function() {
		return (
			<View style={Global.styles.CONTAINER}>
				{this._getNavBar()}
		    </View>
		);
	},

	_getNavBar: function() {
		return (
			<NavBar 
		    	title='信用卡列表' 
		    	navigator={this.props.navigator} 
				route={this.props.route} 
		    	flow={false} 
				rightButtons={(
					<View style={[Global.styles.NAV_BAR.BUTTON_CONTAINER, Global.styles.NAV_BAR.RIGHT_BUTTONS]}>
						<TouchableOpacity style={[Global.styles.NAV_BAR.BUTTON]} onPress={this.refresh}>
							<Text style={{color: Global.colors.IOS_BLUE}}>刷新</Text>
						</TouchableOpacity>
					</View>
				)} />
		);
	},
});
var styles = StyleSheet.create({
	sv: {
		flex: 1,
		backgroundColor: 'white',
		padding: 20,
	},
    paddingPlace: {
    	flex: 1,
        height: Global.NBPadding + 10,
    },

    ccHolder: {
    	marginBottom: 10,
    	borderRadius: 5,
    	backgroundColor: Global.colors.ORANGE,
    	paddingTop: 10,
    	paddingBottom: 15,
    },
    ccRow: {
    	flex: 1,
    	flexDirection: 'row',
    	paddingLeft: 15,
    	paddingRight: 15, 
    },
    bankLogo: {
    	width: 35,
    	height: 35,
    	borderRadius: 17.5,
    	backgroundColor: 'white',
    	overflow: 'hidden',
    },
    button: {
    	borderColor: 'white',
    	borderWidth: 1 / Global.pixelRatio,
    	borderRadius: 3,
    	width: 50,
    	height: 26,
    },

});

module.exports = CreditCard;