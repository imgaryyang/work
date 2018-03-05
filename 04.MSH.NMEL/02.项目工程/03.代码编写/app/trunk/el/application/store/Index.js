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

import NavBar       from 'rn-easy-navbar';
import Button       from 'rn-easy-button';

import BottomNavBar from './common/NavBar';
import GoodsList from './goods/GoodsList';
import GoodsDetail from './goods/GoodDetail';
import ShoppingCartNav from './shoppingCart/Nav';
import ShopAction   from '../flux/ShopAction';

class Index extends Component {

    static displayName = 'ShopIndex';
    static description = '商城首页';

    static propTypes = {
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,
		slideImg: null,
		types: null,
		recommendArr: [],
	};

    constructor (props) {
        super(props);
    }

	componentDidMount () {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true}, () => {
				this.showLoading();
			    this.getSlideImgData();
			    this.getCategoryData();
			    this.getRecommendData(1);
			    this.getRecommendData(2);
			    this.getRecommendData(3);
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
            if(!responseData)
                return false;
            if(!responseData.success) 
                return false;
            if(!responseData.root) 
            	return false;
            let num = 0;
            for(let item of responseData.root) {
            	num += Number(item.goods_num);
            }
            ShopAction.onShoppingCartNumReset(num);
        } catch(e) {
            this.handleRequestException(e);
        }
    }
	
	async getSlideImgData() {
        let url = `${ShopUtil.ServerUrl}?act=app&op=adv`;
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
            types: responseData.root,
        });
    }
	
	async getRecommendData(type) {
        let url = `${ShopUtil.ServerUrl}?act=app&op=goodRecommend&type=${type}`;
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
        this.state.recommendArr[type - 1] = responseData.root;
        this.setState({
            doRenderScene: true,
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

	render () {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		return (
			<View style = {Global._styles.CONTAINER} >
				{this._getNavBar()}
				<ScrollView style = {styles.scrollView} >
				    {this._renderSwiperItems()}
    				<View style={styles.types} >
        				{this._renderTypes()}
                    </View>
                    {this._renderRecommend()}
				</ScrollView>
				<BottomNavBar navigator={this.props.navigator} />
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
			<NavBar title = '商城首页' 
		    	navigator = {this.props.navigator} 
				route = {this.props.route}
		    	hideBackButton = {false} 
		    	hideBottomLine = {false}
				rightButtons = {(
                    <ShoppingCartNav navigator={this.props.navigator} />
                )}
			/>
		);
	}

	_renderTypes() {
        if(!this.state.types)
            return null;
        let arr = [];
        this.state.types.forEach((v, i) => {
            arr.push(
                <Button key={i}
                    style={styles.typesItem}
                    text={v.value} 
                    onPress={() => this.toGoodsList(v)}
                />
            );
        });
        return arr;
    }

	_renderSwiperItems() {
	    if(!this.state.slideImg || this.state.slideImg.length == 0)
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
                height={200}
                autoplay={true} 
                paginationStyle={{bottom: 2}}
            >
                {arr}
            </Swiper>
	    );
	}

	_renderRecommend() {
	    if(!this.state.recommendArr || this.state.recommendArr.length == 0)
	        return null;
	    let arr = [];
	    let i = 0;
	    for(let v of this.state.recommendArr) {
	        if(!v || !v.title || !v.list)
                continue;
            arr.push(
                <View key={i}>
                    <View style={styles.moduleTitle}>
                        <Text style={styles.moduleTitleText}>{v.title}</Text>
                    </View>
                    <View style={styles.listContainer}>
                        {this._renderRecommendItem(v.list)}
                    </View>
                </View>
            );
            i++;
	    }
        return arr;
	}

	_renderRecommendItem(list) {
        if(!list || list.length == 0)
            return null;
        let arr = [];
        list.forEach((v, i) => {
            arr.push(
                <View key={i} style={styles.list}>
                    <TouchableOpacity 
                        onPress={() => this.toGoodsDetail(v.goods_id)}
                    >
                        <Image source={{uri: `${ShopUtil.ServerDomain}${v.url}`}} 
                            style={styles.listImg}
                        />
                        <View style={styles.listName}>
                            <Text style={styles.listNameText}>{v.name}</Text>
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
	scrollView: {
		flex: 1,
	},
	swiper: {
	    
	},
	slideImg: {
        height: 200,
        resizeMode: 'cover',
	},
	types: {
	    flexDirection: 'row', 
	    flexWrap: 'wrap',
	    marginTop: 30,
	    marginLeft: 10,
	    marginRight: 10
	},
	typesItem: {
        width: (Global._screen.width - 60) / 4,
        margin: 5
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
	    padding: 8
	},
	list: {
	    width: (Global._screen.width - 48) / 2,
	    margin: 8,
	},
	listImg: {
	    height: 200,
        resizeMode: 'cover',
	},
	listName: {
	    marginTop: 5,
	},
	listPrice: {
	    marginTop: 5,
	    alignItems: 'center',
        justifyContent: 'center',
	},
	listNameText: {
        color: '#444',
    },
	listPriceText: {
	    color: 'red',
	},
});

export default Index;



