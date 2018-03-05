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
} from 'react-native';

import NavBar       from '../common/TopNavBar';
import * as Global  from '../../Global';
import OrderDetail    from '../user/OrderDetail';

class PaymentSuccess extends Component {

    static displayName = 'PaymentSuccess';
    static description = '支付成功';

    static propTypes = {};

    static defaultProps = {};

    state = {
        doRenderScene: false,
        order: {},
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

    toPage() {
        this.props.navigator.pop();
    }

    render() {
        if (!this.state.doRenderScene)
            return this._renderPlaceholderView();

        return (
            <View style={[Global._styles.CONTAINER, {backgroundColor: '#fff'}]}>
                {this._getNavBar()}
                <ScrollView style={styles.scrollView}>
                    <View style={styles.head}>
                        <Image style={styles.headImg}
                            source={require('../images/payment_success_head.jpg')}
                        />
                    </View>
                    <View style={styles.main}>
                        <Text style={styles.text1}>恭喜，您的订单支付成功</Text>
                        <Text style={styles.text2}>订单金额：{this.state.order.order_amount}元</Text>
                        <Text style={styles.text3}>订单号：{this.state.order.order_sn}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.btn}
                        onPress={this.toPage.bind(this)}>
                        <Text style={styles.btnTxt}>查看订单详情</Text>
                    </TouchableOpacity>
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
            <NavBar title='订单信息'
                navigator={this.props.navigator}
                route={this.props.route}
                hideBackButton={false}
                hideBottomLine={false}
            />
        );
    }

}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    head: {
        marginTop: 42,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headImg: {
        width: 298,
        height: 121,
        resizeMode: 'contain',
    },
    main: {
        marginTop: 30,
        alignItems: 'center',
    },
    text1: {
        fontSize: Global.FontSize.BASE,
        color: Global.Color.DARK_GRAY,
    },
    text2: {
        fontSize: Global.FontSize.SMALL,
        color: Global.Color.DARK_GRAY,
        marginTop: 20,
    },
    text3: {
        fontSize: Global.FontSize.SMALL,
        color: Global.Color.DARK_GRAY,
        marginTop: 10,
    },
    btn: {
        marginTop: 40,
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
});

export default PaymentSuccess;



