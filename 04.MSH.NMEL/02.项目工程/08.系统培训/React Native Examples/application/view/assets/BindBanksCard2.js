'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Global = require('../../Global');
var Icon = require('react-native-vector-icons/Ionicons');
var BindBanksCard3 = require('./BindBanksCard3');
var t = require('tcomb-form-native');
var tStyles = require('../lib/TcombStylesThin');
var TcombBool = require('../lib/TcombBool');

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


var Form = t.form.Form;
t.form.Form.stylesheet = tStyles;

var BindBanksCard2 = React.createClass({

	getInitialState:function(){
		return {
			value: {
				// cardType:" 北京银行   储蓄卡",
				cardType:this.props.cardInfo.bankName+'     '+this.props.cardInfo.cardTypeName,
				mobile:Global.USER_LOGIN_INFO.mobile,
			},
			options: this._getFormOptions(),
		}
	},
	componentDidMount: function() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({
				doRenderScene: true,
			});
		});
	},
	personInfo:function(){
		return  t.struct({
			cardType: t.String,
			mobile: t.Number,
			agreement: t.Boolean,
		})
	},
	_getAgreementLabelComponent: function() {
		return (
			<View style={styles.agreementContainer} >
				<Text style={{width: 30,}} >同意</Text>
				<TouchableOpacity style={{flex: 1,}} onPress={this.checkAgreement} >
					<Text style={styles.href} >《服务协议》</Text>
				</TouchableOpacity>
			</View>
		);
	},

	_getFormOptions: function() {
		return {
			fields: {
				cardType: {
					label: '卡类型',
					maxLength: 50,
					//help: '请填写真实姓名，须与身份证一致',
					//error: '姓名必须填写且长度不能超过50个字符',
					editable:false
				},
				mobile: {
					label: '手机号',
					maxLength: 11,
					error: '手机号必填',
				},
				agreement: {
					labelComponent: this._getAgreementLabelComponent(),
					factory: TcombBool,
					labelPos: 'tail',
				},

			}
		}

	},
	onFormChange: function(value, objName) {
		this.setState({value: value});
	},
	next:function(){
		var value = this.refs.form.getValue();
		if(value){
			this.props.navigator.push({
				title: "绑定银行卡",
		        component: BindBanksCard3,
            	hideNavBar: true,
		        passProps: {
	            	acctNo: this.props.acctNo,
	            	name:this.props.name,
	            	pid:this.props.pid,
	            	mobile:value.mobile,
	            	bankName:this.props.cardInfo.bankName,
	            	type:this.props.cardInfo.cardType,
	            	// refreshBankList:this.props.refreshBankList,
	            	backRoute: this.props.backRoute,
	            },
			});
		}
	},
	render: function() {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();
		var btnStyle = this.state.value.agreement === true ? Global.styles.BLUE_BTN : Global.styles.GRAY_BTN;
		var btnPress = this.state.value.agreement === true ? this.next : null;
		return(
			<View style={styles.container}>
				<ScrollView style={styles.sv}>
                	<View style={styles.paddingPlace} />
					<Form
						ref="form" 
						type={this.personInfo()} 
						value={this.state.value} 
						options={this.state.options} 
						onChange={this.onFormChange} />
					<TouchableOpacity 
						style={[Global.styles.CENTER, Global.styles.BLUE_BTN ,btnStyle, {marginTop: 20}]} 
						onPress={btnPress}>
			    		<Text style={{color: '#ffffff',}}>下一步</Text>
			    	</TouchableOpacity>
					<View style={styles.placeholder} />

				</ScrollView>
				 <View style={[Global.styles.TOOL_BAR.BAR, styles.steps]}>
					<View style={[Global.styles.CENTER, styles.stepFlex]} ><View style={[styles.step]} ><Text style={styles.stepText} >1</Text></View></View>
					<View style={[Global.styles.CENTER, styles.stepFlex]} ><View style={[styles.step,styles.activeStep]} ><Text style={[styles.stepText]} >2</Text></View></View>
					<View style={[Global.styles.CENTER, styles.stepFlex]} ><View style={[styles.step]} ><Text style={[styles.stepText]} >3</Text></View></View>
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
    agreementContainer: {
    	flexDirection: 'row',
    },
	href: {
		color: Global.colors.IOS_BLUE,
	},

});
module.exports = BindBanksCard2;