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
    Dimensions,
} from 'react-native';

import * as Global  from '../Global';
import Swiper       from 'react-native-swiper';

import NavBar       from './common/TopNavBar';

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
        let url = `${Global.ServerUrl}?act=interface_app&op=cartlist&user_id=6`;
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
        try {
            let url = `${Global.ServerUrl}?act=app&op=adv`;
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
        } catch (e) {
            this.handleRequestException(e);
        }
    }

    async getCategoryData() {
        try {
            let url = `${Global.ServerUrl}?act=app&op=goodClass&parentId=0`;
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
        } catch (e) {
            this.handleRequestException(e);
        }
    }

    async getRecommendData() {
        try {
            let url = `${Global.ServerUrl}?act=app&op=goodRecommend&type=1`;
            let options = {
                method: "GET"
            };
            let arr = [];
            let responseData = await this.request(url, options);
            if (responseData && responseData.root && responseData.root.list) {
                arr.push(...responseData.root.list);
            }
            url = `${Global.ServerUrl}?act=app&op=goodRecommend&type=3`;
            responseData = await this.request(url, options);
            if (responseData && responseData.root && responseData.root.list) {
                arr.push(...responseData.root.list);
            }
            this.setState({
                recommendArr: arr,
            });
        } catch (e) {
            this.handleRequestException(e);
        }
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

    toShopStrictSelection(v) {
        if (!v || !v.targetType || !v.id)
            return false;
        let component = null;
        let passProps = {};
        if (v.targetType == '1') {
            component = GoodsList;
            passProps.typeId = v.id;
        } else {
            component = GoodsDetail;
            passProps.id = v.id;
        }
        this.props.navigator.push({
            component: component,
            hideNavBar: true,
            passProps: passProps,
        });
    }

    render() {
        if (!this.state.doRenderScene)
            return this._renderPlaceholderView();

        return (
            <View style={[Global._styles.CONTAINER, styles.container]}>
                {this._getNavBar()}
                <ScrollView style={styles.scrollView} 
                    automaticallyAdjustContentInsets = {false}>
                    {this._renderSwiperItems()}
                    <View style={styles.types}>
                        {this._renderTypes()}
                    </View>
                    <View style={styles.listContainer}>
                        {this._renderRecommendItem()}
                    </View>
                    <View style={styles.foot}></View>
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
            <NavBar title='商城首页'
                navigator={this.props.navigator}
                route={this.props.route}
                hideBackButton={true}
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
                    <Image source={{uri: `${Global.ServerDomain}${v.url}`}}
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
                <TouchableOpacity style={styles.slide} key={i}
                    onPress={() => {this.toShopStrictSelection(v)}}
                    >
                    <Image source={{uri: `${Global.ServerDomain}${v.url}`}}
                        style={styles.slideImg}
                    />
                </TouchableOpacity>
            );
        });
        return (
            <Swiper style={styles.swiper}
                height={160}
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
                        <Image source={{uri: `${Global.ServerDomain}${v.url}`}}
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
        backgroundColor: Global.Color.LIGHTER_GRAY,
    },
    scrollView: {
        flex: 1,
        backgroundColor: Global.Color.LIGHTER_GRAY,
        paddingBottom: Global.Space.BOTTOM,
    },
    foot: {
        height: Global.Space.BOTTOM,
    },
    swiper: {},
    slideImg: {
        height: 160,
        resizeMode: 'cover',
    },
    types: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 3,
        paddingRight: 3,
    },
    typesItem: {
        width: (Dimensions.get('window').width - 46) / 4,
        margin: 5,
        paddingTop: 12,
        paddingBottom: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 5,
    },
    typesItemImg: {
        width: 33,
        height: 33,
        resizeMode: 'contain',
    },
    typesName: {
        fontSize: Global.FontSize.BASE,
        color: Global.Color.DARK_GRAY,
        marginTop: 4,
    },
    listContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 3,
        paddingRight: 3,
        backgroundColor: '#fff',
        alignItems: 'flex-start',
    },
    list: {
        width: (Dimensions.get('window').width - 26) / 2,
        margin: 5,
        marginBottom: 10,
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

export default Index;



