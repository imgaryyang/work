'use strict';

import React, {
    Component,
    PropTypes,
} from 'react';

import {
    View,
    ScrollView,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
	InteractionManager,
	Alert,
} from 'react-native';

import * as Global  from '../../Global';
import Form 		from '../../lib/form/EasyForm';
import FormConfig 	from '../../lib/form/config/LineInputsConfig';

import NavBar       from 'rn-easy-navbar';
import Icon 		from 'rn-easy-icon';
import Button       from 'rn-easy-button';
import Separator    from 'rn-easy-separator';
import Card    		from 'rn-easy-card';

class LineInputsFormTest1 extends Component {

    static displayName = 'LineInputsFormTest1';
    static description = '组件';

    form = null;

    static propTypes = {
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,
		value: {
			name: 'Victor', 
			age: '99',
		},
		showLabel: true,
		labelPosition: 'left',
	};

    constructor (props) {
        super(props);

        this.clear 			= this.clear.bind(this);
        this.submit 		= this.submit.bind(this);
        this.sendAuthSM 	= this.sendAuthSM.bind(this);
        this.onChange 		= this.onChange.bind(this);
    }

	componentDidMount () {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		});
	}

	sendAuthSM () {
		console.log('in send auth sm');
	}

	clear () {
		this.setState({value: {}});
	}

	submit () {
		//console.log(this.state.value);
		if (this.form.validate()) {
			if(this.state.value.pwd != this.state.value.pwdConfirm) {
				this.form.pwdConfirm.showError('两次密码输入不一致');
				this.form.pwdConfirm.focus();
				return;
			}
			if(this.state.value.authCode != '999999') {
				Alert.alert('提示', '校验码不正确！', [
					 	{text: '确定', onPress: () => this.form.authCode.focus()}
					]
				);
				return;
			}
			this.toast('校验通过！');
		}
	}

	onChange (fieldName, fieldValue, formValue) {
		this.setState({value: formValue});
	}

	render () {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		return (
			<View style = {[Global._styles.CONTAINER]} >
				{this._getNavBar()}
			    {this._getToolBar()}
				<ScrollView style = {styles.scrollView} keyboardShouldPersistTaps = {true} >

					<Card radius = {7} style = {{margin: 20, padding: 10}} >

						<Form ref = {(c) => this.form = c} config = {FormConfig} showLabel = {this.state.showLabel} labelPosition = {this.state.labelPosition}
							labelWidth = {100} onChange = {this.onChange} value = {this.state.value} >

							{/*<View style = {styles.fieldSet} ><Text>基础信息</Text></View>*/}

							<Form.TextInput name = "name" label = "姓名" placeholder = "请输入姓名" required = {true} minLength = {5} maxLength = {20} icon = "md-person" />
							<Form.TextInput name = "alias" label = "昵称" placeholder = "请输入昵称" required = {true} minLength = {6} maxLength = {20} icon = "md-pricetags" />
							<Form.TextInput name = "age" label = "年龄" placeholder = "请输入年龄" dataType = "int" textAlign = "center" showAdjustButton = {true} icon = "logo-reddit" />
							<Form.TextInput name = "idNo" label = "身份证号" placeholder = "请输入身份证号" dataType = "cnIdNo" icon = "md-list-box" />
							<Form.TextInput name = "cardNo" label = "银行卡号" placeholder = "请输入银行卡号" dataType = "bankAcct" icon = "ios-card" />
							<Form.TextInput name = "gain" label = "月收入" placeholder = "请输入月收入" dataType = "amt" icon = "logo-usd" />

							{/*<View style = {styles.fieldSet} ><Text>安全信息</Text></View>*/}

							<Form.TextInput name = "pwd" label = "密码" placeholder = "请输入密码" password = {true} required = {true} icon = "md-lock" />
							<Form.TextInput name = "pwdConfirm" label = "再次输入密码" placeholder = "请重新输入密码进行验证" password = {true} required = {true} icon = "md-lock" />
							<Form.TextInput name = "email" label = "电子邮箱" placeholder = "请输入电子邮箱" dataType = "email" required = {true} icon = "ios-mail" />
							<Form.TextInput name = "mobile" label = "手机号" placeholder = "请输入手机号码" dataType = "mobile" required = {true} icon = "ios-phone-portrait" />
							<Form.TextInput name = "authCode" label = "验证码" placeholder = "请输入短信验证码" icon = "ios-chatbubbles" required = {true} dataType = "number" maxLength = {6} minLength = {6} textAlign = "center" 
								buttonText = {"点击免费" + "\n" + "获取验证码"} 
								buttonOnPress = {this.sendAuthSM} 
							/>
						</Form>

					</Card>

					<View style = {{flexDirection: 'row', margin: 20, marginTop: 0, marginBottom: 40}} >
						<Button text = "清除" onPress = {this.clear} />
						<Separator width = {10} />
						<Button text = "提交" onPress = {this.submit} />
					</View>

				</ScrollView>
			</View>
		);
	}

	_renderPlaceholderView () {
		return (
			<View style = {[Global._styles.CONTAINER, {backgroundColor: '#ffffff'}]}>
			    {this._getNavBar()}
			    {this._getToolBar()}
			</View>
		);
	}

	_getNavBar () {
		return (
			<NavBar title = 'Easy Form - Line Inputs' 
		    	navigator = {this.props.navigator} 
				route = {this.props.route}
		    	hideBackButton = {false} 
		    	hideBottomLine = {true} />
		);
	}

	_getToolBar () {
		return (
			<View style = {[Global._styles.TOOL_BAR.FIXED_BAR]}>
				<Button text = {'showLabel : ' + this.state.showLabel} clear = {true} onPress = {() => this.setState({showLabel: !this.state.showLabel})} />
				<Button text = {'labelPosition : ' + this.state.labelPosition} clear = {true} onPress = {() => this.setState({labelPosition: this.state.labelPosition == 'top' ? 'left' : 'top'})} />
			</View>
		);
	}

}

const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
	},

	fieldSet: {
		borderLeftWidth: 4, 
		borderLeftColor: 'brown', 
		paddingLeft: 10,
		paddingTop: 15,
		paddingBottom: 15, 
		backgroundColor: Global._colors.IOS_GRAY_BG,
	},
});

export default LineInputsFormTest1;



