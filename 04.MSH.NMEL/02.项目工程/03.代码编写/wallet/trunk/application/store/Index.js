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

import * as Global  from '../Global';
import * as ShopUtil from './util/ShopUtil';
import Swiper       from 'react-native-swiper';

import NavBar       from './common/TopNavBar';
import Button       from 'rn-easy-button';

import BottomNavBar from './common/NavBar';
import GoodsList from './goods/GoodsList';
import GoodsDetail from './goods/GoodDetail';
import TopNavBarRightButtons from './common/TopNavBarRightButtons';
import ShopAction   from '../flux/ShopAction';

class Index extends Component {

    static displayName = 'ShopIndex';
    static description = '商城首页';

    static propTypes = {};

    static defaultProps = {};

    state = {
        doRenderScene: false,
        slideImg: null,
        types: null,
        recommendArr: [],
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({doRenderScene: true}, () => {
                this.showLoading();
                this.getSlideImgData();
                this.getCategoryData();
                this.getRecommendData();
            });
        });

        // 获取购物车数量
        this.getShoppingCart();
    }

    async getShoppingCart() {
        let url = `${ShopUtil.ServerUrl}?act=interface_app&op=cartlist&user_id=6`;
        let options = {
            method: "GET"
        };
        try {
            let responseData = await this.request(url, options);
            if (!responseData)
                return false;
            if (!responseData.success)
                return false;
            if (!responseData.root)
                return false;
            let num = 0;
            for (let item of responseData.root) {
                num += Number(item.goods_num);
            }
            ShopAction.onShoppingCartNumReset(num);
        } catch (e) {
            this.handleRequestException(e);
        }
    }

    async getSlideImgData() {
        let url = `${ShopUtil.ServerUrl}?act=app&op=adv`;
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
        this.setState({
            doRenderScene: true,
            slideImg: responseData.root,
        });
        this.hideLoading();
    }

    async getCategoryData() {
        let url = `${ShopUtil.ServerUrl}?act=app&op=goodClass&parentId=0`;
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
        this.setState({
            doRenderScene: true,
            types: responseData.root,
        });
    }

    async getRecommendData() {
        let url = `${ShopUtil.ServerUrl}?act=app&op=goodRecommend&type=1`;
        let options = {
            method: "GET"
        };
        let arr = [];
        let responseData = await this.request(url, options);
        if (responseData && responseData.root && responseData.root.list) {
            arr.push(...responseData.root.list);
        }
        url = `${ShopUtil.ServerUrl}?act=app&op=goodRecommend&type=3`;
        responseData = await this.request(url, options);
        if (responseData && responseData.root && responseData.root.list) {
            arr.push(...responseData.root.list);
        }
        this.setState({
            recommendArr: arr,
        });
    }

    toGoodsList(v) {
        this.props.navigator.push({
            component: GoodsList,
            hideNavBar: true,
            passProps: {
                typeId: v.id,
                title: v.value,
            },
        });
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

        return (
            <View style={[Global._styles.CONTAINER, styles.container]}>
                {this._getNavBar()}
                <ScrollView style={styles.scrollView}>
                    {this._renderSwiperItems()}
                    <View style={styles.types}>
                        {this._renderTypes()}
                    </View>
                    <View style={styles.listContainer}>
                        {this._renderRecommendItem()}
                    </View>
                    <View style={styles.foot}></View>
                </ScrollView>
                <BottomNavBar navigator={this.props.navigator}/>
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
            <NavBar title='商城首页'
                navigator={this.props.navigator}
                route={this.props.route}
                hideBackButton={false}
                hideBottomLine={false}
                rightButtons={(
                    <TopNavBarRightButtons
                        navigator={this.props.navigator}
                        showShoppingCart={true}
                        showMyOrder={true}
                    />
                )}
            />
        );
    }

    _renderTypes() {
        if (!this.state.types)
            return null;
        let arr = [];
        this.state.types.forEach((v, i) => {
            arr.push(
                <TouchableOpacity
                    key={i}
                    style={styles.typesItem}
                    onPress={() => this.toGoodsList(v)}
                >
                    <Image source={{uri: `${ShopUtil.ServerDomain}${v.url}`}}
                        style={styles.typesItemImg}
                    />
                    <Text style={styles.typesName}>{v.value}</Text>
                </TouchableOpacity>
            );
        });
        return arr;
    }

    _renderSwiperItems() {
        if (!this.state.slideImg || this.state.slideImg.length == 0)
            return null;
        let arr = [];
        this.state.slideImg.forEach((v, i) => {
            arr.push(
                <View style={styles.slide} key={i}>
                    <Image source={{uri: `${ShopUtil.ServerDomain}${v.url}`}}
                        style={styles.slideImg}
                    />
                </View>
            );
        });
        return (
            <Swiper style={styles.swiper}
                height={110}
                autoplay={true}
                paginationStyle={{bottom: 2}}
            >
                {arr}
            </Swiper>
        );
    }

    _renderRecommendItem() {
        if (!this.state.recommendArr || this.state.recommendArr.length == 0)
            return null;
        let arr = [];
        this.state.recommendArr.forEach((v, i) => {
            arr.push(
                <View key={i} style={styles.list}>
                    <TouchableOpacity
                        onPress={() => this.toGoodsDetail(v.goods_id)}
                    >
                        <Image source={{uri: `${ShopUtil.ServerDomain}${v.url}`}}
                            style={styles.listImg}
                        />
                        <View style={styles.listName}>
                            <Text style={styles.listNameText} numberOfLines={1}>{v.name}</Text>
                        </View>
                        <View style={styles.listPrice}>
                            <Text style={styles.listPriceText}>{'￥' + v.price}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            );
        });
        return arr;
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: ShopUtil.Color.LIGHTER_GRAY,
    },
    scrollView: {
        flex: 1,
        backgroundColor: ShopUtil.Color.LIGHTER_GRAY,
        paddingBottom: ShopUtil.Space.BOTTOM,
    },
    foot: {
        height: ShopUtil.Space.BOTTOM,
    },
    swiper: {},
    slideImg: {
        height: 110,
        resizeMode: 'cover',
    },
    types: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 11,
    },
    typesItem: {
        width: (Global._screen.width - 62) / 4,
        margin: 5,
        paddingTop: 12,
        paddingBottom: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    typesItemImg: {
        width: 33,
        height: 33,
        resizeMode: 'contain',
    },
    typesName: {
        fontSize: ShopUtil.FontSize.BASE,
        color: ShopUtil.Color.DARK_GRAY,
        marginTop: 4,
    },
    moduleTitle: {
        margin: 10,
        marginTop: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    moduleTitleText: {
        fontSize: 18,
        color: '#444',
    },
    listContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 11,
        backgroundColor: '#fff',
    },
    list: {
        width: (Global._screen.width - 42) / 2,
        margin: 5,
        marginBottom: 15,
    },
    listImg: {
        width: (Global._screen.width - 42) / 2,
        height: (Global._screen.width - 42) / 2,
        resizeMode: 'cover',
    },
    listName: {
        marginTop: 16,
        borderLeftWidth: 3,
        borderLeftColor: '#8bd4c5',
        paddingLeft: 7,
    },
    listPrice: {
        marginTop: 9,
        paddingLeft: 10,
        justifyContent: 'center',
    },
    listNameText: {
        color: ShopUtil.Color.DARK_GRAY,
        fontSize: ShopUtil.FontSize.BASE,
    },
    listPriceText: {
        color: ShopUtil.Color.DARK_GRAY,
        fontSize: ShopUtil.FontSize.BASE,
    },
});

export default Index;



