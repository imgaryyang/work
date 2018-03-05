'use strict';
/**
 * 绑定卡 第二步 输入认证信息
 */
import React, {
    Component,
    PropTypes,
} from 'react';

import {
	Alert,
    View,
    ScrollView,
    Text,
    Image,
    TextInput,
	BackAndroid,
    TouchableOpacity,
    StyleSheet,
	InteractionManager,
} from 'react-native';

import * as Global  from '../../Global';
import Form 		from '../../lib/form/EasyForm';
import UserStore    from '../../flux/UserStore';

import NavBar       from 'rn-easy-navbar';
import Button       from 'rn-easy-button';
import Separator    from 'rn-easy-separator';

class RealNameReg extends Component {

    static displayName = 'RealNameReg';
    static description = '实名认证';
    static propTypes = {
    };

    static defaultProps = {
    };

    state = {
        doRenderScene: false,
        value: {
            id: '',
            status: '1',
            userId: 5,//UserStore.getUser().id,
        },
        second: 30,
        showLabel: true,
        labelPosition: 'left',
        user: UserStore.getUser(),
        cardCount: 0,
        addState: false,
        userPatient: this.props.userPatient,
        data: null,
        isRealName: false,
        bankCards: UserStore.getBankCards(),
    };

    constructor (props) {
        super(props);
        this.submit 		= this.submit.bind(this);
        this.onChange 		= this.onChange.bind(this);
        this.sendAuthSM 	= this.sendAuthSM.bind(this);

		if(this.props.way){
			let routes = this.props.navigator.getCurrentRoutes();
			let route = routes[routes.length - 1];
			route.ignoreBack = true;
		}
    }

	componentWillMount() {
        
    }
	
	componentDidMount () {
		// this.getIsRealName();
        this.sendAuthSM();
		InteractionManager.runAfterInteractions(() => {
			this.setState({
				doRenderScene: true,
			});
		});
        if(this.props.userPatient && this.props.userPatient.id){
			this.setFormValue();
		}
	}

	componentWillUnmount () {
		clearTimeout(this._timer);
		clearTimeout(this._clockTimer);
	}

    /**
	* 页面初始化赋值，用于修改
	**/
    setFormValue() {
        this.setState({
            value: {
                id: this.state.userPatient.id,
                userId: this.state.userPatient.userId,
				cardNo: this.props.card.cardNo,
                cardholder: this.props.card.cardholder,
                idCardNo: this.props.card.idCardNo,
                name: this.state.userPatient.name,
                idno: this.state.userPatient.idno,
                mobile: this.state.userPatient.mobile,
            },
            cardCount: this.state.userPatient.cardCount,
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
		return (
			<View style = {Global._styles.CONTAINER} >
				{this._getNavBar()}
				<ScrollView automaticallyAdjustContentInsets = {false} style = {styles.scrollView} keyboardShouldPersistTaps={true}>
				    <Form ref = {(c) => this.form = c} showLabel = {this.state.showLabel} labelPosition = {this.state.labelPosition}
						labelWidth = {70} onChange = {this.onChange} value = {this.state.value} >
						<Form.TextInput name = "cardNo" label = "认证卡号" placeholder = "请输入认证卡号" editable={false} showClearIcon={false} required = {true} minLength = {1} maxLength = {20} icon = "md-person" />
						<Form.TextInput name = "cardholder" label = "持卡人" placeholder = "请输入持卡人姓名" editable={false} showClearIcon={false} required = {true} minLength = {1} maxLength = {20} icon = "md-person" />
						<Form.TextInput name = "idCardNo" label = "身份证号" placeholder = "请输入持卡人身份证号" editable={false} showClearIcon={false} required = {true} dataType = "cnIdNo" icon = "md-list-box" />
						<Form.TextInput name = "mobile" label = "手机号" placeholder = "请输入银行预留手机号码" dataType = "mobile" required = {true} icon = "ios-phone-portrait" />
                        <Form.TextInput name = "authCode" label = "验证码"  placeholder = "请输入短信验证码" 
							icon = "ios-chatbubbles" required = {true} dataType = "number" maxLength = {6} minLength = {6} textAlign = "center" 
							buttonText = {"点击免费" + "\n" + "获取验证码"} autoFocus={true}   buttonOnPress = {this.sendAuthSM} 
							buttonDisabled = {this.state.buttonDisabled} buttonDisabledText = {this.state.second + "秒钟后可" + "\n" + "再次发送"} 
							help = "请输入验证短信中的6位验证码" 
						/>
					</Form>
					<View style = {{flexDirection: 'row', margin: 10, marginTop: 20, marginBottom: 40}} >
						<Button text = "提交认证" onPress={() => this.submit()}/>
					</View>
				</ScrollView>
			</View>
		);
	}

    sendAuthSM () {
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

	// async getIsRealName(){
    //     let FIND_URL = 'el/user/isRealName/';
    //     try {
	//         let responseData = await this.request(Global._host + FIND_URL + UserStore.getUser().id,{
	//         	method:'GET',
    //         });
            
	// 		this.setState({
	// 			isRealName: responseData.success,
	// 		});
    //     } catch(e) {
    //         this.handleRequestException(e);
    //     }
	// }
	// _getNavBar () {
	// 	return (
	// 		<NavBar 
	// 			title = ''
	// 			centerComponent = {(
	// 				<BindStep num="2"/>
	// 			)} 
	// 			navigator = {this.props.navigator} 
	// 			route = {this.props.route} 
	// 			hideBottomLine = {false} 
	// 			rightButtons = {(
	// 				<View style = {{width:1,}}>
						
	// 				</View>
	// 			)} 
	// 		/>
	// 	);
	// }
	goBack() {
		Alert.alert(
            '提示',
            '放弃实名认证不会影响已经绑定的卡',
            [
				{ text: '继续认证', style: 'cancel' },
				{
					text: '放弃', onPress: () => {
						let routes = this.props.navigator.getCurrentRoutes();
						clearTimeout(this._timer);
						clearTimeout(this._clockTimer);
						this.props.navigator.popToRoute(routes[routes.length - 5]);
						this.props.fresh();
					}
				},
            ]
        );
	}

    _getNavBar () {
		return (
			<NavBar title = '实名认证' 
		    	navigator = {this.props.navigator} 
				route = {this.props.route}
		    	hideBackButton = {this.props.way} 
		    	hideBottomLine = {false}
				rightButtons = {this.props.way ? (
					<View style = {[Global._styles.NAV_BAR.BUTTON_CONTAINER, Global._styles.NAV_BAR.RIGHT_BUTTONS]}>
						<TouchableOpacity style = {[Global._styles.NAV_BAR.BUTTON]} onPress={() => this.goBack()}>
							<Text style={{color:'#fff'}}>放弃</Text>
						</TouchableOpacity>
					</View>
				) : null} />
		);
	}
	_renderPlaceholderView () {
		return (
			<View style = {Global._styles.CONTAINER}>
			</View>
		);
	}
	
    async submit() { //传递当前登录人员ID
        if (!this.form.validate()) {
            return;
        }
		this.showLoading();
        let REALNAME_URL = 'elh/medicalCard/my/doRealName/';
        try {
            let responseData = await this.request(Global._host + REALNAME_URL, {
                method: 'POST',
                body: JSON.stringify({
                    id: this.props.userPatient.id,
					typeId: this.props.card.typeId,
					typeName: this.props.card.typeName,
					orgId: this.props.card.orgId,
					orgName: this.props.card.orgName,
                    cardNo: this.state.value.cardNo,
                    cardholder: this.state.value.cardholder,
                    idCardNo: this.state.value.idCardNo,
                    mobile: this.state.value.mobile,
                    authCode: this.state.value.authCode,
					bindedAt: this.props.card.bindedAt,
					personId: this.props.card.personId,
					patientId: this.props.userPatient.patientId
                })
            });
			this.hideLoading();
			if (responseData.success) {
				this.toast('认证成功');
				if (this.props.way) {
					let routes = this.props.navigator.getCurrentRoutes();
					this.props.navigator.popToRoute(routes[routes.length - 5]);
					this.props.fresh();
				} else {
					this.props.navigator.pop();
					this.props.fresh();
				}
			} else {
				this.toast(responseData.msg);
			}
        //     if (responseData.success) {
        //         this.props.navigator.push({
        //             component: BindCard3,
        //             hideNavBar: true,
        //             passProps: {
        //                 bankCards: responseData.result,
        //                 mobile: this.state.value.mobile,
        //             },
        //         });
        //     }
        } catch (e) {
			this.hideLoading();
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

export default RealNameReg;