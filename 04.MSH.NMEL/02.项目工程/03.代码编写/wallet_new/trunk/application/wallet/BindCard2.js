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

import * as Global  from '../Global';
import UserStore    from '../flux/UserStore';
import Form 		from '../lib/form/EasyForm';
import FormConfig 	from '../lib/form/config/DefaultConfig1';
// import FormConfig 	from '../lib/form/config/AuthCodeConfig';
// import FormConfig 	from '../lib/form/config/LineInputsConfig';
// import FormConfig 	from '../lib/form/config/MyLineInputsConfig';


import NavBar       from '../store/common/TopNavBar';
import Icon 		from 'rn-easy-icon';
import Button       from 'rn-easy-button';
import Separator    from 'rn-easy-separator';

import Card       	from './Card';
import BindStep     from './BindStep';
import BindCard3    from './BindCard3';
import WebViewPage  	from './WebViewPage';

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
        this.goYL      		= this.goYL.bind(this);
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
			cardholder = (<Form.TextInput name = "cardholder" label = "持卡人" editable={false} showClearIcon={false} placeholder = "请输入持卡人姓名" required = {true} minLength = {1} maxLength = {20} />);
		}else{
			cardholder = (<Form.TextInput name = "cardholder" label = "持卡人" placeholder = "请输入持卡人姓名" required = {true} minLength = {1} maxLength = {20} />);
			idNoForm = (<Form.TextInput name = "idCardNo" label = "身份证号" placeholder = "请输入持卡人身份证号" required = {true} dataType = "cnIdNo" />);
		}
		return (
			<View style = {Global._styles.CONTAINER} >
				{this._getNavBar()}
				<View style = {{alignItems: 'center'}}>
					<Image style = {{width:344, height:24, marginTop:15, margin:8}}  source={require('../res/images/wallet/bindcard2.png')} />
				</View>
				<ScrollView automaticallyAdjustContentInsets = {false} keyboardShouldPersistTaps = {true} style = {styles.scrollView} >
					{/*<View style={styles.continer}>
							                <View style={styles.menu}>
							                     <View style={styles.menu}>
							                        <View style={styles.menuLeft}>
							                            <Text style={styles.menuText} >11111111</Text>
							                        </View>
							                        <View style={styles.menuRight}>
								                    <TextInput
								                        style={styles.input}
								                        placeholder={'请输入用户昵称'}
								                        placeholderTextColor={Global.Color.GRAY}
								                        underlineColorAndroid='transparent'
								                        value={'77777'}
								                        // onChangeText={(nickeName) =>
								                        //     this.setState({nickeName, canClearName: nickeName != '' ? true : false})
								                        // }
								                    />
					                </View>
							                    </View>
							                </View>
							            </View>*/}








				    <Form ref = {(c) => this.form = c} config = {FormConfig} showLabel = {this.state.showLabel} labelPosition = {this.state.labelPosition}
						labelWidth = {70} onChange = {this.onChange} value = {this.state.value} >
						<Form.TextInput name = "cardTypeName" label = "卡类型" editable={false} showClearIcon={false} placeholder = "" />
						{cardholder }
						{idNoForm }
						<Form.TextInput name = "mobile" label = "手机号" placeholder = "请输入银行预留手机号码" dataType = "mobile" required = {true} />
						<Form.Switch name = "agreement" label = "服务协议" showLabel = {false} >
							<View style = {{flex: 1, flexDirection: 'row'}} >
								<Text >同意《服务协议》</Text>
								{/*<Button text = "《服务协议》" theme = {Button.THEME.HREF} stretch = {false} />*/}
							</View>
						</Form.Switch>
					</Form>
					<View style = {{flexDirection: 'row',height:44, margin: 10, marginTop: 40, marginBottom: 40}} >
						<Button text = "下一步" style={{backgroundColor: Global.Color.RED,height: 48, borderWidth: 0,}} onPress={() => this.submit()}/>
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
				title = '认证信息'
				// centerComponent = {(
				// 	<BindStep num="2"/>
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
				this.goYL(responseData.result.cardNo,
					responseData.result.id,
					responseData.result.time,
					responseData.result.mobile,
					responseData.result.idCardNo,
					responseData.result.cardHolder,
					responseData.result.securityKey);
            }
        } catch(e) {
            this.handleRequestException(e);
        }
	}

	//打开银联webview
	goYL (cardNo,id,time,mobile,idCardNo,cardHolder,securityKey) {
		console.log('towebview111111111111111111');
		this.props.navigator.push({
			component: WebViewPage, 
			hideNavBar: true,
			passProps: {
            	cardNo: cardNo,
            	orderId: id,
            	txnTime: time,
            	phoneNo:mobile,
            	certifId:idCardNo,
            	customerNm:cardHolder,
            	str:securityKey
            },
		});
	}
}

const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
		// backgroundColor: '#ffffff',
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
	continer: {
        marginTop:10,
        marginHorizontal: 8,
        borderColor: '#dcdce1',
        borderWidth: 1 / Global._pixelRatio,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    menu:{
        flex:1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
    },
    menuLeft:{
        flex:1,
        paddingLeft:16,
    },
    menuText:{
        fontSize: Global.FontSize.BASE,
        color: Global.Color.DARK_GRAY,
    },
    input:{
        margin:0,
        padding: 0,
        height: 48,
        fontSize: Global.FontSize.BASE,
        color: Global.Color.GRAY,
    },
});

export default BindCard2;

