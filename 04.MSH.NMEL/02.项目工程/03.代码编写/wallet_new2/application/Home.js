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

import * as Global  from './Global';
import NavBar       from './store/common/TopNavBar';
import GoodDetail from './store/goods/GoodDetail';
import Saofu from './wallet/Saofu';
import DPay from './dailyPay/Index';
import PayList from './dailyPay/PayList';
import GoodsList from './store/goods/GoodsList';
import GoodsDetail from './store/goods/GoodDetail';
import BillList 	from './wallet/BillList';

class Home extends Component {

    static displayName = 'Home';
    static description = '首页';

    state = {
        doRenderScene: false,
        slideImg: false,
        recommendGoods:false,
    };

    constructor (props) {
        super(props);
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({doRenderScene: true});
            this.getRecommendData();
            this.getSlideImgData();
        });
    }

    async getRecommendData() {
        let url = `${Global.ServerUrl}?act=app&op=goodRecommend&type=4`;
        let options = {
            method: "GET"
        };
        let responseData = await this.request(url, options);
        if (responseData && responseData.root && responseData.root.list) {
            let list = responseData.root.list;
            list.length = 4;
            this.setState({
                recommendGoods: list
            });
        }
    }

    async getSlideImgData() {
        let url = `${Global.ServerUrl}?act=app&op=adv&aid=1050`;
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

    getRowOne() {
        let width = Dimensions.get('window').width;
        let height = width * 36 / 108;

        return (
                <Image source={require('./res/images/home/bg.jpg')} style={{width:width,height:height}}>
                    <View style={styles.rowOne}>
                        <View style={{flex:1}}>
                            <TouchableOpacity style={styles.rowOneItem} onPress={()=>{
                                this.props.navigator.push({
                                    component:Saofu,
                                    hideNavBar:true,
                                    passProps:{

                                    }
                                });
                            }}>
                                <Image source={require('./res/images/home/icon-sao.png')} style={styles.icon}/>
                                <Text style={styles.oneFont}>扫码付</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex:1}}>
                            <TouchableOpacity style={styles.rowOneItem}
                                onPress={() => {
                                    this.props.navigator.push({
                                        component: BillList, 
                                        hideNavBar: true,
                                    });
                                }}
                                >
                                <Image source={require('./res/images/home/icon-bill.png')} style={styles.icon}/>
                                <Text style={styles.oneFont}>账单</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Image>
        );
    }

    getTit(i) {
        let img = null;
        switch (i){
            case 1:
                img = require("./res/images/home/tit1.png");
                break;
            case 2:
                img = require("./res/images/home/tit2.png");
                break;
            case 3:
                img = require("./res/images/home/tit3.png");
                break;
            default:
                img = require("./res/images/home/tit1.png");
        }
        return (
            <View style={styles.tit}>
                <Image source={img} style={styles.titImg}/>
            </View>
        );
    }

    getRowTwo() {
        return (
            <View style={styles.card}>
                {this.getTit(1)}
                <View style={styles.rowTwo}>
                    <View style={{flex:1}}>
                        <TouchableOpacity style={styles.rowOneItem} onPress={()=>{
                            this.props.navigator.push({
                                component:DPay,
                                hideNavBar:true,
                                passProps:{
                                    type:'dian',
                                    title:'电费缴费',
                                }
                            });
                        }}>
                            <Image source={require('./res/images/home/pay1.png')} style={styles.payIcon}/>
                            <Text style={styles.rowTwoFont}>电费</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex:1}}>
                        <TouchableOpacity style={styles.rowOneItem} onPress={()=>{
                            this.props.navigator.push({
                                component:DPay,
                                hideNavBar:true,
                                passProps:{
                                    type:'tv',
                                    title:'有线电视缴费'
                                }
                            });
                        }}>
                            <Image source={require('./res/images/home/pay2.png')} style={styles.payIcon}/>
                            <Text style={styles.rowTwoFont}>有线电视</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex:1}}>
                        <TouchableOpacity style={styles.rowOneItem} onPress={()=>{
                            this.props.navigator.push({
                                component:DPay,
                                hideNavBar:true,
                                passProps:{
                                    type:'phone',
                                    title:'手机话费缴费'
                                }
                            });
                        }}>
                            <Image source={require('./res/images/home/pay3.png')} style={styles.payIcon}/>
                            <Text style={styles.rowTwoFont}>手机充值</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex:1}}>
                        <TouchableOpacity style={styles.rowOneItem} onPress={()=>{
                            this.props.navigator.push({
                                component:PayList,
                                hideNavBar:true,
                            });
                        }}>
                            <Image source={require('./res/images/home/pay4.png')} style={styles.payIcon}/>
                            <Text style={styles.rowTwoFont}>更多</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    getRowThree() {

        if(!this.state.slideImg)
            return false;

        let width = Dimensions.get('window').width;
        let cwidth = width - 26;
        let y1_w = cwidth * 356 / (356 + 644);
        let y1_h = y1_w * 510 / 356;
        let y2_w = cwidth - y1_w;
        let y2_h,y3_h;
        y2_h = y3_h = (y1_h - 10) / 2;
        let y3_w = (y2_w - 10) / 2;

        return (
            <View>
                {this.getTit(2)}
                <View style={{paddingHorizontal:8,flexDirection:'row'}}>
                    <View style={{width:y1_w,marginRight:10}}>
                        <TouchableOpacity onPress={()=>{this.toShopStrictSelection(this.state.slideImg[0])}}>
                            <Image source={{uri:Global.ServerDomain + this.state.slideImg[0].url}} style={{width:y1_w,height:y1_h}}>
                                <View style={{marginLeft:10,marginTop:6}}>
                                    <Text style={styles.imgFontTit}>有好货</Text>
                                    <Text style={styles.imgFontSmall}>品质生活指南</Text>
                                </View>
                            </Image>
                        </TouchableOpacity>
                    </View>
                    <View style={{width:y2_w}}>
                        <View style={{height:y2_h,marginBottom:10}}>
                            <TouchableOpacity onPress={()=>{this.toShopStrictSelection(this.state.slideImg[1])}}>
                                <Image source={{uri:Global.ServerDomain + this.state.slideImg[1].url}} style={{width:y2_w,height:y2_h}}>
                                    <View style={{marginLeft:10,marginTop:6,backgroundColor:'transparent'}}>
                                        <Text style={styles.imgFontTit}>超实惠</Text>
                                        <Text style={styles.imgFontSmall}>畅销特卖包邮</Text>
                                    </View>
                                </Image>
                            </TouchableOpacity>
                        </View>
                        <View style={{height:y2_h,flexDirection:'row'}}>
                            <View style={{width:y3_w,marginRight:10}}>
                                <TouchableOpacity onPress={()=>{this.toShopStrictSelection(this.state.slideImg[2])}}>
                                    <Image source={{uri:Global.ServerDomain + this.state.slideImg[2].url}} style={{width:y3_w,height:y3_h}}>
                                        <View style={{marginLeft:10,marginTop:6}}>
                                            <Text style={styles.imgFontTit}>居家热销</Text>
                                        </View>
                                    </Image>
                                </TouchableOpacity>
                            </View>
                            <View style={{width:y3_w}}>
                                <TouchableOpacity onPress={()=>{this.toShopStrictSelection(this.state.slideImg[3])}}>
                                    <Image source={{uri:Global.ServerDomain + this.state.slideImg[3].url}} style={{width:y3_w,height:y3_h}}>
                                        <View style={{marginLeft:10,marginTop:6}}>
                                            <Text style={styles.imgFontTit}>趣味厨房</Text>
                                        </View>
                                    </Image>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    getRowFour() {

        if(!this.state.recommendGoods){
            return (
                <View style={{height:30,justifyContent:'center',alignItems:'center'}}>
                    <Text style={{textAlign:'center',color:Global.Color.LIGHT_GRAY}}>...</Text>
                </View>
            );
        }

        let width = Dimensions.get('window').width;
        let gWidth = (width - 26)/2;

        return (
            <View>
                {this.getTit(3)}
                <View style={{paddingHorizontal:3,flexDirection:'row',flexWrap:'wrap',alignItems: 'flex-start'}}>
                    {this.state.recommendGoods.map((v)=>{
                        return (
                            <View style={styles.list}>
                                <TouchableOpacity onPress={()=>{
                                        this.props.navigator.push({
                                            component: GoodDetail,
                                            hideNavBar:true,
                                            passProps: {
                                                id:v.goods_id
                                            }
                                        });
                                     }}>
                                    <Image source={{uri:Global.ServerDomain + v.url}}
                                           style={styles.listImg}
                                    />
                                    <View style={styles.listName}>
                                        <Text style={styles.listNameText} numberOfLines={1}>{v.name}</Text>
                                    </View>
                                    <View style={styles.listPrice}>
                                        <Text style={styles.listPriceText}>￥{v.price}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        );
                    })}
                </View>
            </View>
        );
    }

    render () {
        if(!this.state.doRenderScene)
            return this._renderPlaceholderView();

        return (
            <View style = {Global._styles.CONTAINER}>
                {this._getNavBar()}
                <ScrollView style = {styles.scrollView} automaticallyAdjustContentInsets = {false}>
                    {this.getRowOne()}
                    {this.getRowTwo()}
                    <View style={[styles.card,{marginTop:10,marginBottom:10}]}>
                        {this.getRowThree()}
                        {this.getRowFour()}
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
            <NavBar title='民生钱包'
                    navigator = {this.props.navigator}
                    route = {this.props.route}
                    hideBackButton = {true}
                    hideBottomLine = {false}
                    centerComponent={
                        <View style={styles.titleContainer}>
                            <Image style={styles.titleImg}
                                source={require('./res/images/home/index_top_title.png')}
                            />
                        </View>
                    } 
            />
        );
    }

}


Home.propTypes = {
};

Home.defaultProps = {
};


const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    rowOne: {
        paddingVertical:32,
        flexDirection:'row',
    },
    rowOneItem: {
        justifyContent:'center',
        alignItems:'center',
    },
    rowTwo: {
        paddingVertical:16,
        borderTopWidth:1/Global._pixelRatio,
        borderTopColor:Global.Color.LIGHT_GRAY,
        flexDirection:'row',
    },
    rowTwoItem: {
        justifyContent:'center',
        alignItems:'center'
    },
    rowTwoFont: {
        fontSize:Global.FontSize.BASE,
        color:Global.Color.DARK_GRAY,
        marginTop:10,
    },
    icon: {
        width:32,height:32
    },
    payIcon: {
        width:35,height:35
    },
    oneFont: {
        fontSize:Global.FontSize.BASE,
        marginTop:10,
        color:'#fff',
        textAlign:'center',
        backgroundColor:'transparent'
    },
    tit: {
        paddingHorizontal:8,
        paddingVertical:14,
    },
    titImg: {
        width:88,
        height:16,
    },
    card: {
        backgroundColor:'#fff',
    },
    imgFontTit: {
        color: Global.Color.DARK_GRAY,
        fontSize: Global.FontSize.BASE,
        backgroundColor:'transparent',
    },
    imgFontSmall: {
        color: Global.Color.DARK_GRAY,
        fontSize: Global.FontSize.SMALL,
        backgroundColor:'transparent',
    },
    list: {
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
        marginHorizontal: 5,
    },
    listPriceText: {
        color: Global.Color.GRAY,
        fontSize: Global.FontSize.BASE,
        textAlign: 'center',
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleImg: {
        width: 81,
        height: 18,
        resizeMode: 'contain',
    },
});

export default Home;
