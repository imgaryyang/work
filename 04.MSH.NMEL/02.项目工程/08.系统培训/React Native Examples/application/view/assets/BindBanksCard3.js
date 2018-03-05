'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Global = require('../../Global');
var Icon = require('react-native-vector-icons/Ionicons');
var BindBanksCard4 = require('./BindBanksCard4');
var UtilsMixin = require('../lib/UtilsMixin');
var TimerMixin = require('react-timer-mixin');
var AccountAction = require('../actions/AccountAction');
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
	Alert,
} = React;

var SAVE_ACCOUNT_URL = 'account/save';

var BindBanksCard3 = React.createClass({
	mixins:[UtilsMixin,TimerMixin],
	getInitialState:function(){
		return {
			currPageIdx:2,
			smSecuCode:null,
		}
	},
	componentDidMount: function() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({
				doRenderScene: true,
			});
		});

	},
	saveAccount:async function(){
		if(this.state.smSecuCode == null){
			Alert.alert(
				'提示', 
				'短信验证码必输',
				);
		}else{
			let balance = this.props.bankName===Global.bank.name ? 10000:null;
			this.showLoading();
			try {
				let responseData = await this.request(Global.host + SAVE_ACCOUNT_URL, {
					body: JSON.stringify({
						acctNo: this.props.acctNo,
		            	bankName:this.props.bankName,
		            	phone:this.props.mobile,
		            	smSecuCode:this.state.smSecuCode,
		            	pid:this.props.pid,
		            	openData:Date.now(),
		            	//encryPwd:'111111',//卡的支付密码
		            	type:this.props.type,
		            	balance:balance,
		            	name:this.props.name
		   			}),
				});
				this.hideLoading();
				if(responseData.status == 'success'){
					AccountAction.createAccount(responseData.body);
					this.next();

				}else{
					Alert.alert('警告',responseData.msg,[{
						text:'确定',
						onPress:()=>{
							this.props.navigator.popToTop();
						}

					}]);
				}
			} catch(e) {
				this.requestCatch(e);
			}
		}
	},
	next:function(){
		this.props.navigator.push({
			title: "绑定银行卡",
	        component: BindBanksCard4,
            hideNavBar: true,
	        passProps: {
            	acctNo: this.props.acctNo,
            	bankName:this.props.bankName,
            	// refreshBankList:this.props.refreshBankList,
            	backRoute: this.props.backRoute,
            },
		});
	},
	getSMAuthCode: function() {
		this.toast('已将验证码发至您的手机，请注意查收！');
	},
	render: function() {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();
		return(
			<View style={styles.container}>
				<ScrollView style={styles.sv}>
                	<View style={styles.paddingPlace} />

					<View style={[styles.inputBlock]}>
						<View style={{flex:1,flexDirection:'row'}}>
							<TextInput style={[Global.styles.FORM.TEXT_INPUT, {flex:1}]} placeholder="验证码" value={this.state.smSecuCode} maxLength={6} onChangeText={(value)=>{this.setState({smSecuCode: value})}}/>
							<View style={{flex: 0.05}}></View>
							<TouchableOpacity style={[Global.styles.CENTER, {height: 34, flex: 1, borderColor: Global.colors.ORANGE, borderWidth: 1 / Global.pixelRatio, borderRadius: 3,}]} onPress={this.getSMAuthCode} >
					    		<Text>获取验证码</Text>
					    	</TouchableOpacity>
						</View>
					</View>
					<TouchableOpacity 
						style={[Global.styles.CENTER, Global.styles.BLUE_BTN , {marginTop: 20}]} 
						onPress={()=>{this.saveAccount()}}>
			    		<Text style={{color: '#ffffff',}}>下一步</Text>
			    	</TouchableOpacity>
					
					<View style={styles.placeholder} />			
				</ScrollView>
				<View style={[Global.styles.TOOL_BAR.BAR, styles.steps]}>
					<View style={[Global.styles.CENTER, styles.stepFlex]} ><View style={[styles.step]} ><Text style={styles.stepText} >1</Text></View></View>
					<View style={[Global.styles.CENTER, styles.stepFlex]} ><View style={[styles.step]} ><Text style={[styles.stepText]} >2</Text></View></View>
					<View style={[Global.styles.CENTER, styles.stepFlex]} ><View style={[styles.step,styles.activeStep]} ><Text style={[styles.stepText]} >3</Text></View></View>
					<View style={[Global.styles.CENTER, styles.stepFlex]} ><View style={[styles.step]} ><Text style={[styles.stepText]} >4</Text></View></View>
				</View>
				<NavBar 
					title='绑定银行卡' 
					navigator={this.props.navigator} 
					route={this.props.route} 
					hideBottomLine={true}
					hideBackText={false}
					backText='上一步' />
			</View>
		)
	},
	_renderPlaceholderView: function() {
		return (
			<View>
				<NavBar 
					title='绑定银行卡' 
					navigator={this.props.navigator} 
					route={this.props.route} 
					hideBottomLine={true}
					hideBackText={false}
					backText='上一步' />
			</View>
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
		height: Global.NBPadding+64,
	},
	sv: {
		paddingLeft: 20,
		paddingRight: 20,
	},
	placeholder: {
        flex: 1,
        height: 20,
    },
	steps: {
    	flex: 1,
    	height: 43,
    	flexDirection: 'row',
    },
    stepFlex: {
    	flex: 1,
    	backgroundColor: 'transparent',
    },
    step: {
    	width: 24,
    	height: 24,
    	borderRadius: 12,
    	backgroundColor: Global.colors.IOS_DARK_GRAY,
    	overflow: 'hidden',
    },
    activeStep: {
    	backgroundColor: Global.colors.IOS_GREEN,
    },
    stepText: {
    	flex: 1,
    	fontSize: 16,
    	color: '#ffffff',
    	textAlign: 'center',
    	lineHeight: 21,
    },
	inputBlock:{
		flex:1,
		//padding:5,
		//width:Dimensions.get('window').width,
		//backgroundColor: '#FFFFFF',
		//height:100,
	},
	textInput:{
		height:40,
		fontSize:13,
		borderColor: 'gray', 
		borderWidth: 1,
		borderRadius:3,
		marginTop:5,
		backgroundColor: '#FFFFFF',
	},
});

module.exports = BindBanksCard3;