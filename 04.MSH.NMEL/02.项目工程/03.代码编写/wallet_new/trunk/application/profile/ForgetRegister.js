/**
 * Created by liuyi on 2016/7/20.
 */
//个人中心
"use strict";

import React, {
    Component,
    PropTypes,
} from 'react';

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Modal,
    Dimensions,
} from "react-native";
import * as Global  from '../Global';
import ForgetRegisterGesturePassword from './ForgetRegisterGesturePassword';
import NavBar from '../store/common/TopNavBar';

export default class ForgetRegister extends Component {

    constructor(props) {
        super(props);
        this.title =  '忘记密码';
        this.timer = null;
        this.state = {
            tel: null,
            verificationCode: null,
            verificationBtnDisabled: false,
            verificationBtnName: '获取验证码',
            verificationCountdown: 60,
            verificationTel: null,
            nextBtnDisabled: false,
        }
    }

    async getVerificationCode() {
        if (this.state.tel == null || this.state.tel.trim() == '') {
            this.toast('请输入手机号');
            return false;
        }
        if (this.state.tel.length != 11) {
            this.toast('请输入正确的手机号');
            return false;
        }
        this.setState({verificationBtnDisabled: true});

        let url = `${Global._host}el/user/genCheckCode/${this.state.tel}?isMobileExist=true`;
        let options = {
            method: 'GET'
        };
        let responseData = null;
        try {
            responseData = await this.request(url, options);
            if (!responseData || !responseData.success) {
                this.toast('验证码发送失败，请重试');
                return false;
            }
            this.toast('验证码发送成功');
            this.timer = setInterval(this.resetVerificationBtnName.bind(this), 1000);
            this.state.verificationTel = this.state.tel;
        } catch (e) {
            this.setState({verificationBtnDisabled: false});
            this.handleRequestException(e);
        }
    }

    resetVerificationBtnName() {
        this.setState({
            verificationCountdown: this.state.verificationCountdown - 1,
            verificationBtnName: `(${this.state.verificationCountdown})s`,
        });
        if (this.state.verificationCountdown == 0) {
            clearInterval(this.timer);
            this.setState({
                verificationBtnDisabled: false,
                verificationCountdown: 60,
                verificationBtnName: '获取验证码',
            });
        }
    }

    async toNext() {
        if (this.state.tel == null || this.state.tel.trim() == '') {
            this.toast('请输入手机号');
            return false;
        }
        if (this.state.tel.length != 11) {
            this.toast('请输入正确的手机号');
            return false;
        }
        if (this.state.verificationCode == null || this.state.verificationCode.trim() == '') {
            this.toast('请输入验证码');
            return false;
        }
        if (this.state.verificationTel == null) {
            this.toast('请先获取验证码');
            return false;
        }
        if (this.state.tel != this.state.verificationTel) {
            this.toast('您修改了手机号，请重新获取验证码');
            return false;
        }
        this.setState({
            nextBtnDisabled: true,
        });
        this.showLoading();

        let url = `${Global._host}el/user/verifyCheckCode/${this.state.tel}/${this.state.verificationCode}`;
        let options = {
            method: 'GET'
        };
        let responseData = null;
        try {
            responseData = await this.request(url, options);
            if (!responseData || !responseData.success) {
                this.toast('验证码输入有误，请重新输入');
                return false;
            }
            this.props.navigator.push({
                component: ForgetRegisterGesturePassword,
                hideNavBar: true,
                passProps: {
                    tel: this.state.tel,
                    param: responseData.result,
                    idCardNo: this.props.cardno,
                },
            });
            this.setState({
                nextBtnDisabled: false,
            });
            this.hideLoading();
        } catch (e) {
            this.setState({
                nextBtnDisabled: false,
            });
            this.handleRequestException(e);
        }
    }

    onChangeText(value) {
        this.setState({
            tel: value,
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <NavBar title={this.title}
                    navigator={this.props.navigator}
                    route={this.props.route}
                    hideBackButton={false}
                    hideBottomLine={false}
                />
                <View style={styles.center}>
                    <View style={styles.formItem}>
                        <Text style={styles.label}>手机号</Text>
                        <TextInput
                            style={styles.input}
                            underlineColorAndroid="transparent"
                            placeholder="请输入登录手机号"
                            placeholderTextColor={Global.Color.GRAY}
                            value={this.state.tel}
                            onChangeText={(value) => {
                                this.setState({
                                    tel: value,
                                });
                            }}
                        />
                    </View>
                    <View style={styles.formItem}>
                        <Text style={styles.label}>验证码</Text>
                        <View style={styles.formItemRight}>
                            <TextInput
                                style={styles.input}
                                underlineColorAndroid="transparent"
                                placeholder="请输入短信验证码"
                                placeholderTextColor={Global.Color.GRAY}
                                value={this.state.verificationCode}
                                onChangeText={(value) => {
                                    this.setState({
                                        verificationCode: value,
                                    });
                                }}
                            />
                            <TouchableOpacity
                                style={styles.rightBtn}
                                disabled={this.state.verificationBtnDisabled}
                                onPress={this.getVerificationCode.bind(this)}>
                                <Text style={styles.rightBtnTxt}>{this.state.verificationBtnName}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.btn}
                        disabled={this.state.nextBtnDisabled}
                        onPress={this.toNext.bind(this)}>
                        <Text style={styles.btnTxt}>下一步</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Global.Color.LIGHTER_GRAY,
    },
    center: {},
    btn: {
        marginTop: 20,
        marginHorizontal: 16,
        height: 48,
        backgroundColor: Global.Color.RED,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
    },
    btnTxt: {
        color: '#fff',
        fontSize: Global.FontSize.BASE,
    },
    formItem: {
        flexDirection: 'row',
        marginTop: 20,
        marginHorizontal: 16,
        height: 48,
        backgroundColor: '#fff',
        alignItems: 'center',
        borderRadius: 5,
        borderColor: '#dcdce1',
        borderWidth: 1 / Global._pixelRatio,
    },
    formItemRight: {
        flex: 4,
        flexDirection: 'row',
        alignSelf: 'stretch',
        alignItems: 'center',
    },
    label: {
        flex: 1,
        marginLeft: 16,
        color: Global.Color.DARK_GRAY,
        fontSize: Global.FontSize.BASE,
    },
    input: {
        flex: 4,
        padding: 0,
        height: 48,
        fontSize: Global.FontSize.BASE,
        color: Global.Color.DARK_GRAY,
    },
    rightBtn: {
        width: 112,
        alignSelf: 'stretch',
        borderLeftColor: Global.Color.LIGHTER_GRAY,
        borderLeftWidth: 1 / Global._pixelRatio,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rightBtnTxt: {
        color: Global.Color.DARK_GRAY,
        fontSize: Global.FontSize.BASE,
    }
});
