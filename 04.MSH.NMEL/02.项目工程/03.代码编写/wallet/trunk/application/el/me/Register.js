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
import FormConfig 		from '../../lib/form/config/DefaultConfig';
import Form 			from '../../lib/form/EasyForm';

import Button       	from 'rn-easy-button';
import Separator    	from 'rn-easy-separator';
import NavBar       	from 'rn-easy-navbar';

const REGISTER_URL 	= 'el/user/register';
const BANKS_URL 	= 'el/user/getBankCards';

export default class Register extends Component {

    static displayName = 'Register';
    static description = '注册';

    form = null;

    static propTypes = {
    	/*
    	** 登陆手机号码
    	*/
        mobile: PropTypes.string.isRequired
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,
		userInfo: null,
		bankCards: null,
		value: {
		},
	};

    constructor (props) {
    	console.log("Register!!!!!!!");
        super(props);
        this.registerCheck 		= this.registerCheck.bind(this);
        this.register 		= this.register.bind(this);
        this.onChange 		= this.onChange.bind(this);
    }

    componentDidMount () {
    	
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		});
  	}

	/**
	 * 注册
	 */
	registerCheck(){
		if(!this.form.validate()){
			Alert.alert(
					'错误',
					'输入登陆密码不满足格式要求，请输入6-16字母或数字!',
					[
					 	{
					 		text: '确定', onPress: () => {
					 			this.setState({value: {},});
					 		}
					 	}
					]
				);
		}else if(this.state.value.password!=this.state.value.password2){
			Alert.alert(
					'错误',
					'两次输入登陆密码不匹配,请重新输入!',
					[
					 	{
					 		text: '确定', onPress: () => {
					 			this.setState({value: {},});
					 		}
					 	}
					]
				);
		}else{
			this.register();
		}
	}
	async register () {
		
		try {
			this.showLoading();
			
			let random 		    = await AsyncStorage.getItem(Global._ASK_USER_RANDOM);
			let modulus1 		= await AsyncStorage.getItem(Global._ASK_USER_MODULUS1);
			let exponent1 		= await AsyncStorage.getItem(Global._ASK_USER_EXPONENT1);
			let encPsswd = RSAUtils.RSAUtils.encryptedPassword(random,this.state.value.password,modulus1, exponent1);
			
			let responseData = await this.request(Global._host + REGISTER_URL, {
				body: JSON.stringify({
					mobile: this.props.mobile,
					encPsswd: encPsswd,
					appId: '8a8c7db154ebe90c0154ebfdd1270004'
				})
			});
			
			this.hideLoading();
			this.state.userInfo = responseData.result;
			UserAction.login(this.state.userInfo,this.state.bankCards);
			this.toast('注册成功！');
			AuthAction.continuePush();
			this.props.navigator.popToTop();
			
		} catch(e) {
			this.hideLoading();
			console.log("login catch");
            this.handleRequestException(e);
		}
		
	}
	// /**
	// *获取用户卡信息
	// */
	// async getBanksInfo() {
	// 	try {
	// 		this.showLoading();
	// 		let responseData1 = await this.request(Global._host + BANKS_URL, {
	// 			body: JSON.stringify(this.state.value),
	// 		});
	// 		this.hideLoading();
	// 		// console.log(responseData);
	// 		if (responseData1.success == false) {
	// 			Alert.alert(
	// 				'提示',
	// 				responseData.msg ,
	// 				[
	// 				 	{
	// 				 		text: '确定', onPress: () => {
	// 				 			this.setState({bankCards: null,});
	// 				 		}
	// 				 	}
	// 				]
	// 			);
	// 		} else {
	// 			this.toast('注册成功！');
	// 			this.state.bankCards = responseData1.result;
	// 			UserAction.login(this.state.userInfo,this.state.bankCards);
	// 			//继续跳转到被阻断的场景路由
	// 			AuthAction.continuePush();
	// 			this.props.navigator.popToTop();

	// 		}

	// 	} catch(e) {
	// 		console.log(e);
	// 		this.toast(e);
 //            this.handleRequestException(e);
	// 	}
	// }
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
					<Form ref = {(c) => this.form = c} onChange = {this.onChange} value = {this.state.value} showLabel = {false} config={ FormConfig}>
						<Form.TextInput name = "password" label="登陆密码" placeholder = "请输入登陆密码，6-16字母或数字！" password = {true} autoFocus={true}  maxLength = {16} minLength = {6} required = {true} icon = "md-lock" />
						<Form.TextInput name = "password2"  label="再次输入登陆密码" placeholder = "请再次输入登陆密码，6-16字母或数字！" password = {true}  maxLength = {16} minLength = {6} required = {true} icon = "md-lock" />
					</Form>
					<Separator height = {20} />
			    	<View style = {{ marginLeft: 20,marginRight: 20}} >
				    	<Button text = "注册" onPress = {this.registerCheck} theme = {Button.THEME.ORANGE} />
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
			<NavBar title = '输入登录密码' 
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


