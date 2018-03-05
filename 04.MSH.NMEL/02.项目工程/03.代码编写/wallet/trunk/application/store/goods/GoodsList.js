/**
 * Created by liuyi on 2016/7/7.
 */
'use strict';

import React, {
    Component,
    PropTypes,
} from 'react';

import {
    Animated,
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

import * as Global  from '../../Global';
import * as ECGB    from '../util/ShopUtil';

import EasyIcon     from 'rn-easy-icon';
import NavBar       from 'rn-easy-navbar';

import GoodDetail 	from './GoodDetail';

// const FIND_URL = ECGB.ServerUrl+'?act=app&op=goods_list';
const FIND_URL = ECGB.ServerUrl+'?act=interface_app&op=goods_list';

class GoodsList extends Component {

    rowIds = [];

    static displayName = 'GoodsList';
    static description = '商品列表';

    state = {
        doRenderScene: false,
        dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        }),
        pageSize: 10,
        pageNum:1,
        total: 0,
        totalPage: 0,
        noMoreData: false,
        loading: false,
        _pullToRefreshing: false,//控制下拉刷新
    };

    constructor (props) {
        super(props);

        this.state.typeId = props.typeId,

        this.pullToRefresh 			= this.pullToRefresh.bind(this);
        this.fetchData 				= this.fetchData.bind(this);
        this.renderRow 				= this.renderRow.bind(this);
        this.renderFooter 			= this.renderFooter.bind(this);
        this.onEndReached 			= this.onEndReached.bind(this);
    }

    componentDidMount () {
        InteractionManager.runAfterInteractions(() => {
            this.setState({doRenderScene: true});
            this.fetchData();
        });
    }

    /**
     * 下拉刷新
     */
    pullToRefresh () {
        this.rowIds = [];
        this.setState({
            _pullToRefreshing: true,
            dataSource: this.state.dataSource.cloneWithRows(this.rowIds),
            total: 0,
            totalPage: 0,
            pageNum: 1,
            noMoreData: false,
        }, () => {
            this.fetchData();
        });
    }

    /**
     * 异步加载数据
     */
    async fetchData () {
        try {
            if(this.state.loading){
                return;
            } else {
                this.state.loading = true;
            }

            let responseData = await this.request(
                FIND_URL + '&cate_id='+this.state.typeId + '&curpage='+this.state.pageNum,
                { method : "GET" });

            this.rowIds.push(...responseData.root['Items']);

            this.setState({
                total: responseData.root.totnum,
                totalPage: responseData.root.totpage,
                dataSource: this.state.dataSource.cloneWithRows(this.rowIds),
                noMoreData: responseData.root.totpage <= this.state.pageNum,
                loading: false,
                _pullToRefreshing:false,
            });
        } catch(e) {
            this.handleRequestException(e);
        }
    }

    /**
     * 渲染行数据
     */
    renderRow (item) {
        let imgwh = (Dimensions.get('window').width-30)/2;
         return (
             <TouchableOpacity onPress={()=>{
                this.props.navigator.push({
                    component: GoodDetail,
                    hideNavBar:true,
                    passProps: {
                        id:item.goods_id
                    }
                });
             }}>
                 <View style = {[styles.item]}>
                     <Image source={{uri:ECGB.ServerDomain+item.goods_image}} style={{width:imgwh,height:imgwh}}/>
                     <Text style={[styles.title]}>{item.goods_name}</Text>
                     <Text style={[styles.price]}>￥{item.goods_price}</Text>
                 </View>
             </TouchableOpacity>
         );
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
            this.fetchData();
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

    render () {
        if(!this.state.doRenderScene)
            return this._renderPlaceholderView();
        return (
            <View style = {Global._styles.CONTAINER} >
                {this._getNavBar()}
                <ListView
                    contentContainerStyle={styles.list}
                    automaticallyAdjustContentInsets = {false}	//此参数保证在IOS的Tabbar中顶端不出现与statusBar等高的空隙
                    dataSource = {this.state.dataSource}
                    renderRow = {this.renderRow}
                    renderFooter = {this.renderFooter}
                    onEndReached = {this.onEndReached}
                    onEndReachedThreshold = {10}
                    refreshControl = {
						<RefreshControl
							refreshing = {this.state._pullToRefreshing}
							onRefresh = {this.pullToRefresh}
						/>
					}
                />

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
            <NavBar title = {this.props.title}
                    navigator = {this.props.navigator}
                    route = {this.props.route}
                    hideBackButton = {false}
                    hideBottomLine = {false} />
        );
    }

}

const styles = StyleSheet.create({
    list: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        paddingHorizontal:10,
    },
    item: {
        width: (Dimensions.get('window').width-30)/2,
        height: (Dimensions.get('window').width-30)/2 + 100,
        marginTop:10,
        backgroundColor:'#fff',
        flexDirection: 'column'
    },
    title:{
        flex: 6,
        fontSize: 15,
        marginLeft: 10,
        marginRight:10,
    },
    price: {
        marginLeft: 10,
        marginRight:10,
        flex: 4,
        color:Global._colors.IOS_RED,
        fontSize: 15,
        textAlign:'center',
        marginTop:10,
    },
    footer: {
        width:Dimensions.get('window').width,
        height: 50,
    },
    footerText: {
        color: Global._colors.FONT_LIGHT_GRAY1,
        fontSize: 13,
    },
});

GoodsList.defaultProps = {
    title:'商品列表'
}

export default GoodsList;



