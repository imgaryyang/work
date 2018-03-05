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
    Alert,
} from 'react-native';

import * as Global  from '../../Global';
import NavBar       from '../common/TopNavBar';
import Checkbox from '../common/Checkbox';
import Message from '../common/Message';
import GoodsDetail from '../goods/GoodDetail';
import Order from '../goods/Order';
import ShopAction   from '../../flux/ShopAction';
import ShopStore   from '../../flux/ShopStore';

class List extends Component {

    static displayName = 'ShoppingCart';
    static description = '购物车';

    static propTypes = {};

    static defaultProps = {};

    state = {
        doRenderScene: false,
        loading: true,
        delBtnDisabled: true,
        list: null,
        checkedAll: false,
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({doRenderScene: true}, () => {
                this.getListData();
            });
        });
        ShopStore.listen(this.onShoppingCartChange.bind(this));
    }

    onShoppingCartChange(num) {
		this.getListData();
	}

    async getListData() {
        this.showLoading();
        let url = `${Global.ServerUrl}?act=interface_app&op=cartlist&user_id=6`;
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
            this.hideLoading();
            this.setState({
                loading: false,
                list: responseData.root,
            });
        } catch (e) {
            this.handleRequestException(e);
        }
    }

    async updateGoods(id, num, i) {
        let url = `${Global.ServerUrl}?act=interface_app&op=update&cart_id=${id}&quantity=${num}&user_id=6`;
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
            this.state.list[i].goods_num = num;
            this.setState({
                list: this.state.list,
            });
            this.updateShoppingCartNum();
        } catch (e) {
            this.handleRequestException(e);
        }
    }

    async deleteGoods(id) {
        let url = `${Global.ServerUrl}?act=interface_app&op=del&cart_id=${id}&user_id=6`;
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
            this.state.list.forEach((v, i) => {
                if (v.cart_id == id) {
                    this.state.list.splice(i, 1);
                }
            });
            this.setState({
                list: this.state.list,
                delBtnDisabled: true,
            });
            this.toast('删除成功');
            this.updateShoppingCartNum();
        } catch (e) {
            this.handleRequestException(e);
        }
    }

    submit() {
        let selectedGoods = [];
        if (!this.state.list || this.state.list.length == 0)
            return false;
        for (let goods of this.state.list) {
            if (!goods.checked)
                continue;
            selectedGoods.push(goods);
        }
        if (selectedGoods.length == 0) {
            this.toast('请选择商品');
            return false;
        }
        this.props.navigator.push({
            component: Order,
            hideNavBar: true,
            passProps: {
                goods: selectedGoods,
                from: 'cart',
            },
        });
    }

    onDelete() {
        let selectedGoods = [];
        if (!this.state.list || this.state.list.length == 0)
            return false;
        for (let goods of this.state.list) {
            if (!goods.checked)
                continue;
            selectedGoods.push(goods);
        }
        if (selectedGoods.length == 0) {
            this.toast('请选择商品');
            return false;
        }
        this.state.list.forEach((v, i) => {
            if (v.checked) {
                this.deleteGoods(v.cart_id);
            }
        });
    }

    updateShoppingCartNum() {
        let num = 0;
        for (let item of this.state.list) {
            num += Number(item.goods_num);
        }
        ShopAction.onShoppingCartNumReset(num);
    }

    onCheckAll(checked) {
        for (let item of this.state.list) {
            item.checked = checked;
        }
        this.setState({
            checkedAll: checked,
            list: this.state.list,
            delBtnDisabled: checked ? false : true,
        });
    }

    onCheckItem(checked, index) {
        this.state.list[index].checked = checked;
        let count = 0;
        for (let item of this.state.list) {
            if (item.checked)
                count++;
        }
        if (count > 0)
            this.state.delBtnDisabled = false;
        this.setState({
            checkedAll: count == this.state.list.length ? true : false,
            delBtnDisabled: count > 0 ? false : true,
        });
    }

    onGoodsNumSub(i) {
        let numStr = this.state.list[i].goods_num;
        let num = isNaN(Number(numStr)) ? 1 : Number(numStr);
        if (num == 1)
            return false;
        num--;
        this.updateGoods(this.state.list[i].cart_id, num, i);
    }

    onGoodsNumAdd(i) {
        let numStr = this.state.list[i].goods_num;
        let num = isNaN(Number(numStr)) ? 1 : Number(numStr);
        if (++num <= 0)
            num = 1;
        this.updateGoods(this.state.list[i].cart_id, num, i);
    }

    toGoodsDetail(id) {
        this.props.navigator.push({
            component: GoodsDetail,
            hideNavBar: true,
            passProps: {
                id: id,
            },
        });
    }

    render() {
        if (!this.state.doRenderScene)
            return this._renderPlaceholderView();

        let totalAmount = 0;
        if (this.state.list) {
            for (let item of this.state.list) {
                let price = Global.accMul(item.goods_price, item.goods_num);
                totalAmount = Global.floatAdd(totalAmount, price);
                totalAmount = totalAmount.toFixed(2);
            }
        }
        let delImgSource = this.state.delBtnDisabled ?
            require('../images/shoppingcart_del_disabled.png') :
            require('../images/shoppingcart_del.png');
        let delTxtStyle = [styles.delTxt];
        if (this.state.delBtnDisabled) {
            delTxtStyle.push(styles.delTxtDiabled);
        }

        return (
            <View style={Global._styles.CONTAINER}>
                {this._getNavBar()}
                <ScrollView style={styles.scrollView}>
                    {
                        (!this.state.list || this.state.list.length == 0) && !this.state.loading ?
                            <Message text="暂无数据"/> : null
                    }
                    {
                        !this.state.list || this.state.list.length == 0 ? null :
                            <View style={styles.main}>
                                <View style={styles.head}>
                                    <TouchableOpacity onPress={() => this.onCheckAll(!this.state.checkedAll)}>
                                        <Checkbox
                                            label="全选"
                                            style={styles.checkbox}
                                            checked={this.state.checkedAll}
                                            onCheck={this.onCheckAll.bind(this)}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.delBtn}
                                        disabled={this.state.delBtnDisabled}
                                        onPress={this.onDelete.bind(this)}>
                                        <Image style={styles.delImg}
                                            source={delImgSource}
                                        />
                                        <Text style={delTxtStyle}>删除</Text>
                                    </TouchableOpacity>
                                </View>
                                {
                                    this.state.list.map((v, i) => {
                                        return this.renderRow(v, i);
                                    })
                                }
                            </View>
                    }
                </ScrollView>
                <View style={styles.bottomNav}>
                    <View style={styles.bottomNavLeft}>
                        <Text style={styles.settleAmount}>
                            合计：<Text style={styles.settleAmountNum}>￥{totalAmount}</Text>
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.bottomNavRight}
                        onPress={() => this.submit()}
                    >
                        <Text style={styles.settleBtnTxt}>结算</Text>
                    </TouchableOpacity>
                </View>
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
            <NavBar title='购物车'
                navigator={this.props.navigator}
                route={this.props.route}
                hideBackButton={false}
                hideBottomLine={false}
            />
        );
    }

    renderRow(v, i) {
        let itemStyle = [styles.item];
        if (v.checked) {
            itemStyle.push(styles.itemSelected);
        }
        return (
            <View style={itemStyle} key={i}>
                <View style={styles.itemCheck}>
                    <Checkbox
                        style={styles.checkbox}
                        checked={v.checked}
                        onCheck={(checked) => this.onCheckItem(checked, i)}
                    />
                </View>
                <TouchableOpacity
                    onPress={() => this.toGoodsDetail(v.goods_id)}
                >
                    <Image style={styles.goodsImg}
                        source={{uri: Global.ServerDomain + v.goods_image}}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.goodsParam}
                    onPress={() => this.toGoodsDetail(v.goods_id)}
                >
                    <Text numberOfLines={1}
                        style={styles.goodsNameTxt}
                    >
                        {v.goods_name}
                    </Text>
                    <Text style={styles.goodsPrice}>￥{v.goods_price}</Text>
                </TouchableOpacity>
                <View style={styles.goodsNumChange}>
                    <TouchableOpacity
                        style={styles.goodsNumChangeImg}
                        onPress={() => this.onGoodsNumSub(i)}
                    >
                        <Image style={styles.goodsNumSubImg}
                            source={require('../images/shoppingcart_sub.png')}
                        />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.goodsNumInput}
                        keyboardType="numeric"
                        value={String(v.goods_num)}
                        underlineColorAndroid="transparent"
                        onChangeText={(value) => {
                            this.state.list[i].goods_num = value;
                            this.setState({
                                list: this.state.list,
                            });
                        }}
                        onEndEditing={(value) => {
                            let num = this.state.list[i].goods_num;
                            if (num == '' || isNaN(Number(num)))
                                num = 1;
                            this.updateGoods(this.state.list[i].cart_id, num, i);
                        }}
                    />
                    <TouchableOpacity
                        style={styles.goodsNumChangeImg}
                        onPress={() => this.onGoodsNumAdd(i)}
                    >
                        <Image style={styles.goodsNumSubImg}
                            source={require('../images/shoppingcart_add.png')}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    main: {
        borderTopColor: '#dcdce1',
        borderTopWidth: 1 / Global._pixelRatio,
        borderBottomColor: '#dcdce1',
        borderBottomWidth: 1 / Global._pixelRatio,
    },
    head: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 6,
        paddingRight: 6,
        height: 46,
        backgroundColor: '#fff',
    },
    checkbox: {
        padding: 10,
    },
    item: {
        flexDirection: 'row',
        paddingTop: 16,
        paddingBottom: 16,
        borderTopColor: Global.Color.LIGHT_GRAY,
        borderTopWidth: 1 / Global._pixelRatio,
        backgroundColor: '#fff',
    },
    itemSelected: {
        backgroundColor: '#f5f5f4',
    },
    itemCheck: {
        justifyContent: 'center',
        paddingLeft: 6,
    },
    goodsImg: {
        width: 40,
        height: 40,
        resizeMode: 'cover',
    },
    goodsNameTxt: {
        fontSize: Global.FontSize.BASE,
        color: Global.Color.DARK_GRAY,
    },
    goodsPrice: {
        fontSize: Global.FontSize.SMALL,
        color: Global.Color.DARK_GRAY,
        marginTop: 3,
    },
    goodsParam: {
        flex: 1,
        marginLeft: 10,
    },
    goodsNumChange: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
        marginRight: 16,
    },
    goodsNumChangeImg: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    goodsNumInput: {
        width: 24,
        padding: 0,
        textAlign: 'center',
        fontSize: Global.FontSize.SMALL,
        color: Global.Color.DARK_GRAY,
    },
    bottomNav: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
    },
    bottomNavLeft: {
        flex: 2,
        justifyContent: 'center',
        paddingLeft: 16,
    },
    bottomNavRight: {
        flex: 1,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Global.Color.RED,
    },
    delBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    delImg: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
    },
    delTxt: {
        fontSize: Global.FontSize.BASE,
        color: Global.Color.DARK_GRAY,
        marginLeft: 10,
    },
    delTxtDiabled: {
        color: Global.Color.GRAY,
    },
    goodsNumSubImg: {
        width: 20,
        height: 20,
        resizeMode: 'cover',
    },
    goodsNumAddImg: {
        width: 20,
        height: 20,
        resizeMode: 'cover',
    },
    settleAmount: {
        fontSize: Global.FontSize.SMALL,
        color: Global.Color.DARK_GRAY,
    },
    settleAmountNum: {
        fontSize: Global.FontSize.BASE,
    },
    settleTxt: {
        fontSize: Global.FontSize.SMALL,
        color: Global.Color.DARK_GRAY,
        marginTop: 3,
    },
    settleBtnTxt: {
        fontSize: Global.FontSize.LARGE,
        color: '#fff',
    },
});

export default List;



