'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Global = require('../../Global');
var Icon = require('react-native-vector-icons/Ionicons');
var BindBanksCard2 = require('./BindBanksCard2');
var UtilsMixin = require('../lib/UtilsMixin');
var AccountMixin = require('../AccountMixin');
var TimerMixin = require('react-timer-mixin');
var t = require('tcomb-form-native');
var tStyles = require('../lib/TcombStylesThin');

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
	TextInput,
	Alert,
} = React;

var SAVE_URL = 'person/updateName';

var Form = t.form.Form;
t.form.Form.stylesheet = tStyles;

var BindBanksCard = React.createClass({
	mixins:[UtilsMixin,TimerMixin,AccountMixin],
	getInitialState:function(){
		return {
			value: {
				name:Global.USER_LOGIN_INFO.name,
				acctNo:null,
			},
			cardInfo:null,
			doRenderScene:false,
			options: this._getFormOptions(),
		}
	},
	personInfo:function(){
		return  t.struct({
			name: t.String,
			acctNo: t.Number,
		})
	},
	_getFormOptions: function() {
		return {
			fields: {
				name: {
					label: '姓名',
					maxLength: 50,
					help: '请填写真实姓名，须与身份证一致',
					error: '姓名必须填写且长度不能超过50个字符',
				},
				acctNo: {
					label: '卡号',
					maxLength: 19,
					error: '卡号必填',
				},
			}
		}

	},
	componentDidMount:function(){
		InteractionManager.runAfterInteractions(() => {
			this.setState({
				doRenderScene: true,
			});
		});
	},
	saveUser: async function(){
		var value = this.refs.form.getValue();
		this.setState({
			name: value.name,
			acctNo: value.acctNo,
			pid:Global.USER_LOGIN_INFO.id,
		});
		if(value){
			this.showLoading();
			try {
				let responseData = await this.request(Global.host + SAVE_URL, {
					body: JSON.stringify({
						id: Global.USER_LOGIN_INFO.id,
						name: this.state.name,
					}),
				});
				this.hideLoading();
				var updateInfo =  {
					name:this.state.value.name
				};
				await this.updateUserInfo(updateInfo);
				this.next();
			} catch(e) {
				this.requestCatch(e);
			}
		}
	},
	next:function(){
		console.log("next**********");
		if(!this.state.cardInfo){
			Alert.alert('提示','不支持此银行卡');
			return;
		}
		this.props.navigator.push({
			title: "绑定银行卡",
	        component: BindBanksCard2,
            hideNavBar: true,
	        passProps: {
	        	name:this.state.value.name,
	        	acctNo:this.state.value.acctNo,
	        	pid:Global.USER_LOGIN_INFO.id,
	        	cardInfo:this.state.cardInfo,
				// refreshBankList:this.props.refreshBankList,
            	backRoute: this.props.backRoute,
	        }
		});
	},
	onFormChange: function(value, objName) {
		// console.log(JSON.stringify(value)+'---'+value.acctNo+'--'+objName);
		if(objName=='acctNo'&&value.acctNo.length==6){
			let cardInfo=this.checkBankCardInfo(value.acctNo);
			if(cardInfo!=null){
				this.setState({cardInfo:cardInfo});
			}else{
				if(value.acctNo.length>=6)
					Alert.alert('提示','不支持此银行卡');
			}
		}
		this.setState({value: value});
	},
	render:function(){
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();
		return(
			<View style={styles.container}>
				<ScrollView style={styles.sv} >
                    <View style={styles.paddingPlace} />
					<Form
						ref="form" 
						type={this.personInfo()} 
						value={this.state.value} 
						options={this.state.options} 
						onChange={this.onFormChange} />

			    	<TouchableOpacity 
						style={[Global.styles.CENTER, Global.styles.BLUE_BTN , {marginTop: 20}]} 
						onPress={()=>{this.saveUser()}}>
			    		<Text style={{color: '#ffffff',}}>下一步</Text>
			    	</TouchableOpacity>
					<View style={styles.placeholder} />
				</ScrollView>
				 <View style={[Global.styles.TOOL_BAR.BAR, styles.steps]}>
					<View style={[Global.styles.CENTER, styles.stepFlex]} ><View style={[styles.step, styles.activeStep]} ><Text style={styles.stepText} >1</Text></View></View>
					<View style={[Global.styles.CENTER, styles.stepFlex]} ><View style={[styles.step]} ><Text style={[styles.stepText]} >2</Text></View></View>
					<View style={[Global.styles.CENTER, styles.stepFlex]} ><View style={[styles.step]} ><Text style={[styles.stepText]} >3</Text></View></View>
					<View style={[Global.styles.CENTER, styles.stepFlex]} ><View style={[styles.step]} ><Text style={[styles.stepText]} >4</Text></View></View>
				</View>
				<NavBar 
					title='绑定银行卡' 
					navigator={this.props.navigator} 
					route={this.props.route} 
					hideBottomLine={true} />
			</View>
		);
	},
	_renderPlaceholderView: function() {
		return (
			<View>
				<NavBar 
					title='绑定银行卡' 
					navigator={this.props.navigator} 
					route={this.props.route} 
					hideBottomLine={true} />
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
	
});

module.exports = BindBanksCard;