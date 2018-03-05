'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Global = require('../../Global');
var Icon = require('react-native-vector-icons/Ionicons');

var AccountMixin = require('../AccountMixin');
var CreditBankList = require('./CreditBankList');
var UtilsMixin = require('../lib/UtilsMixin');
var TimerMixin = require('react-timer-mixin');

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
	Switch,
	Alert,
} = React;

var ACCOUNTINFO = {};

var SAVE_ACCOUNT_URL = 'account/save';

var AddCreditCard = React.createClass({

	mixins:[UtilsMixin],

	getInitialState: function(){
		return{
			remind: true,
			acctNo: null,
			bankCode: null,
			bankName: null,
			name: null,
		}
	},
	componentDidMount: async function() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({
				doRenderScene: true,
			});
		});
	},
	addCreditCard:async function(){
		if(this.state.acctNo == null){
			Alert.alert(
				'提示',
				'请输入卡号'
				);
		}else if(this.state.bankCode == null){
			Alert.alert(
				'提示',
				'请选择发卡行'
				);
		}else if(this.state.name == null){
			Alert.alert(
				'提示',
				'请输入持卡人姓名'
				);
		}else{
			this.showLoading();
			this.setState({
				loaded: false,
				fetchForbidden: false,
			});
			try {
				let responseData = await this.request(Global.host + SAVE_ACCOUNT_URL, {
					body: JSON.stringify({
						acctNo: this.state.acctNo,
		            	bankName: this.state.bankName,
		            	name: this.state.name,
		            	phone: Global.USER_LOGIN_INFO.mobile,
		            	openData: Date.now(),
		            	type: '2',
					})
				});
				this.hideLoading();
				this.props.refresh.call();
				this.props.navigator.popToRoute(this.props.backRoute);
				//this.props.refreshUser();
			} catch(e) {
				this.requestCatch(e);
			}
		}
	},
	banks:function(){
		this.props.navigator.push({
			title: '选择银行',
			component: CreditBankList,
			passProps:{
				refreshCredit: this.refreshCredit
			}
		})
	},
	refreshCredit:function(data){
		//console.log("AddCreditCard refresh data:");
		//console.log(data);
		this.setState({
			bankCode: data.bankno,
			bankName: data.bankName,
		})
	},
	remindChange: function() {
		this.setState({remind: !this.state.remind});
	},
	render: function() {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		var bankText = this.state.bankName ? this.state.bankName : '选择发卡行';
		return(
			<View style={Global.styles.CONTAINER}>
				<ScrollView style={styles.sv} >

            		<View style={styles.paddingPlace} />

            		<View style={styles.form} >

            			<View style={Global.styles.FULL_SEP_LINE} />
						<View style={[Global.styles.CENTER, styles.rend_row]}>
						 	<Text style={styles.label} >卡号：</Text>
						 	<TextInput style={[Global.styles.FORM.NO_BORDER_TEXT_INPUT, {flex: 1, height: 50}]} autoFocus={true} placeholder='信用卡号' value={this.state.acctNo} onChangeText={(value)=>{this.setState({acctNo: value})}} />
						</View>

            			<View style={Global.styles.FULL_SEP_LINE} />
						<TouchableOpacity style={[Global.styles.CENTER, styles.rend_row]} onPress={()=>{this.banks()}}>
							<Text style={styles.label} >银行：</Text>
							<Text style={[{flex: 1, marginLeft: 5, fontSize: 13}]}>{bankText}</Text>	
				            <Icon name='ios-arrow-right' size={18} color={Global.colors.IOS_DARK_GRAY} style={[Global.styles.ICON, {width: 40}]} />
				        </TouchableOpacity>

            			<View style={Global.styles.FULL_SEP_LINE} />
				        <View style={[Global.styles.CENTER, styles.rend_row]}>
							<Text style={styles.label} >姓名：</Text>
							<TextInput style={[Global.styles.FORM.NO_BORDER_TEXT_INPUT, {flex: 1, height: 50}]} placeholder='持卡人姓名'  value={this.state.name} onChangeText={(value)=>{this.setState({name: value})}}/>				            
				        </View>

            			<View style={Global.styles.FULL_SEP_LINE} />
				        <View style={[Global.styles.CENTER, styles.rend_row]}>
				        	<Text style={{flex: 1}} >还款提醒：</Text>
				        	<Switch style={{width: 50}} value={this.state.remind} onValueChange={this.remindChange} />
				        </View>
            			<View style={Global.styles.FULL_SEP_LINE} />

			        </View>

					<View style={Global.styles.PLACEHOLDER20} />

			    	<TouchableOpacity 
						style={[Global.styles.BLUE_BTN, {margin: 20}]} 
						onPress={()=>{this.addCreditCard()}}>
			    		<Text style={{color: '#ffffff',}}>确定</Text>
			    	</TouchableOpacity>

				</ScrollView>
			</View>
		)
	},
	_renderPlaceholderView: function() {
		return (
			<View style={Global.styles.CONTAINER}></View>
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

	form: {
	},

	rend_row: {
    	flexDirection: 'row',
    	paddingLeft: 10,
    	paddingRight: 10,
    	borderWidth: 0,
    	backgroundColor: 'white',
    	height: 50,
    },

    label: {
    	width: 80,
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
  	icon: {
		textAlign: 'center',
	},
	/*placeholder: {
		flex: 1,
		height: 20,
	},*/

});

module.exports = AddCreditCard;