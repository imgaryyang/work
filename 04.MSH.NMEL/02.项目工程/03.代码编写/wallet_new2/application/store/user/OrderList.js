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
    ListView,
    RefreshControl,
    Dimensions,
} from 'react-native';

import NavBar       from '../common/TopNavBar';
import * as Global  from '../../Global';
import OrderDetail  from './OrderDetail';
import TopNavBarRightButtons from '../common/TopNavBarRightButtons';

class OrderList extends Component {

    static displayName = 'OrderList';
    static description = '我的订单';

    static propTypes = {};

    static defaultProps = {};

    rowIds = [];

    state = {
        doRenderScene: false,
        dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        }),
        pageSize: 10,
        pageNum: 1,
        typeId: 309,
        totalPage: 0,
        noMoreData: false,
        loading: false,
        _pullToRefreshing: false,//控制下拉刷新
    };

    constructor(props) {
        super(props);

        this.pullToRefresh = this.pullToRefresh.bind(this);
        this.getListData = this.getListData.bind(this);
        this.renderRow = this.renderRow.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
        this.onEndReached = this.onEndReached.bind(this);
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({doRenderScene: true}, () => {
                this.getListData();
            });
        });
        let routers = this.props.navigator.getCurrentRoutes();
		let curRouter =  routers[routers.length - 1];
		curRouter.pullToRefresh = this.pullToRefresh;
    }

    async getListData() {
        let orderStatus = this.props.orderStatus;
        let orderType = '';
        switch (orderStatus) {
            case '10':
                orderType = 'state_new';
                break;
            case '20':
                orderType = 'state_pay';
                break;
            case '30':
                orderType = 'state_send';
                break;
            case '40':
                orderType = 'state_success';
                break;
        }
        try {
            if (this.state.loading) {
                return;
            } else {
                this.state.loading = true;
            }
            let url = `${Global.ServerUrl}?act=app&op=order&state_type=${orderType}&curpage=${this.state.pageNum}`;
            let options = {
                method: "GET"
            };
            let responseData = await this.request(url, options);
            if (!responseData)
                return false;
            if (!responseData.success) {
                this.toast(responseData.message);
                return false;
            }
            if (!responseData.root)
                return false;
            this.rowIds.push(...responseData.root.list);

            this.setState({
                totalPage: responseData.root.page_num,
                dataSource: this.state.dataSource.cloneWithRows(this.rowIds),
                noMoreData: responseData.root.page_num <= this.state.pageNum,
                loading: false,
                _pullToRefreshing: false,
            });
        } catch (e) {
            this.handleRequestException(e);
        }
    }

    /**
     * 下拉刷新
     */
    pullToRefresh() {
        this.rowIds = [];
        this.setState({
            _pullToRefreshing: true,
            dataSource: this.state.dataSource.cloneWithRows(this.rowIds),
            totalPage: 0,
            pageNum: 1,
            noMoreData: false,
        }, () => {
            this.getListData();
        });
    }

    /**
     * 无限加载
     */
    onEndReached() {
        if (this.state.loading || this.state._pullToRefreshing || this.state.noMoreData)
            return;

        this.setState({
            pageNum: this.state.pageNum + 1
        }, () => {
            this.getListData();
        });
    }


    /**
     * 渲染列表表尾
     * 如果无限加载被触发，则显示loading，如果没有更多数据，则显示相关提示信息
     */
    renderFooter() {
        let footerText = !this.state.loading && !this.state._pullToRefreshing && this.state.noMoreData
            ? '数据载入完成' : '载入数据……';
        return (
            <View style={[Global._styles.CENTER, styles.footer]}>
                <Text style={styles.footerText}>{footerText}</Text>
            </View>
        );
    }

    toOrderDetail(orderId) {
        this.props.navigator.push({
            component: OrderDetail,
            hideNavBar: true,
            passProps: {
                orderId: orderId,
            },
        });
    }

    render() {
        if (!this.state.doRenderScene)
            return this._renderPlaceholderView();

        return (
            <View style={Global._styles.CONTAINER}>
                {this._getNavBar()}
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={this.state.dataSource}
                        renderRow={this.renderRow}
                        renderFooter={this.renderFooter}
                        onEndReached={this.onEndReached}
                        onEndReachedThreshold={10}
                        style={[styles.list]}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state._pullToRefreshing}
                                onRefresh={this.pullToRefresh}
                            />
                        }
                    />
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
            <NavBar title='我的订单'
                navigator={this.props.navigator}
                route={this.props.route}
                hideBackButton={false}
                hideBottomLine={false}
                rightButtons={(
                    <TopNavBarRightButtons
                        navigator={this.props.navigator}
                        showShoppingCart={true}
                    />
                )}
            />
        );
    }

    renderRow(rowData) {
        let goodsCount = 0;
        if (rowData.extend_order_goods) {
            for (let item of rowData.extend_order_goods) {
                goodsCount += Number(item.goods_num);
            }
        }
        return (
            <TouchableOpacity style={styles.item}
                onPress={() => this.toOrderDetail(rowData.order_id)}
            >
                <View style={styles.itemHead}>
                    <Text style={styles.itemHeadLeft}>订单号：{rowData.order_sn}</Text>
                    <Text style={styles.itemHeadRight}>{rowData.add_date}</Text>
                </View>
                <View style={styles.itemBody}>
                    <View style={styles.itemBodyLeft}>
                        <Image
                            style={styles.itemImg}
                            source={{uri: rowData.extend_order_goods[0].goods_image}}
                        />
                    </View>
                    <View style={styles.itemBodyCenter}>
                        <Text style={styles.itemTitle}
                            numberOfLines={1}
                        >
                            {rowData.extend_order_goods[0].goods_name}
                        </Text>
                        <Text style={styles.itemPrice}>
                            ￥{rowData.extend_order_goods[0].goods_price}
                        </Text>
                    </View>
                    <View style={styles.itemBodyRight}>
                        <Image style={styles.rightImg}
                            source={require('../images/shop_center_right.png')}
                        />
                    </View>
                </View>
                <View style={styles.itemBottom}>
                    <View style={styles.itemBottomLeft}>
                        <Text style={styles.itemNum}>共{goodsCount}件</Text>
                        <View style={styles.itemPay}>
                            <Text style={styles.itemPayLabel}>订单金额：</Text>
                            <Text style={styles.itemPayAmount}>￥{rowData.order_amount}</Text>
                        </View>
                    </View>
                    <View style={styles.itemBottomRight}>
                        <Text style={styles.state}>{Global.getOrderStateTxt(rowData.order_state)}</Text>
                    </View>
                </View>
            </TouchableOpacity>
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
});

export default OrderList;



