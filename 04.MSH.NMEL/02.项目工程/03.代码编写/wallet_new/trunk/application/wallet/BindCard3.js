'use strict';
/**
 * 绑定卡 第三步 输入验证码
 */
import React, {
    Component,
    PropTypes,
} from 'react';

import {
    View,
    ScrollView,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    StyleSheet,
	InteractionManager,
} from 'react-native';

import * as Global  from '../Global';
import UserStore	from '../flux/UserStore';
import Form 		from '../lib/form/EasyForm';
import FormConfig 	from '../lib/form/config/DefaultConfig';

import NavBar       from '../store/common/TopNavBar';
import Button       from 'rn-easy-button';
import Separator    from 'rn-easy-separator';

import Card			from './Card';
import BindStep		from './BindStep';
import BindCard4	from './BindCard4';

class BindCard3 extends Component {

    static displayName = 'BindCard3';
    static description = '绑定卡输入验证码';

    form = null;
    _timer = null;
    _clockTimer = null;

    static propTypes = {
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,
		bankCards: this.props.bankCards,
		data: null,
		showLabel: true,
		labelPosition: 'left',
		second: 30,
		user: UserStore.getUser(),
		value: {
		},
	};

    constructor (props) {
        super(props);
        this.sendAuthSM 	= this.sendAuthSM.bind(this);
        this.onChange 		= this.onChange.bind(this);
        this.setClock 		= this.setClock.bind(this);
        this.submit 		= this.submit.bind(this);
    }

	componentDidMount () {
		InteractionManager.runAfterInteractions(() => {
			this.setState({
				doRenderScene: true,
			});
		});
		this.sendAuthSM();
	}
	
	componentWillUnmount () {
		clearTimeout(this._timer);
		clearTimeout(this._clockTimer);
	}

	onChange (fieldName, fieldValue, formValue) {
		this.setState({value: formValue});
	}

	_formatMobile(mobile) {
		return mobile.substring(0,3)+" **** "+mobile.substring(7,mobile.length);
	}

	setClock () {
		if(this.state.second == 0) {
			this.setState({second: 30});
			return;
		}
		let second = this.state.second ? this.state.second - 1 : 30;
		this._clockTimer = setTimeout(
			() => {
				this.setState({second: second});
				this.setClock();
			},
			1000
		);
	}

	sendAuthSM () {
		console.log('in send auth sm');
		this.setState({buttonDisabled: true}, () => {
			this.setClock();
			this._timer = setTimeout(
				() => {
					this.setState({buttonDisabled: false});
				},
				30000
			);
		});
	}

	render () {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();
		return (
			<View style = {Global._styles.CONTAINER} >
				{this._getNavBar()}
				<BindStep num="3"/>
				<ScrollView automaticallyAdjustContentInsets = {false} keyboardShouldPersistTaps = {true} style = {styles.scrollView} >
					<Text style={styles.textTitle }>请输入手机 {this._formatMobile(this.props.mobile)} 收到的短信验证码：</Text>
				    <Form ref = {(c) => this.form = c} config = {FormConfig} showLabel = {this.state.showLabel} labelPosition = {this.state.labelPosition}
						labelWidth = {70} onChange = {this.onChange} value = {this.state.value} >
						<Form.TextInput name = "authCode" label = "验证码"  placeholder = "请输入短信验证码" 
							required = {true} dataType = "number" maxLength = {6} minLength = {6} textAlign = "center" 
							buttonText = {"点击免费" + "\n" + "获取验证码"} autoFocus={true}   buttonOnPress = {this.sendAuthSM} 
							buttonDisabled = {this.state.buttonDisabled} buttonDisabledText = {this.state.second + "秒钟后可" + "\n" + "再次发送"} 
							help = "请输入验证短信中的6位验证码" 
						/>
					</Form>
					<View style = {{flexDirection: 'row', margin: 10, marginTop: 20, marginBottom: 40}} >
						<Button text = "下一步" disabled = {this.state.disabled} onPress={() => this.submit()}/>
					</View>
				</ScrollView>
			</View>
		);
	}
	_getNavBar () {
		return (
			<NavBar 
				title = '验证码'
				// centerComponent = {(
				// 	<BindStep num="3"/>
				// )} 
				navigator = {this.props.navigator} 
				route = {this.props.route} 
				hideBottomLine = {false} 
				rightButtons = {(
					<View style = {{width:1,}}>
						
					</View>
				)} 
			/>
		);
	}

	_renderPlaceholderView () {
		return (
			<View style = {Global._styles.CONTAINER}>
			</View>
		);
	}
	/**
	* 提交并认证短信验证码后保存
	**/
	async submit () {
		if (!this.form.validate()) {
			return;
		}
		//需要添加短信验证通过后才可执行以下操作
        let FIND_URL = 'el/bankCards/submitInfo/';
        try {
	        let responseData = await this.request(Global._host + FIND_URL,{
	        	method: 'POST',
                body: JSON.stringify({
		            	bankCards: this.props.bankCards,
		            	authCode: this.state.value.authCode,
                })
            });

            if(responseData.success){
            	console.log('11111111111111111111111111111');
            	//如果第一次绑卡，需要完善实名认证信息

            	//需要重新装载我的卡列表页面
            	this.updateUserData(responseData.result);
            	//跳转绑卡成功页面
				this.props.navigator.push({
					component: BindCard4, 
					hideNavBar: true, 
		            passProps: {
		            	bankCards: responseData.result,
		            },
		        });
            }
        } catch(e) {
            this.handleRequestException(e);
        }
	}

	/**
	* 刷新我的卡列表数据
	**/
	async updateUserData(bankCard) {
		let user = UserStore.getUser();
		console.log('updateUserData1111111111111111111user');
		console.log(user);
		if(!user.personId || ""==user.personId){
			user.personId = bankCard.personId;
			user.idCardNo = bankCard.idCardNo;
			user.name = bankCard.cardHolder;
			
			UserStore.onUpdateUser(user);
		}

        let FIND_URL = 'el/bankCards/list';
        let data = encodeURI(JSON.stringify({
            	personId: bankCard.personId,
        }));
        try {
	        let responseData = await this.request(Global._host + FIND_URL + '?data=' + data,{
	        	method:'GET',
            });
            UserStore.onUpdateBankCards(responseData.result);
        } catch(e) {
            this.handleRequestException(e);
        }
	}

}

const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
		// backgroundColor: '#ffffff',
		marginBottom: Global._os == 'ios' ? 48 : 0,
	},
	textTitle: {
		flex:1,
		fontSize: 14,
		justifyContent: 'center',
		color:Global.FONT,
		marginLeft: 10,
		marginRight: 10,
		marginTop: 10,
		marginBottom: 10,
	},
	icon: {
		textAlign: 'center',
		width: 40,
		right: 0,
		top: 10,
	},
});

export default BindCard3;

