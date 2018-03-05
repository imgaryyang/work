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
	Dimensions,
} from 'react-native';

import * as Global  	from '../Global';
import UserAction 		from '../flux/UserAction';
import FormConfig 		from '../lib/form/config/DefaultConfig';
import Form 			from '../lib/form/EasyForm';

import NavBar       	from 'rn-easy-navbar';
import Icon 			from 'rn-easy-icon';
import Button       	from 'rn-easy-button';
import Separator    	from 'rn-easy-separator';

const LOGIN_URL = 'el/user/login';
const BANKS_URL = 'el/user/getBankCards';
const FIND_URL = 'el/user/changeMobile';
const GENCHECKCODE_URL = 'el/user/genCheckCode';
const VERCHECKCODE_URL = 'el/user/verifyCheckCode';

export default class CheckAuthCode extends Component {

    static displayName = 'CheckAuthCode';
    static description = '手机验证码校验';

    form = null;
    sh = 0 ;

    static propTypes = {
    	userInfo: PropTypes.object,
    	/**
         * 短信验证之后调用的Component
         */
    	nextComponent: PropTypes.func,

    	/**
         * Component的参数
         */
    	nextPassProps: PropTypes.object,

    	/**
         * Component的titlet
         */
        nextTitle: PropTypes.string,
        /**
         * CheckAuthCode的titlet
         */
        title: PropTypes.string.isRequired,
        
        //true：需要校验该电话号码存在，false：需校验该电话号码不存在
        isMobileExist : PropTypes.bool.isRequired
    	
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,
		value: {mobile:this.props.userInfo?this.props.userInfo.mobile:null,},
		timer: null,
		second: 60,
		buttonState: false,
		isSendAnthCode: 0,
	};

    constructor (props) {
        super(props);
        this.checkAuthSM 		    = this.checkAuthSM.bind(this);
        this.check 		    = this.check.bind(this);
        this.onChange 		= this.onChange.bind(this);
        this.sendAuthSM		= this.sendAuthSM.bind(this);
        this.saveMobile		= this.saveMobile.bind(this);
        this.show			= this.show.bind(this);
        this.goPop			= this.goPop.bind(this);
        this.refresh	    = this.refresh.bind(this);
    }

    componentDidMount () {

		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		});
		if(this.state.second <= 0){
			// console.log("删除sh"+this.state.second );
         	clearInterval(this.sh);
         	this.setState({
				isSendAnthCode: 0 ,
				second: 60,
			});
		}
  	}
  	componentWillUnmount () {
        clearInterval(this.sh);
    }
    refresh (){
    	if(this.state.second >= 0){
			// console.log("删除sh"+this.state.second );
         	clearInterval(this.sh);
		}
    	this.setState({
		    value: {},
			timer: null,
			second: 60,
			buttonState: false,
			isSendAnthCode: 0,
    	})

    }
	/**
	 * 注册 校验手机验证码
	 */
	checkAuthSM (){
		if(this.state.isSendAnthCode == 0 || !this.form.validate()){
				Alert.alert(
					'提示',
					'操作不正确，请再次获取验证码！！！',
					[
					 	{
					 		text: '确定', onPress: ()=>{ this.setState({
					 				value: {mobile:this.props.userInfo?this.props.userInfo.mobile:null,},
									timer: null,
									second: 60,
									buttonState: false,
									isSendAnthCode: 0,
					 			});
					 		}
					 	}
					]
				);
		}else{
			
			this.check();
		}
	}
	async check () {
		// console.log("UUUUUUUUUUUUUUUU");
		// console.log(this.state.buttonState);
		this.setState({
				buttonState: true,
			});
		clearInterval(this.sh);
		try {
			let responseData = await this.request(Global._host + VERCHECKCODE_URL+"/"+this.state.value.mobile+"/"+this.state.value.authCode, {
				method: 'GET'
			});
			
			if (responseData.success == true) {
				
				await AsyncStorage.setItem(Global._ASK_USER_RANDOM, responseData.result.random);
				await AsyncStorage.setItem(Global._ASK_USER_MODULUS1, responseData.result.modulus1.trim());
				await AsyncStorage.setItem(Global._ASK_USER_EXPONENT1, responseData.result.exponent1.trim());
				await AsyncStorage.setItem(Global._ASK_USER_MODULUS2, responseData.result.modulus2.trim());
				await AsyncStorage.setItem(Global._ASK_USER_EXPONENT2, responseData.result.exponent2.trim());
				
				this.toast("验证成功！");

				//如果 是更改手机号码 则直接调用函数，否则进入下个组件
				if(this.props.nextComponent == null ){
					// console.log("%%%%%%%%%%%%%%%%%%%%4");
					this.saveMobile();
				}else{
					this.props.navigator.push({
						title: this.props.nextTitle,
						component: this.props.nextComponent,
						hideNavBar: true,
						passProps: {
							mobile: this.state.value.mobile,
							userInfo:this.props.userInfo,
							// backRoute: this.props.backRoute,
						},
					});
				}
			}else{
				this.toast("验证失败！");
			}
			
		} catch(e) {
			this.setState({
                    buttonState: false,
                });
			this.hideLoading();
            this.handleRequestException(e);
			//this.requestCatch(e);
		}
		
	}
	show (){
		//时间过去60秒之后 停止该函数
		if(this.state.second <= 0){
			// console.log("删除sh"+this.state.second );
         	clearInterval(this.sh);
         	this.setState({
				isSendAnthCode: 0 ,
				second: 60,
			});
		}
		this.setState({
			second: this.state.second -1 ,
		});
	}

	/*
	**发送验证码
	*/
	async sendAuthSM () {
		//TODO 验证手机号码
		var partern = /^1[34578][0-9]{9}$/;
		if(!partern.test(this.state.value.mobile)){
			Alert.alert(
							'错误',
							'电话号码格式不正确！！', 
							[
							 	{
							 		text: '确定', onPress: () => {this.setState({value: {mobile:this.props.userInfo?this.props.userInfo.mobile:null,},});}
							 	}
							]
						);
		}else if(this.state.isSendAnthCode != 0){
					Alert.alert(
							'提示',
							'验证码已发送！！！',
							[
							 	{
							 		text: '确定', 
							 	}
							]
						);
		}else{

			try {
			 	this.showLoading();
				let responseData = await this.request(Global._host + GENCHECKCODE_URL+"/"+this.state.value.mobile + "?isMobileExist=" + this.props.isMobileExist, {
					method: 'GET'
				});
				this.hideLoading();
				// console.log(responseData);
				this.toast(" 已发送验证码 ");
			 	if (this.state.isSendAnthCode == 0){
					this.setState({
						isSendAnthCode: 1,
						second: 60,
					});
						//show函数 每一秒调用一次
					this.sh=setInterval(this.show,1000);
					
			 	} else {
			 		Alert.alert(
						'提示',
						'验证码获取失败，请重新！',
						[
						 	{
						 		text: '确定', onPress: () => {
	                                this.setState({
	                                	value: {mobile:this.props.userInfo?this.props.userInfo.mobile:null,},
	                                	buttonState: false,
	                                });
	                            }
						 	}
						]
					);
			 	}
			 	
			} catch(e) {
			 	this.hideLoading();
	             this.handleRequestException(e);
			}
		}	
	}
	//修改手机号码
	async saveMobile () {
       
        this.setState({   buttonState: true,});
        this.showLoading();
        
        try {
            let responseData = await this.request(Global._host + FIND_URL, {
                body: JSON.stringify({
                    newMobile: this.state.value.mobile,
                })
            });
                // console.log(responseData);

            this.hideLoading();
            if (responseData.success == false) {
                Alert.alert(
                    '提示',
                    responseData.msg ,
                    [
                        {
                            text: '确定', onPress: () => {
                                this.setState({
                                	value: {mobile:this.props.userInfo?this.props.userInfo.mobile:null,},
                                	buttonState: false,
                                });
                            }
                        }
                    ]
                );
            } else {
                this.toast('修改成功！');
                UserAction.onUpdateUser(responseData.result);
                this.goPop();
            }

        } catch(e) {
            this.hideLoading();
            this.handleRequestException(e);
        }

    }
    goPop(){
        this.props.navigator.pop();

    }
	onChange (fieldName, fieldValue, formValue) {
		// console.log(this.state.value);
		this.setState({value: formValue});
	}
	
	render () {

		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();
		var authCodeMeg = this.state.isSendAnthCode == 1 ? "重新发送验" + "\n" + "证码" + this.state.second+"s" 
							: "点击免费" + "\n" + "获取验证码" ;  
		return(
			<View style = {[Global._styles.CONTAINER]} >
				{this._getNavBar()}
				<ScrollView style = {styles.scrollView} keyboardShouldPersistTaps = {true}>
					<Separator height = {20} />
					<Form ref = {(c) => this.form = c} onChange = {this.onChange} value = {this.state.value} showLabel = {false} config={ FormConfig}>
						<Form.TextInput name = "mobile" label="手机号" placeholder = "请输入手机号码" icon = "ios-phone-portrait" required = {true} dataType = "number" maxLength = {11} minLength = {6} textAlign = "left" 
							buttonText = {authCodeMeg} buttonDisabled = {this.state.isSendAnthCode==1? true : false }
							buttonOnPress = {()=>{this.sendAuthSM();}} 
							editable={ this.props.userInfo? false:true } />
						<Form.TextInput name = "authCode" label="验证码"  placeholder = "请输入短信验证码" maxLength = {6} minLength = {6}  dataType = "number" required = {true}icon = "ios-chatbubbles" />
					</Form>
					<Separator height = {20} />
			    	<View style = {{ marginLeft: 20,marginRight: 20}} >
				    	<Button text = "确定" onPress = {()=>{this.checkAuthSM();}} theme = {Button.THEME.ORANGE}  disabled= {this.state.buttonState}/>
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
			<NavBar title = {this.props.title} 
		    	navigator = {this.props.navigator} 
				route = {this.props.route} 
				/>
		);
	}
}

const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
	},
	logoHolder: {
		height: Dimensions.get('window').height / 4,
	},
	logo: {
		width: Dimensions.get('window').height / 4 * .5,
		height: Dimensions.get('window').height / 4 * .5,
		backgroundColor: 'transparent',
	},
	
});


