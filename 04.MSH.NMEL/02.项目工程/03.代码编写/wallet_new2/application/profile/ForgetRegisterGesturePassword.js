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
    Dimensions,
} from 'react-native';

import GesturePassword  from 'react-native-gesture-password';
import NavBar       from '../store/common/TopNavBar';
import * as Global  from '../Global';
import RSAUtils from '../utils/RSAUtils';
import TabBar from '../lib/nav/TabBar';
import Login from './Login';

class ForgetRegisterGesturePassword extends Component {

    static displayName = 'RegisterGesturePassword';
    static description = '忘记密码设置手势密码';

    static propTypes = {};

    static defaultProps = {};

    state = {
        doRenderScene: false,
        message: '请输入密码',
        status: 'normal',
        password1: null,
        password2: null,
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({doRenderScene: true}, () => {

            });
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
        if (this.state.password1 == null) {
            this.setState({
                status: 'normal',
                message: '请再次输入密码',
                password1: password,
            });
            return false;
        }
        if (this.state.password1 != password) {
            this.setState({
                status: 'wrong',
                message: '两次密码输入不一致，请重新输入',
                password1: null,
                password2: null,
            });
            return false;
        }
        this.setState({
            status: 'right',
            message: '设置成功，请稍后...',
            password2: password,
        });
        this.startRegister();
    }

    onStart() {
        this.setState({
            status: 'normal',
            message: '请输入密码'
        });
    }

    async startRegister() {
        try {
            this.showLoading();
            let random = this.props.param.random;
            let modulus1 = this.props.param.modulus1;
            let exponent1 = this.props.param.exponent1;
            let encPsswd = RSAUtils.RSAUtils.encryptedPassword(random, this.state.password1, modulus1, exponent1);
            let responseData = await this.request(`${Global._host}el/user/getPassword`, {
                body: JSON.stringify({
                    mobile: this.props.tel,
                    encPsswd: encPsswd,
                    appId: '8a8c7db154ebe90c0154ebfdd1270004',
                    idCardNo: this.props.idCardNo,
                    group: '0',
                })
            });
            this.hideLoading();
            if (!responseData || !responseData.success) {
                this.toast('设置密码失败，请重试');
                return false;
            }
            this.toast('设置密码成功');
            this.props.navigator.resetTo({
                component: Login,
                hideNavBar: true,
            });
        } catch (e) {
            this.setState({
                status: 'normal',
                message: '请输入密码',
                password1: null,
                password2: null,
            });
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
                    interval={500}
                    style={styles.main}
                    textStyle={styles.textStyle}
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
            <NavBar title='设置手势密码'
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

export default ForgetRegisterGesturePassword;



