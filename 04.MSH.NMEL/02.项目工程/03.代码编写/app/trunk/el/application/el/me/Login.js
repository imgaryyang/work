'use strict';
/**
 * 用户登录
 */
import React, {
    Component,
    PropTypes,
} from 'react';

import {
	StyleSheet,
	ScrollView,
	View,
	Text,
	Image,
	TouchableOpacity,
	InteractionManager,
	AsyncStorage,
	Alert,
	TextInput,
} from 'react-native';
import * as Global  	from '../../Global';
import RSAUtils       	from '../../utils/RSAUtils';
import UserAction 		from '../../flux/UserAction';
import AuthAction 		from '../../flux/AuthAction';
import Form 			from '../../lib/form/EasyForm';
import FormConfig 		from '../../lib/form/config/DefaultConfig';

import NavBar       	from 'rn-easy-navbar';
import Button       	from 'rn-easy-button';
import Separator    	from 'rn-easy-separator';

import CheckAuthCode 	from './CheckAuthCode';
import FindPassword 	from './FindPassword';
import Register 		from './Register';

import JPush			from 'react-native-jpush';

const LOGIN_URL 		= 'el/user/login';
const PRE_LOGIN_URL 	= 'el/user/pre/';
const BANKS_URL 		= 'el/user/getBankCards';

export default class Login extends Component {

    static displayName = 'Login';
    static description = '用户登录';

    // l_mobile = null;
    // l_pwd = null;
    form = null;

    static propTypes = {
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,
		userInfo: null,
		bankCards: null,
		value: {},
		buttonState: false,
	};

    constructor (props) {
        super(props);

        this.register 		= this.register.bind(this);
        this.findPwd 		= this.findPwd.bind(this);
        this.login 			= this.login.bind(this);
        this.getBanksInfo 	= this.getBanksInfo.bind(this);
        this.onChange 		= this.onChange.bind(this);
        this.refresh 		= this.refresh.bind(this);
        this.jPushSetAliasAndTags 		= this.jPushSetAliasAndTags.bind(this);
    }

    componentDidMount () {

		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		});
  	}
  	componentWillUnmount () {
    }
  	refresh(){
  		this.form = null;
  		this.setState({
			value: {},
			buttonState: false,
  		});
  	}
  	/**
  	 * 跳转到注册场景
  	 */
  	register () {
		this.props.navigator.push({ 
			title: "注册",
			component: CheckAuthCode,
			hideNavBar: true,
			passProps: {
				isMobileChange: true,
				nextComponent: Register,
				nextPassProps: 'value.mobile',
				isMobileExist: false,
				nextTitle: '注册',
				title: "注册"
			}
		});
	}
	
  	/**
  	 * 跳转到找回密码场景
  	 */
  	findPwd () {
		this.props.navigator.push({ 
			title: "找回密码",
			component: CheckAuthCode,
			hideNavBar: true,
			passProps: {
				isMobileChange: true,
				nextComponent: FindPassword,
				nextPassProps: 'value.mobile',
				isMobileExist : true,
				nextTitle: '找回密码',
				title: "找回密码",
				router: null,
			},
		});
	}

	/**
	 * 推送,设置别名和标签
	 */
	jPushSetAliasAndTags() {
		let {id} = this.state.userInfo;
		JPush.setTags(['el','elh','elp','els'], id);
		console.log('设置别名和标签');
	}

	/**
	 * 登录
	 */
	async login () {

		if(this.form.validate()){
			try {
				this.setState({
					buttonState: true,
				});
				this.showLoading();
				let responseData = await this.request(Global._host + PRE_LOGIN_URL + "login", {
					method: 'GET'
				});
				let encPsswd = RSAUtils.RSAUtils.encryptedPassword(responseData.result.random, this.state.value.password, responseData.result.modulus1.trim(), responseData.result.exponent1.trim());
				responseData = await this.request(Global._host + LOGIN_URL, {
					body: JSON.stringify({
						mobile: this.state.value.mobile, 
						encpswd: encPsswd,
						appId: Global.Config['_ID']
					})
				});

				this.state.userInfo = responseData.result;
				console.log("login success!!!");
				UserAction.login(this.state.userInfo,this.state.bankCards);
				this.toast("登录成功！");
				this.getBanksInfo();
				this.hideLoading();
				this.setState({
					buttonState: false,
				});
				//设置别名和标签
				this.jPushSetAliasAndTags();
			} catch(e) {
				this.setState({
					buttonState: false,
				});
	            this.handleRequestException(e);
	        }
		}else{
			Alert.alert(
				'提示',
				'手机号码或登录密码格式不正确,请确认后重新输入!',
				[
				 	{
				 		text: '确定', onPress: () => {
				 			this.refresh();
				 		}
				 	}
				]
			);
		}
	}

	/**
	*获取用户卡信息
	*/
	async getBanksInfo() {
		try {
			this.showLoading();
			let responseData1 = await this.request(Global._host + BANKS_URL, {
				body: JSON.stringify(this.state.value),
			});
			this.hideLoading();
			
			this.state.bankCards = responseData1.result;
			UserAction.onUpdateBankCards(this.state.bankCards);
			//console.log("UserAction.login  finish!!!");
			//继续跳转到被阻断的场景路由
			this.props.navigator.popToTop();
			AuthAction.continuePush();
		} catch(e) {
			console.log(e);
            this.handleRequestException(e);
		}
	}

	onChange (fieldName, fieldValue, formValue) {
		// console.log(this.state.value);
		this.setState({value: formValue});
	}
	
	render () {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		return(
			<View style = {[Global._styles.CONTAINER]} >
				{this._getNavBar()}
				<ScrollView style = {styles.scrollView} keyboardShouldPersistTaps = {true} >
					<Separator height = {20} />
					<View style = {[Global._styles.CENTER, styles.logoHolder]} >
						<Image source = {Global._logo['l']}resizeMode = 'contain' style = {styles.logo} />
					</View>
					<Form ref = {(c) => this.form = c} onChange = {this.onChange} value = {this.state.value} showLabel = {false}>
						<Form.TextInput label="登录手机号" name = "mobile" dataType = "mobile" placeholder = "请输入登录手机号"  autoFocus={true} required = {true} icon = "ios-phone-portrait" />
						<Form.TextInput label="登录密码" name = "password"  placeholder = "请输入登录密码" maxLength = {16} minLength = {6} password = {true} required = {true} icon = "md-lock" />
					</Form>
					
					<View style = {{flexDirection: 'row', marginTop: 20,marginLeft: 20,marginRight: 20}} >
				    	<Button text = "忘记密码？" onPress = {this.findPwd} />
				    	<Separator width = {20} />
				    	<Button text = "登录" onPress = {this.login} disabled = {this.state.buttonState}/>
			    	</View>

			    	<Text style = {[{flex: 1, textAlign: 'center', margin: 10, color: Global._colors.IOS_GRAY_FONT, fontSize: 12}]} >还未注册？点击“注册”按钮免费注册。</Text>
			    	<View style = {{ marginLeft: 20,marginRight: 20}} >
				    	<Button text = "注册" onPress = {this.register} theme = {Button.THEME.ORANGE} />
				    </View>
				</ScrollView>
			</View>
		);
	}

	_renderPlaceholderView () {
		return (
			<View style = {Global._styles.CONTAINER}>
			    {this._getNavBar()}
			</View>
		);
	}

	_getNavBar () {
		return (
			<NavBar title = '登录' 
		    	navigator = {this.props.navigator} 
				route = {this.props.route} />
		);
	}
}

const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
	},
	logoHolder: {
		height: Global.getScreen().height / 4,
	},
	logo: {
		width: Global.getScreen().height / 4 * .5,
		height: Global.getScreen().height / 4 * .5,
		backgroundColor: 'transparent',
	},
});


