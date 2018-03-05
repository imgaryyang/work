'use strict';
/**
    支付详情
    输入：
        orderId: null,          // 订单号
        callback: null,         // 回调函数（orderId, status）
        backRoute: null,        // 退回界面
    输出：
*/

import React, {
    Component,
    PropTypes,
} from 'react';

import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    Image,
    PixelRatio,
    TouchableOpacity,
    Navigator,
    Dimensions,
    InteractionManager,
    ListView,
    TextInput,
    Alert
}  from 'react-native';

import * as Global  from '../../Global';
import Checkbox     from '../../lib/Checkbox';

import NavBar       from 'rn-easy-navbar';
import EasyIcon     from 'rn-easy-icon';
import Portrait     from 'rn-easy-portrait';

import PayFinish    from './PayFinish';
import Card         from 'rn-easy-card';

const ORDER_GET_URL     = 'elh/order/';
const PAYED_POST_URL    = 'elh/treat/pay/callback/';

class CashierDesk extends Component {

    /**
    * 初始化状态
    */
    constructor (props) {
        super(props);

    }

    state = {
        checked: 0,                     // 0:医保 1：银联 2：支付宝
        payAmt: 0,                      // 需付款金额
        payDesc: null,                  // 支付信息
    };

    static propTypes = {
        orderId: PropTypes.string,
        callback: PropTypes.func,
        backRoute: PropTypes.object.isRequired,
    }

    static defaultProps = {
        orderId: null,              // 订单号
        callback: null,
        backRoute: null,
    };

    async componentWillMount() {

        /**
        *   查询订单信息
        */
        if ( !this.props.orderId )
            return;

        let responseData = null
        try {
            this.showLoading();
            responseData = await this.request(Global._host + ORDER_GET_URL + this.props.orderId, {
                    method: 'GET'
                });
            this.hideLoading();
        } catch(e) {
            this.hideLoading();
            this.handleRequestException(e);
        }
        
        if (responseData.success) {
            if ( null == responseData.result ) {
                Alert.alert(
                    '提示',
                    '未查到此订单信息!',
                    [
                        {
                            text: '确定'
                        }
                    ]
                );
                return;
            }
            this.setState({
                payAmt: responseData.result.amount,
                payDesc: responseData.result.description,
            });
        }
    }

    callPwdCheck() {

        /**
        *   1、显示支付密码输入页面
        */
        this.inputPwd(this.payOrder.bind(this));
    }

    async payOrder( pwd ) {
        /**
        *   1、支付提交
        */
        if ( pwd != '888888' ) {
            return false;
        }

        // 调用更新账单状态   --- for test
        let responseData = null;
        try {
            this.showLoading();
            responseData = await this.request(Global._host + PAYED_POST_URL + this.props.orderId);
            // console.log(responseData);
            this.hideLoading();
        } catch(e) {
            this.handleRequestException(e);
            return true;
        }
        console.log(responseData.success);
        if (!responseData.success) {
            Alert.alert(
                '提示',
                responseData.msg,
                [
                    {
                        text: '确定'
                    }
                ]
            );
            return true;
        }
        
        this.hidePwd();

        this.props.navigator.push({
            component: PayFinish,
            hideNavBar: true,
            passProps: {
                backRoute: this.props.backRoute,
                callback: this.props.callback,
                order: {
                    orderId: this.props.orderId,
                    payDesc: this.state.payDesc,
                    payType: this.state.checked,
                    payAmt: this.state.payAmt,
                }
            }
        })

        /**
        *   2、返回到调用界面
        */

        // if (null != this.props.callback ) {
        //     this.props.callback();
        // }

        // this.props.navigator.pop();
        return true;
    }

    // async afterPwdChecked() {
    //     console.log('afterPwdChecked');
    //     // TODO:添加密码校验后业务逻辑
    //     try{
    //         /*账户余额变更*/
    //         console.log(this.state.accountInfo);
    //         if(this.state.accountInfo.bank_no==''||this.state.accountInfo.bankName=='电子账户'){
    //             console.log('账户电子账户');
                
    //             /*电子账户*/
    //             await this.keepElcAcct(this.props.payElcAcctDetails,this.state.accountInfo.acctNo);
    //         }else{
    //             /*银行账户*/
    //         }

    //     }catch(e){
    //         console.log('afterPwdChecked failed');
    //         this.hideLoading();
    //         this.requestCatch(e);
    //     }
        
    // }

    _getNavBar () {
        return (
            <NavBar title = '付款详情' 
                navigator = {this.props.navigator} 
                route = {this.props.route}
                hideBackButton = {false} 
                hideBottomLine = {false} />
        );
    }

    render() {

        return (
            <View style={Global._styles.CONTAINER}>
                {this._getNavBar()}
                <ScrollView style={styles.sv} keyboardShouldPersistTaps={true}>
                <Card radius = {7} style={{ margin: 15 }} noPadding={true} >
                    <View style={styles.rend_row}>
                        <View style={{width: 80, flexDirection: 'row'}}>
                            <Text style={styles.textA}>支付信息</Text>
                        </View>
                        <View style={{flex: 3, paddingRight: 25}}>
                            <Text style={{textAlign:'right'}}>{this.state.payDesc}</Text>
                        </View>
                    </View>

                    <View style = {styles.separator} />
                    
                    <View style={styles.rend_row}>
                        <View style={{width: 70, flexDirection: 'row'}}>
                            <Text style={styles.textA}>需付款</Text>
                        </View>
                        <View style={{flex: 1, alignItems: 'flex-end', paddingRight: 30}}>
                            <Text style={{textAlign:'left', fontSize:24, color: '#FFAA6F'}}>{parseFloat(this.state.payAmt).toFixed(2)}元</Text>
                        </View>
                    </View>
                </Card>
                    
                <Card radius = {7} style={{ marginLeft: 15, marginRight: 15, backgroundColor: '#FF635C' }} noPadding={true}>    
                    <View style={[styles.rend_row, {height:30}]}>
                        <Text style={{fontSize:14, color: '#FFFFFF'}}>使用医保个人账户余额付款</Text>
                    </View>
                    <View style = {styles.separator} />
                    <Checkbox iconSize='normal' size={20} style={ [styles.rend_row, {height: 90}]} color={this.state.checked=='0'?'#F3C65E':'#A79CA2'}
                        checked={this.state.checked=='0'?true:false}
                        onPress={()=>this.setState({
                            checked :'0' 
                        })}>
                            <Portrait imageSource={require('../../res/images/pay/0101.jpg')} width = {90} height={56} radius={5}/>
                            <View>
                                <Text style={{marginLeft: 10, fontSize:16, color: '#FFFFFF'}}>360 203 1984 0903 2058</Text>
                                <Text style={{marginLeft: 10, fontSize:16, color: '#FFFFFF'}}>账户余额: 568.99</Text>
                            </View>
                    </Checkbox>
                </Card>

                <Card radius = {7} style={{ margin: 15 }} noPadding={true}>    
                    <View style={[styles.rend_row, {height:30}]}>
                        <Text style={{fontSize:14}}>使用其他付款方式</Text>
                    </View>
                    <View style = {styles.separator} />
                    <Checkbox iconSize='normal' size={20} style={ styles.rend_row } color={this.state.checked=='1'?'#F3C65E':'#A79CA2'}
                        checked={this.state.checked=='1'?true:false}
                        onPress={()=>this.setState({
                            checked :'1' 
                        })}>
                            <Portrait style={{marginLeft:5}} imageSource={require('../../res/images/pay/unionpay.png')} width = {48} height={30} radius={5}/>
                            <Text style={{flex:1, marginLeft: 28, fontSize:16}}>银联支付</Text>
                    </Checkbox>
                    <View style = {styles.separator} />
                    <Checkbox style={styles.rend_row} iconSize='normal' size={20} color={this.state.checked=='2'?'#F3C65E':'#A79CA2'}
                        checked={this.state.checked=='2'?true:false}
                        onPress={()=>this.setState({
                            checked :'2' 
                        })}>
                            <Portrait style={{margin:5}} imageSource={require('../../res/images/pay/alipay.png')} width = {48} height={30} radius={5}/>
                            <Text style={{flex:1, marginLeft: 23, fontSize:16}}>支付宝支付</Text>
                    </Checkbox>
                </Card>
                <View style={[{flexDirection: 'row', marginTop: 10,paddingLeft: 10,paddingRight: 10}]}>
                    <TouchableOpacity 
                        style={[Global._styles.CENTER, {height: 40, flex: 1, backgroundColor: Global._colors.IOS_BLUE, borderRadius: 3,}]} 
                        onPress={()=>this.callPwdCheck()}>
                        <Text style={{color: '#ffffff',}}>下一步</Text>
                    </TouchableOpacity>
                </View>

                </ScrollView>
            </View>
        )
    }
}
var styles = StyleSheet.create({
    paddingPlace: {
        flex: 1,
        height: Global.NBPadding,
    },
    sv: {
    },
    rend_row: {
        flex: 1,
        height: 55,
        flexDirection: 'row',
        paddingLeft:10,
        justifyContent: 'flex-start',
        alignItems: 'center',
        // backgroundColor:'#FFFFFF',
        // borderWidth: 1 / Global._pixelRatio,
        // borderColor:Global._colors.TAB_BAR_LINE,
    },
    separator: {
        backgroundColor: Global._colors.IOS_SEP_LINE, 
        height: 1/Global._pixelRatio,
    },
    thumb: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    textA: {
        flex: 1,
        fontSize: 14,
        textAlign: 'left',
    },
    icon: {
        textAlign: 'center',
    },

    button:{
        marginLeft:90,
        width:50,
        height:25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#ef473a',
        borderColor:'#ffffff',
        borderWidth:1 / Global._pixelRatio,
    },
    item: {
        flexDirection: 'row',
        height : 30
    },

});


module.exports = CashierDesk;