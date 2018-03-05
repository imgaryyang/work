'use strict';

import React, {
    Component,
    PropTypes,
} from 'react';

import {
    View,
    ScrollView,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    StyleSheet,
    InteractionManager,
    Animated,
    Navigator,
    Alert,
    AsyncStorage,
} from 'react-native';

import * as Global      from '../../Global';
import RSAUtils       	from '../../utils/RSAUtils';
import UserAction       from '../../flux/UserAction';
import UserStore        from '../../flux/UserStore';
import FormConfig       from '../../lib/form/config/DefaultConfig';
import Form             from '../../lib/form/EasyForm';

import NavBar           from 'rn-easy-navbar';
import Button           from 'rn-easy-button';
import Separator        from 'rn-easy-separator';

const FIND_URL 			= 'el/user/setPayPassword';
const PRE_URL 			= 'el/user/pre/';

class SetPayPassword extends Component {

    static displayName = 'SetPayPassword';
    static description = '设置支付密码';

    form = null;

    static propTypes = {

    };

    static defaultProps = {
    };

    state = {
        doRenderScene: false,
        userInfo: null,
        bankCards: null,
        buttonState: false,
        value: {
        },
    };

    constructor (props) {
        super(props);

        this.componentDidMount          = this.componentDidMount.bind(this);
        this.doSave                     = this.doSave.bind(this);
        this.doSaveCheck                = this.doSaveCheck.bind(this);
        this.onChange                   = this.onChange.bind(this);
        this.onUserStoreChange			= this.onUserStoreChange.bind(this);
        this.getUser                   	= this.getUser.bind(this);
        this.goToMyRoute		 		= this.goToMyRoute.bind(this);
    }

    componentDidMount () {
        this.unUserStoreChange = UserStore.listen(this.onUserStoreChange);

        InteractionManager.runAfterInteractions(() => {
            this.getUser();
            this.setState({doRenderScene: true});
        });
    }
    onUserStoreChange (_user) {
        // console.log('========================profile UserStore   Changed!!! =======================');
        this.setState({
            userInfo: _user.user,
        });
        // console.log(this.state.userInfo.portrait);
        // console.log('========================hUserStore.getUser()aha UserStore   Changed!!! =======================');
    }
    componentWillUnmount () {
        this.unUserStoreChange();
    }
    async getUser () {
        this.setState({
            userInfo: UserStore.getUser(),
        });
    }
    goToMyRoute(){
        this.props.navigator.popToTop();
    }
    refresh() {

        this.setState({
            buttonState: false,
            value: {},
        });
    }
    /**
     * 保存支付密码
     */
     doSaveCheck(){
        
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
            this.doSave();
        }
    }
    async doSave () {

        this.setState({
                    buttonState: true,
                });
        this.showLoading();
        try {
            // 修改支付密码
        	let responseData = await this.request(Global._host + PRE_URL + "pay", {
				method: 'GET'
			});

            let encPayPsswd = RSAUtils.RSAUtils.encryptedPin(responseData.result.random,this.state.value.PayPassword, responseData.result.modulus2.trim(), responseData.result.exponent2.trim(),responseData.result.modulus1.trim(), responseData.result.exponent1.trim());
			
            console.log( Global._host + FIND_URL + "/" + this.state.userInfo.id + "/" + encPayPsswd );
            responseData = await this.request(Global._host + FIND_URL + "/" + this.state.userInfo.id + "/" + encPayPsswd , {
                method : 'PUT'
            });

            this.hideLoading();
            this.state.userInfo.payPassword = '1';
            UserAction.onUpdateUser(this.state.userInfo);
            
            this.toast('支付密码修改成功！');
            this.goToMyRoute();

        } catch(e) {
            this.setState({
                    buttonState: false,
                });
            this.hideLoading();
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
                <ScrollView style = {styles.scrollView} >
                    <Separator height = {10} />
                    <Form ref = {(c) => this.form = c} onChange = {this.onChange} value = {this.state.value} showLabel = {false}>
                        <Form.TextInput name = "PayPassword"  label="支付密码" placeholder = "请输入您的支付密码" password = {true} required = {true}  maxLength = {16} minLength = {6}  icon = "md-lock" />
                        <Form.TextInput name = "PayPassword2" label="再次输入支付密码"  placeholder = "请再次输入您的支付密码" password = {true}  maxLength = {16} minLength = {6}  required = {true} icon = "md-lock" />
                    </Form>
                    
                    <View style = {{flexDirection: 'row', marginTop: 20,marginLeft: 20,marginRight: 20}} >
                        <Button text = "确定" onPress = {this.doSaveCheck} theme = {Button.THEME.ORANGE} disabled = {this.state.buttonState}/>
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
            <NavBar title = '设置支付密码' 
                navigator = {this.props.navigator} 
                route = {this.props.route} rightButtons={(
                        <View style={[Global._styles.NAV_BAR.BUTTON_CONTAINER, Global._styles.NAV_BAR.RIGHT_BUTTONS]}>
                            <TouchableOpacity style={[Global._styles.NAV_BAR.BUTTON]}  onPress={()=>{this.refresh()}}>
                                <Text style={{color: Global._colors.IOS_BLUE,}}>刷新</Text>
                            </TouchableOpacity>
                        </View>
                )} />
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
    note: {
        fontSize: 13,
    }
});

export default SetPayPassword;