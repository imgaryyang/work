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
} from 'react-native';

import EasyIcon     from 'rn-easy-icon';
import NavBar       from 'rn-easy-navbar';
import Button       from 'rn-easy-button';
import * as Global  from '../../Global';
import * as ShopUtil from '../util/ShopUtil';
import BottomNavBar from '../common/NavBar';
import OrderDetail  from './OrderDetail';

class OrderList extends Component {

    static displayName = 'OrderList';
    static description = '我的订单';

    static propTypes = {
    };

    static defaultProps = {
    };

    rowIds = [];
    
	state = {
		doRenderScene: false,
		dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        }),
        pageSize: 10,
        pageNum:1,
        typeId:309,
        totalPage: 0,
        noMoreData: false,
        loading: false,
        _pullToRefreshing: false,//控制下拉刷新
	};

    constructor (props) {
        super(props);
        
        this.pullToRefresh          = this.pullToRefresh.bind(this);
        this.getListData            = this.getListData.bind(this);
        this.renderRow              = this.renderRow.bind(this);
        this.renderFooter           = this.renderFooter.bind(this);
        this.onEndReached           = this.onEndReached.bind(this);
    }

	componentDidMount () {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true}, () => {
			    this.getListData();
			});
		});
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
            if(this.state.loading){
                return;
            } else {
                this.state.loading = true;
            }
            let url = `${ShopUtil.ServerUrl}?act=app&op=order&state_type=${orderType}&curpage=${this.state.pageNum}`;
            let options = {
                method: "GET"
            };
            let responseData = await this.request(url, options);
            if(!responseData)
                return false;
            if(!responseData.success) {
                this.toast(responseData.message);
                return false;
            }
            if(!responseData.root)
                return false;
            this.rowIds.push(...responseData.root.list);

            this.setState({
                totalPage: responseData.root.page_num,
                dataSource: this.state.dataSource.cloneWithRows(this.rowIds),
                noMoreData: responseData.root.page_num <= this.state.pageNum,
                loading: false,
                _pullToRefreshing:false,
            });
        } catch(e) {
            this.handleRequestException(e);
        }
    }
	
	/**
     * 下拉刷新
     */
    pullToRefresh () {
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
    onEndReached () {
        if(this.state.loading || this.state._pullToRefreshing || this.state.noMoreData)
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
    renderFooter () {
        let footerText = !this.state.loading && !this.state._pullToRefreshing && this.state.noMoreData
            ? '数据载入完成' : '载入数据……';
        return (
            <View style={[Global._styles.CENTER, styles.footer]} >
                <Text style={styles.footerText} >{footerText}</Text>
            </View>
        );
    }
	
	toOrderDetail(orderId) {
	    this.props.navigator.push({
            component: OrderDetail,
            hideNavBar: true,
            passProps: {
                orderId: orderId,
                refreshFn: this.pullToRefresh,
            },
        });
	}
	
	render () {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		return (
			<View style = {Global._styles.CONTAINER} >
				{this._getNavBar()}
				<ScrollView style = {styles.scrollView} >
    				<ListView
                        automaticallyAdjustContentInsets = {false}
                        dataSource = {this.state.dataSource}
                        renderRow = {this.renderRow}
                        renderFooter = {this.renderFooter}
                        onEndReached = {this.onEndReached}
                        onEndReachedThreshold = {10}
                        style = {[styles.list]}
                        refreshControl = {
                            <RefreshControl
                                refreshing = {this.state._pullToRefreshing}
                                onRefresh = {this.pullToRefresh}
                            />
                        }
                    />
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
			<NavBar title = '我的订单' 
		    	navigator = {this.props.navigator} 
				route = {this.props.route}
		    	hideBackButton = {false} 
		    	hideBottomLine = {false} />
		);
	}
	
	renderRow(rowData) {
		let goodsCount = 0;
		if(rowData.extend_order_goods){
			for(let item of rowData.extend_order_goods){
				goodsCount += Number(item.goods_num);
			}
		}
	    return (
	        <TouchableOpacity style={styles.item} 
	            onPress={() => this.toOrderDetail(rowData.order_id)}
	        >
    	        <View style={styles.itemHead}>
                    <Text>订单号：{rowData.order_sn}</Text>
                    <Text>{rowData.add_date}</Text>
                </View>
                <View style={styles.itemBody}>
                    <View style={styles.itemBodyLeft}>
                        <View style={styles.itemBodyLeftMain}>
                            <View style={styles.itemBodyLeftImg}>
                                <Image
                                    style={styles.itemImg}
                                    source={{uri: rowData.extend_order_goods[0].goods_image}}
                                />
                            </View>
                            <Text style={styles.itemTitle}>{rowData.extend_order_goods[0].goods_name}</Text>
                        </View>
                        <View style={styles.itemBottom}>
                            <Text>共{goodsCount}件</Text>
                            <Text style={styles.itemPay}>订单金额：￥{rowData.order_amount}</Text>
                        </View>
                        <View style={styles.itemBottom}>
                            <Text style={styles.state}>{ShopUtil.getOrderStateTxt(rowData.order_state)}</Text>
                        </View>
                    </View>
                    <View style={styles.itemBodyRight}>
                        <EasyIcon color="#ccc" name="ios-arrow-forward" size={25} />
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
	    marginTop: 15,
	    paddingBottom: 15,
	    borderBottomColor: '#ccc',
        borderBottomWidth: 1,
	},
	itemHead: {
	    flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 45,
        paddingLeft: 5,
        paddingRight: 15,
        borderColor: '#ccc',
        borderWidth: 1,
        borderLeftColor: '#4CD964',
        borderLeftWidth: 5,
	},
	itemBody: {
	    flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 15,
	},
	itemBodyLeft: {
	    flex: 1,
	    paddingLeft: 15,
	},
	itemBodyRight: {
	    width: 40,
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
	    width: (Global._screen.width - 55) / 3,
	    height: (Global._screen.width - 55) / 3,
	    resizeMode: 'contain',
	},
	itemTitle: {
	    flex: 2,
	    marginLeft: 15,
	},
	itemBottom: {
	    marginTop: 10,
	    flexDirection: 'row',
	},
	itemPay: {
	    marginLeft: 15,
	},
	state: {
		color: '#4CD964',
	},
	footer: {
        height: 50,
    },
});

export default OrderList;



