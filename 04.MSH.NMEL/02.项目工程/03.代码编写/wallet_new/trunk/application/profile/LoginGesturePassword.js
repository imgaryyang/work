'use strict';

import React, {
    Component,
    PropTypes,
} from 'react';

import {
    View,
    StyleSheet,
    InteractionManager,
} from 'react-native';

import GesturePassword  from 'react-native-gesture-password';
import NavBar       from '../store/common/TopNavBar';
import * as Global  from '../Global';
import RSAUtils from '../utils/RSAUtils';
import UserAction from '../flux/UserAction';
import TabBar from '../lib/nav/TabBar';

const LOGIN_URL 		= 'el/user/login';
const PRE_LOGIN_URL 	= 'el/user/pre/';
const BANKS_URL 		= 'el/user/getBankCards';

class LoginGesturePassword extends Component {

    static displayName = 'LoginGesturePassword';
    static description = '验证手势密码';

    state = {
        doRenderScene: false,
        message: '请绘制解锁图案',
        status: 'normal',
        password: null,
        userInfo:null,
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({doRenderScene: true});
        });
    }

    onEnd(password) {
        if (password && password.length < 2) {
            this.setState({
                status: 'wrong',
                message: '密码长度必须大于两位，请重新输入'
            });
            return false;
        }
        this.setState({
            status: 'right',
            password: password,
        },()=>{
            this.signIn();
        });
    }

    onStart() {
        this.setState({
            status: 'normal',
        });
    }

    async signIn() {
        try {
            this.showLoading();

            let responseData = await this.request(Global._host + PRE_LOGIN_URL + "login", {
                method: 'GET'
            });

            let encPsswd = RSAUtils.RSAUtils.encryptedPassword(responseData.result.random, this.state.password, responseData.result.modulus1.trim(), responseData.result.exponent1.trim());

            responseData = await this.request(Global._host + LOGIN_URL, {
                body: JSON.stringify({
                    mobile: this.props.tel,
                    encpswd: encPsswd,
                    appId: Global._appId
                })
            });

            if (!responseData || !responseData.success) {
                this.hideLoading();
                this.toast('登录失败，请重试');
                return false;
            }

            let responseData1 = await this.request(Global._host + BANKS_URL, {
                body: JSON.stringify({
                    mobile: this.props.tel,
                    encpswd: encPsswd,
                    appId: Global._appId
                })
            });

            if (!responseData1 || !responseData1.success) {
                this.hideLoading();
                this.toast('登录失败，请重试');
                return false;
            }

            this.hideLoading();

            UserAction.login(responseData.result,responseData1.result);

            this.props.navigator.resetTo({
                component: TabBar,
                hideNavBar: true,
            });
        } catch (e) {
            this.hideLoading();
            this.handleRequestException(e);
        }
    }

    render() {
        if (!this.state.doRenderScene)
            return this._renderPlaceholderView();

        return (
            <View style={Global._styles.CONTAINER}>
                <GesturePassword
                    ref='pg'
                    status={this.state.status}
                    message={this.state.message}
                    onStart={() => this.onStart()}
                    onEnd={(password) => this.onEnd(password)}
                    style={styles.main}
                    textStyle={styles.textStyle}
                    interval={500}
                />
                {this._getNavBar()}
            </View>
        );
    }

    _renderPlaceholderView() {
        return (
            <View style={Global._styles.CONTAINER}>
                {this._getNavBar()}
            </View>
        );
    }

    _getNavBar() {
        return (
            <NavBar title='验证密码'
                navigator={this.props.navigator}
                route={this.props.route}
                hideBackButton={false}
                hideBottomLine={false}
                flow={true}
            />
        );
    }

}

const styles = StyleSheet.create({
    textStyle: {
        fontSize: Global.FontSize.BASE,
        color: '#4aa4ff',
    },
});

export default LoginGesturePassword;



