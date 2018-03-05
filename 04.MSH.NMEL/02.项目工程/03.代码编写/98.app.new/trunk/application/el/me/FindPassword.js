'use strict';
/**
 * 用户登录
 */
import React, {
    Component,

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

import PropTypes from 'prop-types';
import * as Global  	from '../../Global';
import RSAUtils       	from '../../utils/RSAUtils';
import Form 			from '../../lib/form/EasyForm';
import FormConfig 		from '../../lib/form/config/DefaultConfig';

import NavBar       	from 'rn-easy-navbar';
import Button       	from 'rn-easy-button';
import Separator    	from 'rn-easy-separator';

const FIND_URL 		= 'el/user/getPassword';

export default class FindPassword extends Component {

    static displayName = 'FindPassword';
    static description = '找回密码';

    form = null;
    sh = 0 ;

    static propTypes = {
    	/*
    	** 登陆手机号码
    	*/
        mobile: PropTypes.string.isRequired,
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,
		value: {},
		buttonState: false,
	};

    constructor (props) {
        super(props);
        this.getPassword 	= this.getPassword.bind(this);
        this.onChange 		= this.onChange.bind(this);
        this.getPasswordCheck 		= this.getPasswordCheck.bind(this);
    }

    componentDidMount () {

		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		});
  	}

	async getPasswordCheck () {

		this.form.validate();
		if( this.state.value.password != this.state.value.password2  || !this.form.validate()){
				Alert.alert(
					'提示',
					'两次输入登陆密码不正确，请确认后再次输入！',
					[
					 	{
					 		text: '确定', onPress: ()=>{ 
					 			this.setState({
					 				value: {},
									buttonState: false,
					 			});
					 		}
					 	}
					]
				);
		}else{
			this.getPassword();
		}
		
	}
	async getPassword(){
		this.setState({
			buttonState: true,
		});
		try {
			this.showLoading();
			
			let random 		    = await AsyncStorage.getItem(Global._ASK_USER_RANDOM);
			let modulus1 		= await AsyncStorage.getItem(Global._ASK_USER_MODULUS1);
			let exponent1 		= await AsyncStorage.getItem(Global._ASK_USER_EXPONENT1);
			var encPsswd = RSAUtils.RSAUtils.encryptedPassword(random,this.state.value.password,modulus1, exponent1);
			
			let responseData = await this.request(Global._host + FIND_URL, {
				body: JSON.stringify({
					mobile: this.props.mobile,
					encPsswd: encPsswd,
				}),
			});
			this.hideLoading();
			// console.log(responseData);
			console.log(" findPassword seccess ");
			this.toast("成功！");
			this.props.navigator.popToTop();

		} catch(e) {
			this.hideLoading();
			this.setState({value: null,buttonState: false,});
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
					<Form ref = {(c) => this.form = c} onChange = {this.onChange} value = {this.state.value} showLabel = {false} config={ FormConfig}>
						<Form.TextInput name = "password" label="登陆密码" placeholder = "请输入新登陆密码，6-16字母或数字！" password = {true}  maxLength = {16} minLength = {6} required = {true} icon = "md-lock" />
						<Form.TextInput name = "password2" label="再次输入登陆密码" placeholder = "请再次输入新登陆密码，6-16字母或数字！" password = {true}  maxLength = {16} minLength = {6} required = {true} icon = "md-lock" />
					</Form>
					<Separator height = {20} />
			    	<View style = {{ marginLeft: 20,marginRight: 20}} >
				    	<Button text = "确定" onPress = {this.getPasswordCheck} theme = {Button.THEME.ORANGE} disable={this.state.buttonState}/>
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
			<NavBar title = "找回密码" 
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
