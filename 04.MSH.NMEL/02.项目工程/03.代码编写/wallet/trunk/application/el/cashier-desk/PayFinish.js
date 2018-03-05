'use strict';
/**
    支付完成
    输入：
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

import NavBar       from 'rn-easy-navbar';
import EasyIcon     from 'rn-easy-icon';

const ORDER_GET_URL     = 'elh/order/';
const PAYED_POST_URL    = 'elh/treat/pay/callback/'

class PayFinish extends Component {

    /**
    * 初始化状态
    */
    constructor (props) {
        super(props);

    }

    state = {
    };

    static propTypes = {
        backRoute: PropTypes.object.isRequired,
        callback: PropTypes.func,
    }

    static defaultProps = {
        backRoute: null,
        callback: null,
    };

    componentDidMount() {
    }

    back() {
        if (this.props.backRoute) {
            this.props.navigator.popToRoute(this.props.backRoute);
        }

        if (null != this.props.callback ) {
            this.props.callback(this.props.order.orderId, true);
        }
    }

    _getNavBar () {
        return (
            <NavBar title = '支付结果' 
                navigator = {this.props.navigator} 
                route = {this.props.route}
                hideBackButton = {true} 
                hideBottomLine = {false}
            />
        );
    }

    render() {

        let payType = this.props.order.payType == 0 ? '医保账户' : ( this.props.checked == 1 ? '银联支付' : '支付宝');

        return (
            <View style={Global._styles.CONTAINER}>
                {this._getNavBar()}
                <ScrollView style={styles.sv} keyboardShouldPersistTaps={true}>

                    <View style={styles.rend_col}>
                        <EasyIcon style={{flex: 1, marginTop: 20,}} iconLib = 'fa' name='check-circle' size={40} width={45} color={Global._colors.IOS_GREEN} />
                        <Text style={{flex: 1, fontSize: 20, color: Global._colors.IOS_GREEN,}}>支付完成</Text>
                    </View>

                    <View style={styles.rend_row}>
                        <View style={styles.lable}>
                            <Text style={styles.textA}>订单编号</Text>
                        </View>
                        <View style={styles.lable_text}>
                            <Text style={{textAlign:'right'}}>{this.props.order.orderId}</Text>
                        </View>
                    </View>

                    <View style={styles.rend_row}>
                        <View style={styles.lable}>
                            <Text style={styles.textA}>支付信息</Text>
                        </View>
                        <View style={styles.lable_text}>
                            <Text style={{textAlign:'right'}}>{this.props.order.payDesc}</Text>
                        </View>
                    </View>

                    <View style={styles.rend_row}>
                        <View style={styles.lable}>
                            <Text style={styles.textA}>支付方式</Text>
                        </View>
                        <View style={styles.lable_text}>
                            <Text style={{textAlign:'right'}}>{payType}</Text>
                        </View>
                    </View>

                    <View style={styles.rend_row}>
                        <View style={styles.lable}>
                            <Text style={styles.textA}>支付金额</Text>
                        </View>
                        <View style={styles.lable_text}>
                            <Text style={{textAlign:'left', fontSize:25, color: Global._colors.FONT}}>{parseFloat(this.props.order.payAmt).toFixed(2)}元</Text>
                        </View>
                    </View>

                    <View style={[{flexDirection: 'row', marginTop: 10,paddingLeft: 10,paddingRight: 10}]}>
                        <TouchableOpacity 
                            style={[Global._styles.CENTER, {height: 40, flex: 1, backgroundColor: Global._colors.IOS_BLUE, borderRadius: 3,}]} 
                            onPress={()=>this.back()}>
                            <Text style={{color: '#ffffff',}}>支付完成</Text>
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
    rend_row1: {
        backgroundColor:Global._colors.IOS_BG,
        height:35,
        flexDirection: 'row',
        paddingLeft:30,
        borderWidth: 1 / Global._pixelRatio,
        borderColor:Global._colors.TAB_BAR_LINE,
        alignItems: 'center',
    },
    rend_row: {
        flex: 1,
        height:55,
        flexDirection: 'row',
        // paddingLeft:20,
        backgroundColor:'#FFFFFF',
        borderWidth: 1 / Global._pixelRatio,
        borderColor:Global._colors.TAB_BAR_LINE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rend_col: {
        height:140,
        flexDirection: 'column',
        backgroundColor:'#FFFFFF',
        borderWidth: 1 / Global._pixelRatio,
        borderColor:Global._colors.TAB_BAR_LINE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lable: {
        width: 70,
        flexDirection: 'row', 
        justifyContent: 'flex-end',
        // borderWidth: 1 / Global._pixelRatio,
        // borderColor:Global._colors.TAB_BAR_LINE,
    },
    lable_text: {
        flex: 1,
        alignItems: 'flex-end',
        paddingRight: 20,
        // borderWidth: 1 / Global._pixelRatio,
        // borderColor:Global._colors.TAB_BAR_LINE,
    },
    separator: {
        height: 1,
        backgroundColor: '#CCCCCC',
    },
    thumb: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    textA: {
        margin: 5,
        fontSize: 14,
        textAlign: 'right',
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


module.exports = PayFinish;