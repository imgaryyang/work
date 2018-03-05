'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Global = require('../../Global');
var Icon = require('react-native-vector-icons/Ionicons');
var AccountService = require('../AccountService');
var LoginService = require('../LoginService');
var Loading = require('../lib/Loading');
var BindBanksCard = require('./BindBanksCard');

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

var ACCOUNTINFO = {};
var CashierDesk = React.createClass({
	data: {},
	item: null,
	rowID: null,
	getInitialState:function(){
		var ds = new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2,
		});
		return{
			doRenderScene:false,
			dataSource: ds.cloneWithRows(this._genRows({})),
			showLoading: false,
			showAlert: false,
			showConfirm: false,
		}
	},
	componentDidMount: async function() {
		var loginInfo = await LoginService.findLoginInfo();
		console.log("loginInfo:"+loginInfo);
		if(loginInfo != null){
			ACCOUNTINFO = await this.listAccounts(loginInfo.mobile);
			console.log("*****banklist ACCOUNTINFO*****");
			//console.log(ACCOUNTINFO);
			InteractionManager.runAfterInteractions(() => {
				this.setState({
					doRenderScene: true,
					dataSource:this.state.dataSource.cloneWithRows(ACCOUNTINFO.accts),
				});
			});
		}else{
				this.setState({
					doRenderScene: true,
				});
				//console.log(this.props);
				/*var nav = this.props.navigator ? this.props.navigator : this.props.rootNavigator;
		        nav.push({
		        	title: "登录",
		            component: Login,
		            hideNavBar: true,
		            //preComponent:this.props,
		           // preTitle:preTitle,
		            passProps: {
	            	refresh: this.refresh,
	            	},
		        });
*/		}
		
	},
	_genRows: function(pressData: {[key: number]: boolean}): Array<string> {
		var dataBlob = [];
		/*for (var ii = 0; ii < 1; ii++) {
			var pressedText = pressData[ii] ? ' (pressed)' : '';
			dataBlob.push('Row ' + ii + pressedText);
		}*/
		return dataBlob;
	},
	bindBanksCard:function(){
		this.props.navigator.push({
			title:'绑定银行卡',
			component:BindBanksCard
		});
	},
	render:function(){
		var listView = null;
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();
		return (
			<View style={styles.container}>
				<ScrollView style={[styles.sv]}>
					<ListView
						key={this.data}
				        dataSource={this.state.dataSource}
				        renderRow={this.renderItem}
				        style={[styles.list]} />
				        <View style={[{flex: 1, flexDirection: 'row', marginTop: 10,paddingLeft:20,paddingRight:20,}]}>
					    	<TouchableOpacity 
								style={[Global.styles.CENTER, {height: 40,backgroundColor: Global.colors.IOS_BLUE, flex:1,borderRadius: 3,flexDirection:'row'}]} 
								onPress={()=>{this.bindBanksCard()}}>
					        	<Icon name='plus' size={20} color={'#FFFFFF'} style={[Global.styles.ICON]} />

					    		<Text style={{color: '#ffffff',paddingLeft:5}}>绑定银行卡</Text>
					    	</TouchableOpacity>
						</View>
				</ScrollView>
				 {<NavBar title='转账' rootNavigator={this.props.rootNavigator} hideBackButton={false} />}
			</View>
		)
	},
	renderItem: function(item: string, sectionID: number, rowID: number) {
		return (		
				<View style={styles.bankList}>
					<View style={styles.rend_row}>
			            <Image style={styles.thumb} source={{uri: Global.host + Global.bankLogoPath + item.bank_no+'-middle.png'}} />
			            <View style={{paddingLeft:10}}>
			            	<Text style={[styles.text],{fontSize:15,paddingTop:5}}>
			              		{item.bankName}
			            	</Text>
			            	<Text style={[styles.text],{fontSize:12,color:'grey',paddingTop:5}}>
			              		可用额度{item.balance}元
			            	</Text>
			            </View>
		            </View>
			        <View style={styles.separator} />
				</View>
			)
	},
	_renderPlaceholderView: function() {
		return (
			<View></View>
		);
	},	
});

var styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Global.colors.IOS_GRAY_BG,
	},
	placeholder: {
		flex: 1,
		height: Global.NBPadding + 70,
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
    	paddingTop:10,
    	paddingLeft:5,
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

module.exports = CashierDesk;