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

import Swiper       from 'react-native-swiper';
import EasyIcon     from 'rn-easy-icon';
import NavBar       from 'rn-easy-navbar';
import Button       from 'rn-easy-button';
import Separator    from 'rn-easy-separator';
import * as Global  from '../../Global';
import * as ShopUtil from '../util/ShopUtil';
import BottomNavBar from '../common/NavBar';

class OrderDetail extends Component {

    static displayName = 'OrderDetail';
    static description = '订单详情';

    static propTypes = {
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,
		order: {}
	};

    constructor (props) {
        super(props);
    }

	componentDidMount () {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true}, () => {
			    this.getOrderData();
			});
		});
	}
	
	async getOrderData() {
	    let orderId = this.props.orderId;
	    let url = `${ShopUtil.ServerUrl}?act=app&op=showOrder&order_id=${orderId}`;
	    let options = {
            method: "GET"
	    };
        try {
            let responseData = await this.request(url, options);
            if(!responseData)
                return false;
            if(!responseData.success) {
                this.toast(responseData.message);
                return false;
            }
            if(!responseData.root)
                return false;
            this.setState({
                doRenderScene: true,
                order: responseData.root,
            });
        } catch(e) {
            this.handleRequestException(e);
        }
    }
	
	changeOrder(stateType) {
	    let actionName = null;
	    if(stateType == 'order_delete') {
	        actionName = '删除订单';
	    } else if(stateType == 'order_cancel') {
	        actionName = '取消订单';
        } else if(stateType == 'order_receive') {
            actionName = '确认收货';
        }
	    Alert.alert(
            null,
            `是否要${actionName}？`,
            [
                {
                    text: '取消',
                    onPress: () => {}
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
        let url = `${ShopUtil.ServerUrl}?act=app&op=changeState&state_type=${stateType}&order_id=${orderId}`;
        let options = {
            method: "GET"
        };
        try {
            let responseData = await this.request(url, options);
            if(!responseData)
                return false;
            if(!responseData.success) {
                this.toast(responseData.message);
                return false;
            }
            this.toast(`${actionName}成功`);
            if (stateType == 'order_delete') {
    	        this.props.navigator.pop();
    	    } else {
    	    	this.getOrderData();
    	    }
          this.props.refreshFn && this.props.refreshFn();
        } catch(e) {
            this.handleRequestException(e);
        }
	}
	
	payOrder() {
		//TODO 去支付
	}
	
	render () {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		return (
			<View style = {Global._styles.CONTAINER} >
				{this._getNavBar()}
				<ScrollView style = {styles.scrollView} >
			        <View style={styles.head}>
			            <Text>订单编号：{this.state.order.order_sn}</Text>
			            <Text>{ShopUtil.getOrderStateTxt(this.state.order.order_state)}</Text>
			        </View>
			        {this.renderAddress()}
			        {this.renderGoodsList()}
                    <View style={styles.order}>
                        <Text style={styles.orderItem}>商品总价：￥{this.state.order.goods_amount}</Text>
                        <Text style={styles.orderItem}>运费：￥{this.state.order.shipping_fee}</Text>
                        <Text style={styles.orderItem}>订单金额：￥{this.state.order.order_amount}</Text>
                        <Text style={styles.orderItem}>下单时间：{this.state.order.add_date}</Text>
                        <Text style={styles.orderItem}>付款时间：{this.state.order.payment_date == "0" ? null : this.state.order.payment_date}</Text>
                        <Text style={styles.orderItem}>完成时间：{this.state.order.finnshed_date == "0" ? null : this.state.order.payment_date}</Text>
                        <Text style={styles.orderItem}>物流单号：{this.state.order.shipping_code}</Text>
                    </View>
                    <View style={styles.buttons}>
                        {
                            this.state.order.order_state != '0' ? null :
                            <Button text = "删除订单" onPress = {() => this.changeOrder('order_delete')} />
                        }
                        {
                            this.state.order.order_state != '10' ? null :
                            <View style={{flexDirection: 'row', flex: 1}}>
	                            <Button text = "取消订单" onPress = {() => this.changeOrder('order_cancel')} />
	                            <Separator width={10} />
	                            <Button text = "去支付" onPress = {() => this.payOrder()} />
	                        </View>
                        }
                        {
                            this.state.order.order_state != '30' ? null :
                            <Button text = "确认收货" onPress = {() => this.changeOrder('order_receive')} />
                        }
                    </View>
				</ScrollView>
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
			<NavBar title = '订单详情' 
		    	navigator = {this.props.navigator} 
				route = {this.props.route}
		    	hideBackButton = {false} 
		    	hideBottomLine = {false} />
		);
	}
	
	renderAddress() {
        if (!this.state.order || !this.state.order.extend_order_common)
            return null;
        return (
            <View style={styles.order}>
                <Text style={styles.orderItem}>收货人：{this.state.order.extend_order_common.reciver_name}，{this.state.order.extend_order_common.reciver_info.phone}</Text>
                <Text style={styles.orderItem}>收货地址：{this.state.order.extend_order_common.reciver_info.address}</Text>
            </View>                
        );
	}
	
	renderGoodsList() {
        if (!this.state.order || !this.state.order.extend_order_goods
            || this.state.order.extend_order_goods.length == 0)
            return null;
        let arr = [];
        for(let goods of this.state.order.extend_order_goods) {
            if(!goods)
                continue;
            arr.push(
                <View style={styles.goods}>
                    <Image
                        style={styles.goodsImg}
                        source={{uri: goods.goods_image}}
                    />
                    <View style={styles.goodsMain}>
                        <Text>{goods.goods_name}</Text>
                    </View>
                    <View style={styles.goodsRight}>
                        <Text>￥{goods.goods_price}</Text>
                        <Text>*{goods.goods_num}</Text>
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
	head: {
	    flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 45,
        paddingLeft: 15,
        paddingRight: 15,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
	},
	goods: {
	    flexDirection: 'row',
        padding: 15,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
	},
	goodsImg: {
	    width: 100,
        height: 100,
        resizeMode: 'cover',
	},
	goodsMain: {
	    flex: 2,
	    marginLeft: 10,
	},
	goodsRight: {
	    flex: 1,
	    marginLeft: 10,
	    alignItems: 'flex-end',
	},
	order: {
	    paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 15,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
	},
	orderItem: {
	    marginTop: 15,
	},
	buttons: {
        flexDirection: 'row',
        padding: 15,
	},
});

export default OrderDetail;



