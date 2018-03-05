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
    Alert,
} from 'react-native';

import NavBar       from '../common/TopNavBar';
import Button       from 'rn-easy-button';
import Separator    from 'rn-easy-separator';
import * as Global  from '../../Global';
import Defray       from '../payment/Defray';

class OrderDetail extends Component {

    static displayName = 'OrderDetail';
    static description = '订单详情';

    static propTypes = {};

    static defaultProps = {};

    state = {
        doRenderScene: false,
        order: {}
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({doRenderScene: true}, () => {
                this.getOrderData();
            });
        });
        let routers = this.props.navigator.getCurrentRoutes();
		let curRouter =  routers[routers.length - 1];
		curRouter.pullToRefresh = this.getOrderData.bind(this);
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

    changeOrder(stateType) {
        let actionName = null;
        if (stateType == 'order_delete') {
            actionName = '删除订单';
        } else if (stateType == 'order_cancel') {
            actionName = '取消订单';
        } else if (stateType == 'order_receive') {
            actionName = '确认收货';
        }
        Alert.alert(
            null,
            `是否要${actionName}？`,
            [
                {
                    text: '取消',
                    onPress: () => {
                    }
                },
                {
                    text: '确认',
                    onPress: () => {
                        this.changeOrderSubmit(stateType, actionName);
                    }
                },
            ]
        );
    }

    async changeOrderSubmit(stateType, actionName) {
        let orderId = this.props.orderId;
        let url = `${Global.ServerUrl}?act=app&op=changeState&state_type=${stateType}&order_id=${orderId}`;
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
            this.toast(`${actionName}成功`);
            if (stateType == 'order_delete') {
                this.props.navigator.pop();
            } else {
                this.getOrderData();
            }
            //this.props.refreshFn && this.props.refreshFn();
        } catch (e) {
            this.handleRequestException(e);
        }
    }

    payOrder() {
        this.props.navigator.push({
            component: Defray,
            hideNavBar: true,
            passProps: {
                orderId: this.state.order.order_id,
            }
        });
    }

    render() {
        if (!this.state.doRenderScene)
            return this._renderPlaceholderView();

        return (
            <View style={Global._styles.CONTAINER}>
                {this._getNavBar()}
                <ScrollView style={styles.scrollView}>
                    <View style={styles.item}>
                        <View style={styles.head}>
                            <Text style={styles.headLeft}>订单编号：{this.state.order.order_sn}</Text>
                            <Text style={styles.headRight}>
                                {Global.getOrderStateTxt(this.state.order.order_state)}
                            </Text>
                        </View>
                        {this.renderAddress()}
                        {this.renderGoodsList()}
                        <View style={styles.order}>
                            <Text style={styles.orderItem}>商品总价：￥{this.state.order.goods_amount}</Text>
                            <Text style={styles.orderItem}>运费：￥{this.state.order.shipping_fee}</Text>
                            <Text style={styles.orderItem}>订单金额：￥{this.state.order.order_amount}</Text>
                            <Text style={styles.orderItem}>下单时间：{this.state.order.add_date}</Text>
                            {
                                ['20', '30', '40'].indexOf(this.state.order.order_state) == -1 ? null :
                                    <Text style={styles.orderItem}>
                                        付款时间：{this.state.order.payment_date == "0" ? null : this.state.order.payment_date}
                                    </Text>
                            }
                            {
                                ['40'].indexOf(this.state.order.order_state) == -1 ? null :
                                    <Text style={styles.orderItem}>
                                        完成时间：{this.state.order.finnshed_date == "0" ? null : this.state.order.payment_date}
                                    </Text>
                            }
                            {
                                ['30', '40'].indexOf(this.state.order.order_state) == -1 ? null :
                                    <Text style={styles.orderItem}>物流单号：{this.state.order.shipping_code}</Text>
                            }
                        </View>
                    </View>
                    <View style={styles.buttons}>
                        {
                            this.state.order.order_state != '0' ? null :
                                <Button style={styles.btn} text="删除订单" onPress={() => this.changeOrder('order_delete')}/>
                        }
                        {
                            this.state.order.order_state != '10' ? null :
                                <View style={{flexDirection: 'row', flex: 1}}>
                                    <Button style={styles.btn} text="取消订单" onPress={() => this.changeOrder('order_cancel')}/>
                                    <Separator width={10}/>
                                    <Button style={styles.payBtn} text="去支付" onPress={() => this.payOrder()}/>
                                </View>
                        }
                        {
                            this.state.order.order_state != '30' ? null :
                                <Button style={styles.btn} text="确认收货" onPress={() => this.changeOrder('order_receive')}/>
                        }
                    </View>
                </ScrollView>
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
            <NavBar title='订单详情'
                navigator={this.props.navigator}
                route={this.props.route}
                hideBackButton={false}
                hideBottomLine={false}/>
        );
    }

    renderAddress() {
        if (!this.state.order || !this.state.order.extend_order_common)
            return null;
        return (
            <View style={styles.address}>
                <View style={styles.addressTop}>
                    <Text style={styles.addressItem}>
                        {this.state.order.extend_order_common.reciver_name}
                    </Text>
                    <Text style={styles.addressItem}>
                        {this.state.order.extend_order_common.reciver_info.phone}
                    </Text>
                </View>
                <Text style={styles.addressBottom}>
                    {this.state.order.extend_order_common.reciver_info.address}
                </Text>
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
                <View style={styles.goods}>
                    <Image
                        style={styles.goodsImg}
                        source={{uri: goods.goods_image}}
                    />
                    <View style={styles.goodsMain}>
                        <Text style={styles.goodsName}
                            numberOfLines={1}
                        >
                            {goods.goods_name}
                        </Text>
                        <Text style={styles.goodsPrice}>￥{goods.goods_price}</Text>
                        <Text style={styles.goodsNum}>×{goods.goods_num}</Text>
                    </View>
                </View>
            );
        }
        return arr;
    }

}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    item: {
        marginTop: 10,
        borderTopColor: '#dcdce1',
        borderTopWidth: 1 / Global._pixelRatio,
        borderBottomColor: '#dcdce1',
        borderBottomWidth: 1 / Global._pixelRatio,
        backgroundColor: '#fff',
    },
    head: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 48,
        paddingLeft: 16,
        paddingRight: 16,
        borderBottomColor: Global.Color.LIGHT_GRAY,
        borderBottomWidth: 1 / Global._pixelRatio,
    },
    headLeft: {
        fontSize: Global.FontSize.BASE,
        color: Global.Color.DARK_GRAY,
    },
    headRight: {
        fontSize: Global.FontSize.BASE,
        color: Global.Color.RED,
    },
    goods: {
        flexDirection: 'row',
        padding: 16,
        borderBottomColor: Global.Color.LIGHT_GRAY,
        borderBottomWidth: 1 / Global._pixelRatio,
    },
    goodsImg: {
        width: 40,
        height: 40,
        resizeMode: 'cover',
    },
    goodsMain: {
        flex: 1,
        marginLeft: 10,
    },
    goodsName: {
        fontSize: Global.FontSize.BASE,
        color: Global.Color.DARK_GRAY,
    },
    goodsPrice: {
        marginTop: 1,
        fontSize: Global.FontSize.BASE,
        color: Global.Color.DARK_GRAY,
    },
    goodsNum: {
        marginTop: 1,
        fontSize: Global.FontSize.SMALL,
        color: Global.Color.DARK_GRAY,
    },
    order: {
        paddingTop: 6,
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 15,
        borderBottomColor: Global.Color.LIGHT_GRAY,
        borderBottomWidth: 1 / Global._pixelRatio,
    },
    orderItem: {
        marginTop: 10,
        fontSize: 12,
        color: Global.Color.DARK_GRAY,
    },
    buttons: {
        flexDirection: 'row',
        padding: 16,
        paddingTop: 40,
    },
    payBtn: {
        backgroundColor: Global.Color.RED,
        height: 48,
        borderWidth: 0,
    },
    address: {
        padding: 16,
        borderBottomColor: Global.Color.LIGHT_GRAY,
        borderBottomWidth: 1 / Global._pixelRatio,
    },
    addressTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    addressItem: {
        fontSize: Global.FontSize.BASE,
        color: Global.Color.DARK_GRAY,
    },
    addressBottom: {
        marginTop: 5,
        fontSize: Global.FontSize.SMALL,
        color: Global.Color.DARK_GRAY,
    },
    btn: {
        height: 48,
    },
});

export default OrderDetail;



