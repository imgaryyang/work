/**
 * Created by liuyi on 2016/7/20.
 */
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
    TextInput,
    AsyncStorage,
} from 'react-native';

import * as Global  from '../Global';
import LoginGesture from './LoginGesturePassword';
import NavBar from '../store/common/TopNavBar';
import ForgetRegister from './ForgetRegister';

export default class Login extends Component {

    static displayName = 'Login';
    static description = '登陆';

    state = {
        doRenderScene: false,
        tel:'',
    };

    constructor(props) {
        super(props);
    }

    componentDidMount () {
        InteractionManager.runAfterInteractions(() => {
            this.setState({doRenderScene: true});
            this.getLastLoginUser();
        });
    }

    async getLastLoginUser() {
        let userStr = await AsyncStorage.getItem(Global._ASK_USER);
        let user = JSON.parse(userStr);
        if (user && user.mobile != null) {
            this.setState({
                tel: user.mobile,
            });
        }
    }

    toLogin() {
        this.refs['tel'].blur();
        this.props.navigator.push({
            component:LoginGesture,
            hideNavBar:true,
            passProps:{
                tel:this.state.tel,
            }
        });
    }

    toForget() {
        this.props.navigator.push({
         component: ForgetRegister,
         hideNavBar: true
         });
    }

    onChangeText(value) {
        this.setState({
            tel: value,
        });
    }

    render () {
        if(!this.state.doRenderScene)
            return this._renderPlaceholderView();

        return (
            <View style = {Global._styles.CONTAINER} >
                {this._getNavBar()}
                <ScrollView style={styles.container}>
                    <View style={styles.formItem}>
                        <Text style={styles.label}>手机号</Text>
                        <TextInput
                            ref="tel"
                            style={styles.input}
                            underlineColorAndroid="transparent"
                            placeholder="请输入手机号"
                            placeholderTextColor={Global.Color.GRAY}
                            value={this.state.tel}
                            onChangeText={this.onChangeText.bind(this)}
                        />
                    </View>
                    <TouchableOpacity
                        style={styles.btn}
                        onPress={this.toLogin.bind(this)}>
                        <Text style={styles.btnTxt}>验证手势密码</Text>
                    </TouchableOpacity>
                </ScrollView>
                <TouchableOpacity
                    style={styles.forget}
                    onPress={this.toForget.bind(this)}>
                    <Text style={styles.forgetTxt}>忘记手势密码？</Text>
                </TouchableOpacity>
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
            <NavBar title = '登录'
                    navigator = {this.props.navigator}
                    route = {this.props.route}
                    hideBackButton = {this.props.from != 'index'}
                    hideBottomLine = {false} />
        );
    }

}

const styles = StyleSheet.create({
    container: {
        paddingTop:20,
        paddingHorizontal:16,
    },
    formItem: {
        flexDirection: 'row',
        height: 48,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
    },
    label: {
        flex: 1,
        marginLeft: 16,
        color: Global.Color.DARK_GRAY,
        fontSize: Global.FontSize.BASE,
    },
    input: {
        flex: 3,
        padding: 0,
        height: 48,
        margin:0,
        fontSize: Global.FontSize.BASE,
        color: Global.Color.GRAY,
        
    },
    btn: {
        marginTop: 20,
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
    forget: {
        marginBottom:40,
        alignItems:'center',
        justifyContent: 'center',
    },
    forgetTxt: {
        color:Global.Color.GRAY,
        fontSize:Global.FontSize.BASE,
    }
});

