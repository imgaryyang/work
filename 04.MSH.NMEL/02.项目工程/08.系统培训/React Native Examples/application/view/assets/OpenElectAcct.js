'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Global = require('../../Global');
var Icon = require('react-native-vector-icons/Ionicons');
var OpenElectAcct2 = require('./OpenElectAcct2');
var TcombBool = require('../lib/TcombBool');
var Switcher = require('../lib/Switcher');

var t = require('tcomb-form-native');
var tStyles = require('../lib/TcombStylesThin');
var UtilsMixin = require('../lib/UtilsMixin');

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
	Alert,
	AsyncStorage,
} = React;

var Form = t.form.Form;
t.form.Form.stylesheet = tStyles;

var UPDATE_URL = 'person/updateUserInfo';

var OpenElecAcct = React.createClass({
	
	mixins: [UtilsMixin],


	_getBaseInfo: function() {
		return  t.struct({
			name: t.String,
			idCard: t.String,
			mobile: t.Number,
			agreement1: t.Boolean,
		})
	},

	_getAgreementLabelComponent: function() {
		return (
			<View style={styles.agreementContainer} >
				<Text style={{width: 30,}} >同意</Text>
				<TouchableOpacity style={{flex: 1,}} onPress={this.checkAgreement} >
					<Text style={styles.href} >《电子账户服务协议》</Text>
				</TouchableOpacity>
			</View>
		);
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
				idCard: {
					label: '身份证号',
					maxLength: 18,
					error: '身份证号必须填写',
				},
				mobile: {
					label: '手机号',
					maxLength: 11,
					minLength: 11,
					error: '手机号必须填写且长度为11位',
				},
				/*mail: {
					label: '电子邮箱',
					maxLength: 50,
					error: '电子邮箱长度不能超过50个字符',
				},*/
				/*password: {
					label: '密码',
					maxLength: 20,
					minLength: 8,
					error: '密码必须填写，且最短为8位，最长不超过20位',
				},
				confirmPassword: {
					label: '再次输入密码',
					maxLength: 20,
					minLength: 8,
					error: '密码必须填写，且最短为8位，最长不超过20位',
				},
				authCode: {
					label: '短信验证码',
					maxLength: 6,
					minLength: 6,
					error: '请填写6位短信验证码',
				},*/
				agreement1: {
					labelComponent: this._getAgreementLabelComponent(),
					factory: TcombBool,
					labelPos: 'tail',
				},
			}
		}
	},

	getInitialState: function() {
		//console.log(Global.USER_LOGIN_INFO);
		return {
			showLoading: false,
			options: this._getFormOptions(),
			value: {
				mobile: Global.USER_LOGIN_INFO.mobile,
				name:Global.USER_LOGIN_INFO.name,
				idCard:Global.USER_LOGIN_INFO.idCard,
			},
		}
	},

    componentDidMount: function() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		});
	},

	checkAgreement: function() {
		console.log('in checkAgreement...');
	},

	save: async function() {

		var value = this.refs.form.getValue();
		if(value) {
			
			this.showLoading();

			try {
				let responseData = await this.request(Global.host + UPDATE_URL, {
					body: JSON.stringify(this.state.value)
				});
				
				this.hideLoading();
				
				await this.updateUserInfo({
					name: value.name,
					idCard: value.idCard,
					mobile: value.mobile,
				});

				this.next();

			} catch(e) {
				this.requestCatch(e);
			}
	 	}
	},

	next:function() {
		console.log('in next function................');
		this.props.navigator.push({
			title: "开户",
	        component: OpenElectAcct2,
	        passProps: {
            	value: this.state.value,
            	// refresh: this.props.refresh,
            },
            hideNavBar: true,
		});
	},

	onFormChange: function(value, objName) {
		this.setState({value: value});
	},

	render:function() {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		var btnStyle = this.state.value.agreement1 === true ? Global.styles.BLUE_BTN : Global.styles.GRAY_BTN;
		var btnPress = this.state.value.agreement1 === true ? this.save : null;

		return(
			<View style={styles.container}>
				<ScrollView style={styles.sv} >
                    <View style={styles.paddingPlace} />
					<Form
						ref="form" 
						type={this._getBaseInfo()} 
						value={this.state.value} 
						options={this.state.options} 
						onChange={this.onFormChange} />

			    	<TouchableOpacity 
						style={[Global.styles.CENTER, btnStyle, {marginTop: 10}]} 
						onPress={btnPress}>
			    		<Text style={{color: '#ffffff',}}>下一步</Text>
			    	</TouchableOpacity>

                    <View style={styles.placeholder} />
				</ScrollView>

				<View style={[Global.styles.TOOL_BAR.BAR, styles.steps]}>
					<View style={[Global.styles.CENTER, styles.stepFlex]} ><View style={[styles.step, styles.activeStep]} ><Text style={styles.stepText} >1</Text></View></View>
					<View style={[Global.styles.CENTER, styles.stepFlex]} ><View style={[styles.step]} ><Text style={[styles.stepText]} >2</Text></View></View>
					<View style={[Global.styles.CENTER, styles.stepFlex]} ><View style={[styles.step]} ><Text style={[styles.stepText]} >3</Text></View></View>
					{/*<View style={[Global.styles.CENTER, styles.stepFlex]} ><View style={[styles.step]} ><Text style={[styles.stepText]} >4</Text></View></View>*/}
				</View>

				<NavBar 
					title='填写基础信息' 
					rootNavigator={this.props.rootNavigator} 
					navigator={this.props.navigator} 
					hideBackButton={false} 
					route={this.props.route} 
					hideBottomLine={true} />
			</View>
			);
	},

	_renderPlaceholderView: function() {
		return (
			<View>
				<NavBar 
					title='填写基础信息' 
					rootNavigator={this.props.rootNavigator} 
					route={this.props.route} 
					navigator={this.props.navigator} 
					hideBackButton={false} />
			</View>
		);
	},
});

var styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ffffff',
	},
	sv: {
		paddingLeft: 20,
		paddingRight: 20,
	},
    paddingPlace: {
        flex: 1,
        height: Global.NBPadding + 64,
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

module.exports = OpenElecAcct;
