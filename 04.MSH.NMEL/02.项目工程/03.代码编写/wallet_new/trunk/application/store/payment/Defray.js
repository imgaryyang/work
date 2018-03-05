
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
    Alert,
    TextInput,
} from 'react-native';
import NavBar       from '../common/TopNavBar';
import Button       from 'rn-easy-button';
import * as Global  from '../../Global';
import MD5 from '../../utils/MD5';
import PaymentSuccess from './PaymentSuccess';
var moment = require('moment');

import CardList  from './CardList';
import {filterCardNumLast4} from '../../utils/Filters';
class Defray extends Component {

    static displayName = '支付';
    static description = '支付页面';

    static propTypes = {};

    static defaultProps = {};


    constructor(props) {
        super(props);
        this.timer = null;
        this.state = {
            doRenderScene:false,
            tel: null,
            verificationCode: null,
            verificationBtnDisabled: false,
            verificationBtnName: '获取验证码',
            verificationCountdown: 60,
            verificationTel: null,
            nextBtnDisabled: false,
            order: {},
            bankName:null,
            cardNo:'请选择已绑定的银行卡',
            cardObj:null,
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({doRenderScene: true}, () => {
                this.getOrderData();
            });
        });
    }

    bindCard(item) {
        if(item && item.bankName){
            this.state.bankName = item.bankName;
        }
        if(item && item.cardNo){
            this.state.cardNo = item.cardNo;
            this.state.cardNo = filterCardNumLast4(this.state.cardNo);
        }
        if(this.state.cardNo === null){
            this.state.cardNo = '请选择已绑定的银行卡'
        }
        this.state.cardObj = item;
    }

    async getOrderData() {
        let orderId = this.props.orderId;
        let url = `${Global.ServerUrl}?act=app&op=showOrder&order_id=${orderId}`;
        let options = {
            method: "GET"
        };
        try {
            let responseData = await this.request(url, options);
            if (!responseData)
                return false;
            if (!responseData.success) {
                this.toast(responseData.message);
                return false;
            }
            if (!responseData.root)
                return false;
            this.setState({
                doRenderScene: true,
                order: responseData.root,
            });
        } catch (e) {
            this.handleRequestException(e);
        }
    }

    async getVerificationCode() {
        if (!this.state.cardObj || !this.state.cardObj.cardNo) {
            this.toast('请选择银行卡');
            return false;
        }
        if (this.state.tel == null || this.state.tel.trim() == '') {
            this.toast('请输入手机号');
            return false;
        }
        if (this.state.tel.length != 11) {
            this.toast('请输入正确的手机号');
            return false;
        }
        this.setState({verificationBtnDisabled: true});

        let accNo = this.state.cardObj.cardNo; //卡号
        let orderId = this.state.order.order_sn; //订单号
        let txnTime = moment(this.state.order.add_date, "YYYY-MM-DD HH:mm:ss").format('YYYYMMDDHHmmss'); //订单时间，格式为YYYYMMDDhhmmss
        let phoneNo = this.state.tel;    //手机号
        let txnAmt = this.state.order.order_amount; //订单金额

        let key = Global.PaymentKey;
        let str = key + orderId + txnTime;
        str = MD5(str);

        let url = `${Global.ServerUrl}?act=app_pay&op=smsConsume`;
        let options = {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: Global.toQueryString({
                accNo,
                orderId,
                txnTime,
                phoneNo,
                txnAmt,
                str,
            })
        };
        try {
            let responseData = await this.request(url, options);
            if (!responseData.success) {
                this.toast(responseData.message || '验证码发送失败，请重试');
                return false;
            }
            this.toast('验证码发送成功，请注意查收');
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

    async pay() {
        if (!this.state.cardObj || !this.state.cardObj.cardNo) {
            this.toast('请选择银行卡');
            return false;
        }
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
        // if (this.state.verificationTel == null) {
        //     this.toast('请先获取验证码');
        //     return false;
        // }
        if (this.state.verificationTel != null && this.state.tel != this.state.verificationTel) {
            this.toast('您修改了手机号，请重新获取验证码');
            return false;
        }
        this.setState({
            nextBtnDisabled: true,
        });
        this.showLoading();

        let accNo = this.state.cardObj.cardNo;     //卡号
        let orderId = this.state.order.order_sn; //订单号
        let txnTime = moment(this.state.order.add_date, "YYYY-MM-DD HH:mm:ss").format('YYYYMMDDHHmmss'); //订单时间，格式为YYYYMMDDhhmmss
        let phoneNo = this.state.tel;    //手机号
        let txnAmt = this.state.order.order_amount; //订单金额
        let pay_sn = this.state.order.pay_sn;  //支付单号
        let smsCode = this.state.verificationCode;             //验证码

        let key = Global.PaymentKey;
        let str = key + orderId + txnTime;
        str = MD5(str);

        let url = `${Global.ServerUrl}?act=app_pay&op=consume`;
        let options = {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: Global.toQueryString({
                accNo,
                orderId,
                txnTime,
                phoneNo,
                txnAmt,
                str,
                pay_sn,
                smsCode,
            })
        };
        try {
            let responseData = await this.request(url, options);
            this.setState({nextBtnDisabled: false});
            if (!responseData.success) {
                this.toast(responseData.message || '支付失败，请重试');
                return false;
            }
            this.props.navigator.replace({
                component: PaymentSuccess,
                hideNavBar: true,
                passProps: {
                    orderId: this.state.order.order_id,
                },
            });
        } catch (e) {
            this.setState({nextBtnDisabled: false});
            this.handleRequestException(e);
        }
    }

    _getNavBar () {
        return (
            <NavBar title='订单信息'
                navigator={this.props.navigator}
                route={this.props.route}
                hideBackButton={false}
                hideBottomLine={false}
            />
        );
    }
    _getOrder() {
        let goodsCount = 0;
        if (this.state.order.extend_order_goods) {
            for (let item of this.state.order.extend_order_goods) {
                goodsCount += Number(item.goods_num);
            }
        }
        return (
            <View style={styles.item}>
                <View style={styles.itemHead}>
                    <Text style={styles.itemHeadLeft}>订单号：{this.state.order.order_sn}</Text>
                    <Text style={styles.itemHeadRight}>{this.state.order.add_date}</Text>
                </View>
                {this.renderGoodsList()}
                <View style={styles.itemBottom}>
                    <View style={styles.itemBottomLeft}>
                        <Text style={styles.itemNum}>共{goodsCount}件</Text>
                        <View style={styles.itemPay}>
                            <Text style={styles.itemPayLabel}>订单金额：</Text>
                            <Text style={styles.itemPayAmount}>￥{this.state.order.order_amount}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    renderGoodsList() {
        if (!this.state.order || !this.state.order.extend_order_goods
            || this.state.order.extend_order_goods.length == 0)
            return null;
        let arr = [];
        for (let goods of this.state.order.extend_order_goods) {
            if (!goods)
                continue;
            arr.push(
                <View style={styles.itemBody}>
                    <View style={styles.itemBodyLeft}>
                        <Image
                            style={styles.itemImg}
                            source={{uri: goods.goods_image}}
                        />
                    </View>
                    <View style={styles.itemBodyCenter}>
                        <Text style={styles.itemTitle}
                            numberOfLines={1}
                        >
                            {goods.goods_name}
                        </Text>
                        <Text style={styles.itemPrice}>
                            ￥{goods.goods_price}
                        </Text>
                    </View>
                </View>
            );
        }
        return arr;
    }

    _getVerification(){
        return(
            <View style={styles.center}>
                    <View style={styles.formItem}>
                        <Text style={styles.label}>手机号</Text>
                        <TextInput
                            style={styles.input}
                            underlineColorAndroid="transparent"
                            placeholder="请输入银行预留手机号"
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
                        onPress={this.pay.bind(this)}>
                        <Text style={styles.btnTxt}>确认付款</Text>
                    </TouchableOpacity>
                </View>
        );
    }
    _getCard(){
        return(
            <View style={styles.continer}>
                    <TouchableOpacity style={styles.menu} onPress={()=>this._selectCard()}>
                        <View style={styles.menuLeft}>
                            <Text style={styles.menuText}>{this.state.bankName}</Text>
                        </View>
                        <View style={styles.menuCenter}>
                                <Text style={styles.menuCenterText}>{this.state.cardNo}</Text>
                        </View>
                        <View style={styles.menuRight}>
                            <Image style={styles.menuRightImage} source={require('../images/shop_center_right.png')} />
                        </View>
                    </TouchableOpacity>
             </View>
        );
    }
    _selectCard(){
          this.props.navigator.push({
            component: CardList,
            hideNavBar: true,
            passProps: {
                bindCard: this.bindCard.bind(this),
            }
        });
    }

    render () {
        return (
            <View style = {Global._styles.CONTAINER} >
                {this._getNavBar()}
                {this._getOrder()}
                {this._getCard()}
                {this._getVerification()}
            </View>
        );
    }

   

}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    item: {
        marginBottom: 10,
        borderTopColor: '#dcdce1',
        borderTopWidth: 1 / Global._pixelRatio,
        borderBottomColor: '#dcdce1',
        borderBottomWidth: 1 / Global._pixelRatio,
        backgroundColor: '#fff',
    },
    itemHead: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 48,
        paddingLeft: 16,
        paddingRight: 16,
        borderBottomColor: Global.Color.LIGHT_GRAY,
        borderBottomWidth: 1 / Global._pixelRatio,
    },
    itemHeadLeft: {
        fontSize: Global.FontSize.BASE,
        color: Global.Color.DARK_GRAY,
    },
    itemHeadRight: {
        fontSize: Global.FontSize.SMALL,
        color: Global.Color.GRAY,
    },
    itemBody: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 16,
        paddingBottom: 16,
        borderBottomColor: Global.Color.LIGHT_GRAY,
        borderBottomWidth: 1 / Global._pixelRatio,
    },
    itemBodyLeft: {
        paddingLeft: 16,
    },
    itemBodyCenter: {
        paddingLeft: 16,
        flex: 1,
    },
    itemBodyRight: {
        paddingLeft: 16,
        paddingRight: 16,
        alignItems: 'center',
    },
    itemBodyLeftMain: {
        flex: 1,
        flexDirection: 'row',
    },
    itemBodyLeftImg: {
        flex: 1,
    },
    itemImg: {
        width: 40,
        height: 40,
        resizeMode: 'cover',
    },
    itemTitle: {
        fontSize: Global.FontSize.BASE,
        color: Global.Color.DARK_GRAY,
    },
    itemPrice: {
        marginTop: 5,
        fontSize: Global.FontSize.SMALL,
        color: Global.Color.DARK_GRAY,
    },
    itemBottom: {
        flexDirection: 'row',
        height: 48,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 16,
        paddingRight: 16,
        borderTopColor: Global.Color.LIGHT_GRAY,
        borderTopWidth: 1 / Global._pixelRatio,
    },
    itemBottomLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemBottomRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemNum: {
        fontSize: Global.FontSize.SMALL,
        color: Global.Color.DARK_GRAY,
    },
    itemPay: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemPayLabel: {
        alignItems: 'center',
        marginLeft: 5,
        fontSize: Global.FontSize.SMALL,
        color: Global.Color.DARK_GRAY,
    },
    itemPayAmount: {
        fontSize: Global.FontSize.BASE,
        color: Global.Color.DARK_GRAY,
    },
    state: {
        fontSize: Global.FontSize.BASE,
        color: Global.Color.RED,
    },
    footer: {
        height: 50,
    },
    rightImg: {
        width: 10,
        height: 18,
        resizeMode: 'contain',
    },
    container: {
        flex: 1,
        backgroundColor: Global.Color.LIGHTER_GRAY,
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
        borderLeftColor: Global.Color.LIGHT_GRAY,
        borderLeftWidth: 1 / Global._pixelRatio,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rightBtnTxt: {
        color: Global.Color.DARK_GRAY,
        fontSize: Global.FontSize.BASE,
    },
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
    continer: {
        borderColor: '#dcdce1',
        borderWidth: 1 / Global._pixelRatio,
        backgroundColor: '#fff',
    },
    menu:{
        flex:1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
    },
    menuLeft:{
        flex:1,
        justifyContent:'flex-start',
        alignItems: 'center',
        paddingLeft:16,
        margin:0,
    },
    menuText:{
        fontSize: Global.FontSize.BASE,
        color: Global.Color.DARK_GRAY,
    },
    menuCenter:{
        flex:4,
        justifyContent:'flex-start',
    },
    menuCenterText:{
        fontSize: Global.FontSize.BASE,
        color: Global.Color.GRAY,
        paddingLeft:20,
    },
    menuRight:{
         flex:1,
         justifyContent:'flex-end',
         alignItems: 'center',
    },
    menuRightImage:{
        height:16,
        margin:0,
        paddingRight:16, 
    }
});

export default Defray;