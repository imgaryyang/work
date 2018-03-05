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
import NavBar       from '../common/TopNavBar';
import GoodDetail 	from './GoodDetail';

const FIND_URL = Global.ServerUrl+'?act=interface_app&op=goods_list';

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
         return (
                 <View style = {[styles.listItem]}>
                     <TouchableOpacity onPress={()=>{
                        this.props.navigator.push({
                            component: GoodDetail,
                            hideNavBar:true,
                            passProps: {
                                id:item.goods_id
                            }
                        });
                     }}>
                         <Image source={{uri:Global.ServerDomain+item.goods_image}} style={styles.listImg}/>
                         <View style={styles.listName}>
                             <Text style={styles.listNameText} numberOfLines={1}>{item.goods_name}</Text>
                         </View>
                         <View style={styles.listPrice}>
                             <Text style={styles.listPriceText}>￥{item.goods_price}</Text>
                         </View>
                     </TouchableOpacity>
                 </View>
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
            <View style={[Global._styles.CENTER, styles.footer]}>
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
                    style={{backgroundColor:'#fff'}}
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
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        paddingHorizontal:3,
        paddingTop:10,
    },
    footer: {
        width:Dimensions.get('window').width,
        height: 50,
    },
    footerText: {
        color: Global.Color.LIGHT_GRAY,
        fontSize: Global.FontSize.BASE,
    },
    listItem: {
        width: (Dimensions.get('window').width - 26) / 2,
        marginBottom: 15,
        marginHorizontal:5,
    },
    listImg: {
        width: (Dimensions.get('window').width - 26) / 2,
        height: (Dimensions.get('window').width - 26) / 2,
        resizeMode: 'cover',
    },
    listName: {
        marginTop: 10,
    },
    listPrice: {
        marginTop: 3,
        justifyContent: 'center',
    },
    listNameText: {
        color: Global.Color.DARK_GRAY,
        fontSize: Global.FontSize.BASE,
        textAlign: 'center',
    },
    listPriceText: {
        color: Global.Color.GRAY,
        fontSize: Global.FontSize.BASE,
        textAlign: 'center',
    },
});

GoodsList.defaultProps = {
    title:'商品列表'
}

export default GoodsList;



