'use strict';
/**
 * 绑定卡 第二步 输入认证信息
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

import * as Global  from '../../Global';
import UserStore    from '../../flux/UserStore';
import Form 		from '../../lib/form/EasyForm';
import FormConfig 	from '../../lib/form/config/DefaultConfig';

import NavBar       from 'rn-easy-navbar';
import Icon 		from 'rn-easy-icon';
import Button       from 'rn-easy-button';
import Separator    from 'rn-easy-separator';

import Card       	from './Card';
import BindStep     from './BindStep';
import BindCard3    from './BindCard3';

class BindCard2 extends Component {

    static displayName = 'BindCard2';
    static description = '绑定卡输入认证信息';
    static propTypes = {
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,
		data: null,
		value: {
			agreement: false,
			cardTypeName: this.props.cardBin.bankName+' （'+this.props.cardBin.bankCardTypeName+'）',
			cardholder: UserStore.getUser().name,
			mobile: UserStore.getUser().mobile,
		},
		showLabel: true,
		labelPosition: 'left',
		isRealName: false,
		user: UserStore.getUser(),
		bankCards: UserStore.getBankCards(),
	};

    constructor (props) {
        super(props);
        this.submit 		= this.submit.bind(this);
        this.onChange 		= this.onChange.bind(this);
    }

	componentDidMount () {
		this.getIsRealName();
		InteractionManager.runAfterInteractions(() => {
			this.setState({
				doRenderScene: true,
			});
		});
	}

	onChange (fieldName, fieldValue, formValue) {
		this.setState({value: formValue});
	}

	render () {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();
		//如果用户已经实名认证，则将身份证隐藏，姓名只读
		let cardholder = null;
		let idNoForm = null;
		if(this.state.isRealName){
			cardholder = (<Form.TextInput name = "cardholder" label = "持卡人" editable={false} placeholder = "请输入持卡人姓名" required = {true} minLength = {1} maxLength = {20} icon = "md-person" />);
		}else{
			cardholder = (<Form.TextInput name = "cardholder" label = "持卡人" placeholder = "请输入持卡人姓名" required = {true} minLength = {1} maxLength = {20} icon = "md-person" />);
			idNoForm = (<Form.TextInput name = "idCardNo" label = "身份证号" placeholder = "请输入持卡人身份证号" required = {true} dataType = "cnIdNo" icon = "md-list-box" />);
		}
		return (
			<View style = {Global._styles.CONTAINER} >
				{this._getNavBar()}
				<ScrollView automaticallyAdjustContentInsets = {false} keyboardShouldPersistTaps = {true} style = {styles.scrollView} >
				    <Form ref = {(c) => this.form = c} config = {FormConfig} showLabel = {this.state.showLabel} labelPosition = {this.state.labelPosition}
						labelWidth = {70} onChange = {this.onChange} value = {this.state.value} >
						<Form.TextInput name = "cardTypeName" label = "卡类型" editable={false}  placeholder = ""  icon = "ios-card" />
						{cardholder }
						{idNoForm }
						<Form.TextInput name = "mobile" label = "手机号" placeholder = "请输入银行预留手机号码" dataType = "mobile" required = {true} icon = "ios-phone-portrait" />
						<Form.Switch name = "agreement" label = "服务协议" showLabel = {false} >
							<View style = {{flex: 1, flexDirection: 'row'}} >
								<Text >点击同意</Text>
								<Button text = "《易民生服务协议》" theme = {Button.THEME.HREF} stretch = {false} />
							</View>
						</Form.Switch>
					</Form>
					<View style = {{flexDirection: 'row', margin: 10, marginTop: 20, marginBottom: 40}} >
						<Button text = "下一步" onPress={() => this.submit()}/>
					</View>
				</ScrollView>
			</View>
		);
	}
	async getIsRealName(){
        let FIND_URL = 'el/user/isRealName/';
        try {
	        let responseData = await this.request(Global._host + FIND_URL + UserStore.getUser().id,{
	        	method:'GET',
            });
            
			this.setState({
				isRealName: responseData.success,
			});
        } catch(e) {
            this.handleRequestException(e);
        }
	}
	_getNavBar () {
		return (
			<NavBar 
				title = ''
				centerComponent = {(
					<BindStep num="2"/>
				)} 
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
	
	async submit () { //传递当前登录人员ID
		if(!this.state.value.agreement){
			this.toast("请同意服务协议。");
			return;
		}
		if (!this.form.validate()) {
			return;
		}
		let idCardNo = this.state.value.idCardNo;
		if(idCardNo==null || idCardNo=='') idCardNo = this.state.user.idCardNo;
        let SUBMIT_URL = 'el/cardBin/submitInfo/';
        try {
	        let responseData = await this.request(Global._host + SUBMIT_URL,{
	        	method:'POST',
                body: JSON.stringify({
		            	cardBin: this.props.cardBin,
	                    cardholder: this.state.value.cardholder,
	                    idCardNo: idCardNo,
	                    mobile: this.state.value.mobile,
	                    cardNo: this.props.cardNo,
	                    personId: this.state.user.id,
                })
            });

            if(responseData.success){
				this.props.navigator.push({
					component: BindCard3, 
					hideNavBar: true,
		            passProps: {
		            	bankCards: responseData.result,
		            	mobile: this.state.value.mobile,
		            },
		        });
            }
        } catch(e) {
            this.handleRequestException(e);
        }
	}
}

const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
		backgroundColor: '#ffffff',
		marginBottom: Global._os == 'ios' ? 48 : 0,
	},
	icon: {
		textAlign: 'left',
		width: 40,
		right: 0,
		top: 0,
	},
	textDescView: {
		paddingLeft: 10,
		paddingRight: 10,
		marginTop: 5,
		marginBottom: 10,
		flexDirection : 'row',
	},
	textStyle: {
		lineHeight: 25,
	},
});

export default BindCard2;

