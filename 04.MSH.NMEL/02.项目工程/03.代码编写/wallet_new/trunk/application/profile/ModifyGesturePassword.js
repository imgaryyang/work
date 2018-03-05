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
    AsyncStorage,
} from 'react-native';

import GesturePassword  from 'react-native-gesture-password';
import NavBar       from '../store/common/TopNavBar';
import * as Global  from '../Global';
import RSAUtils     from '../utils/RSAUtils';

class ModifyGesturePassword extends Component {

    static displayName = 'ModifyGesturePassword';
    static description = '修改手势密码';

    static propTypes = {};

    static defaultProps = {};

    state = {
        doRenderScene: false,
        message: '请输入旧密码',
        status: 'normal',
        oldPassword: null,
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
        if (this.state.oldPassword == null) {
            this.setState({
                status: 'normal',
                message: '请输入新密码',
                oldPassword: password,
            });
            return false;
        }
        if (this.state.password1 == null) {
            this.setState({
                status: 'normal',
                message: '请再次输入新密码',
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
            message: '正在修改中，请稍等...',
            password2: password,
        });
        this.start();
    }

    onStart() {
        this.setState({
            status: 'normal',
        });
    }

    async start() {
        try {
            this.showLoading();
            let responseData = await this.request(`${Global._host}el/user/pre/login`, {
				method: 'GET'
			});
            let random = responseData.result.random;
            let modulus1 = responseData.result.modulus1;
            let exponent1 = responseData.result.exponent1;
            let encPsswdOld = RSAUtils.RSAUtils.encryptedPassword(random, this.state.oldPassword, modulus1.trim(), exponent1.trim());
            let encPsswd = RSAUtils.RSAUtils.encryptedPassword(random, this.state.password1, modulus1.trim(), exponent1.trim());

        	let user = await AsyncStorage.getItem(Global._ASK_USER);
        	user = JSON.parse(user);
            
            responseData = await this.request(`${Global._host}el/user/changePassword/${user.id}/${encPsswd}/${encPsswdOld}`, {
            	method : "PUT"});
            this.hideLoading();
            if (!responseData || !responseData.success) {
                let message = responseData.msg || '修改失败，请重试';
                this.toast(message);
                return false;
            }
            this.toast('修改成功');
            this.props.navigator.pop();
        } catch (e) {
            this.setState({
                status: 'normal',
                message: '请输入旧密码',
                oldPassword: null,
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
            <NavBar title='修改手势密码'
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

export default ModifyGesturePassword;



