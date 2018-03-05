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
    AsyncStorage,
    Linking,
    Image,
} from "react-native";

import * as Global  from '../Global';
import Login  from './Login';
import Register  from './Register';
import UserAction from '../flux/UserAction';
import TabBar from '../lib/nav/TabBar';

export default class Index extends Component {

    constructor(props) {
        super(props);
        this.cardno = null;
        this.state = {
            signIn:true
        };
    }

    _timer = null;

    componentDidMount() {
        this.autoLogin();
    }

    async autoLogin() {
        let userStr = await AsyncStorage.getItem(Global._ASK_USER);
        let user = JSON.parse(userStr);
        if (user && user.sessionId != null) {
            let bankCards = await AsyncStorage.getItem(Global._ASK_USER_BANKCARDS);
            UserAction.login(user, JSON.parse(bankCards));
            this._timer = setTimeout(()=>{
                this.props.navigator.resetTo({
                    component: TabBar,
                    hideNavBar: true,
                });
            },300);
        } else {
            this._timer = setTimeout(()=>{
                this.setState({
                    signIn:false,
                });
            },300);
            Linking.getInitialURL().then((url) => {
                if (url) {
                    let cardno = this.getQueryString(url, 'cardno');
                    if (cardno) {
                        this.cardno = cardno;
                        this.checkIdCardNoIsExist(cardno);
                    }
                }
            }).catch(e => {
                console.log(`Index Linking.getInitialURL Error: ${e}`);
            });
        }
    }

    getQueryString(url, name) {
        var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(url);
        if (!results || !results[1])
            return null;
        return results[1];
    }

    async checkIdCardNoIsExist(cardno) {
        let url = `${Global._host}el/user/existByIdNo/${cardno}`;
        let options = {
            method: "GET"
        };
        try {
            let responseData = await this.request(url, options);
            if (!responseData.success) {
                this.toRegister();
            }
        } catch (e) {
            this.handleRequestException(e);
        }
    }

    componentWillUnmount() {
        if(this._timer)
            clearTimeout(this._timer);
    }

    toLogin() {
        this.props.navigator.push({
            component: Login,
            hideNavBar: true,
            passProps: {
                from: 'index',
            },
        });
    }

    toRegister() {
        this.props.navigator.push({
            component: Register,
            hideNavBar: true,
            passProps: {
                cardno: this.cardno,
            },
        });
    }

    render() {
        return (
            <View style={Global._styles.CONTAINER}>
                <View style={styles.top}>
                    <Image source={require('../res/images/home/login.png')} style={{width:184,height:184*243/551}}/>
                </View>
                {this.state.signIn ?
                    <View style={{height:48,justifyContent:'center',alignItems:'center',marginBottom:30,}}>
                        <Text style={{textAlign:'center',color:Global.Color.GRAY}}>验证用户...</Text>
                    </View>
                        :
                    <View style={styles.bottom}>
                        <TouchableOpacity
                            style={[styles.btn,{backgroundColor:Global.Color.BLUE}]}
                            onPress={this.toRegister.bind(this)}>
                            <Text style={styles.btnTxt}>注册</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.btn,{backgroundColor:Global.Color.RED}]}
                            onPress={this.toLogin.bind(this)}>
                            <Text style={styles.btnTxt}>登录</Text>
                        </TouchableOpacity>
                    </View>
                }
            </View>
        );
    };

}

const styles = StyleSheet.create({
    top: {
        flex: 1,
        justifyContent:'center',
        alignItems:'center'
    },
    bottom: {
        flexDirection:'row',
        paddingHorizontal:6,
        marginBottom:30,
        height:48
    },
    btn: {
        flex:1,
        marginHorizontal: 10,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
    },
    btnTxt: {
        color: '#fff',
        fontSize: Global.FontSize.BASE,
    },
});
