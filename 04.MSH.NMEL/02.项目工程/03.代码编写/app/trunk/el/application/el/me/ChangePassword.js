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
import RSAUtils         from '../../utils/RSAUtils';
import Form             from '../../lib/form/EasyForm';
import FormConfig       from '../../lib/form/config/DefaultConfig';

import NavBar           from 'rn-easy-navbar';
import Icon             from 'rn-easy-icon';
import Button           from 'rn-easy-button';
import Separator        from 'rn-easy-separator';

const FIND_URL 	= 'el/user/changePassword/';
const PRE_URL	= 'el/user/pre/';

class ChangePassword extends Component {

    static displayName = 'ChangePassword';
    static description = '修改登陆密码';

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
        this.onChange                   = this.onChange.bind(this);
        this.goPop                      = this.goPop.bind(this);
        this.refresh                    = this.refresh.bind(this);
    }

    componentDidMount () {

        InteractionManager.runAfterInteractions(() => {
            // this.refreshUser();
            this.setState({doRenderScene: true});
        });
    }
    goPop(){
        // console.log(" changePassword pop!!!!!!!!!!!!!!!!!!!!");
        this.props.navigator.pop();

    }

    refresh() {

        this.setState({
            buttonState: false,
            value: {},
        });
    }
    
    /**
     * 保存新登陆密码v
     */
    async doSave () {

        if (this.form.validate()) {
            if(this.state.value.password1 != this.state.value.password2) {
                Alert.alert(
                    '提示',
                    '两次密码输入不一致' ,
                    [
                        {
                            text: '确定', onPress: () => {
                                this.setState({value: {},buttonState: false,});
                            }
                        }
                    ]
                );
                // this.state.value.password1.pwdConfirm.showError('两次密码输入不一致');
                // this.state.value.password1.pwdConfirm.focus();
                return;
            }
        }
        this.setState({
                    buttonState: true,
                });

        this.showLoading();
        
        try {
        	let responseData = await this.request(Global._host + PRE_URL + "login", {
				method: 'GET'
			});
			
        	let user = await AsyncStorage.getItem(Global._ASK_USER);
        	user = JSON.parse(user);
        	
            let encPsswdOld = RSAUtils.RSAUtils.encryptedPassword(responseData.result.random,this.state.value.password,responseData.result.modulus1.trim(), responseData.result.exponent1.trim());
        	let encPsswd = RSAUtils.RSAUtils.encryptedPassword(responseData.result.random,this.state.value.password1,responseData.result.modulus1.trim(), responseData.result.exponent1.trim());
        	
            responseData = await this.request(Global._host + FIND_URL + user.id + "/" + encPsswd + "/" + encPsswdOld  , {
            	method : "PUT"});
            this.hideLoading();
            this.toast('修改成功！');
            this.goPop();

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
                    <Separator height = {20} />
                    <Form ref = {(c) => this.form = c} onChange = {this.onChange} value = {this.state.value} showLabel = {false}>
                        <Form.TextInput name = "password"  label="原登陆密码" placeholder = "输入原登陆密码"  maxLength = {16} minLength = {6} autoFocus={true} password = {true} required = {true} icon = "md-lock" />
                        <Form.TextInput name = "password1"  label="新登陆密码" placeholder = "请输入新登陆密码" maxLength = {16} minLength = {6}  password = {true} required = {true} icon = "md-lock" />
                        <Form.TextInput name = "password2"  label="再次输入新登陆密码" placeholder = "请再次输入新登陆密码"maxLength = {16} minLength = {6}  password = {true} required = {true} icon = "md-lock" />
                    </Form>
                    
                    <View style = {{flexDirection: 'row', marginTop: 20,marginLeft: 20,marginRight: 20}} >
                        <Button text = "确定" onPress = {this.doSave} theme = {Button.THEME.ORANGE} disabled = {this.state.buttonState}/>
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
            <NavBar title = '更改登录密码' 
                navigator = {this.props.navigator} 
                route = {this.props.route} 
                rightButtons={(
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
});

export default ChangePassword;