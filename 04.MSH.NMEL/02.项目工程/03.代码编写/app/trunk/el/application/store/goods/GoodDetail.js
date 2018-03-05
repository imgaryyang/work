'use strict';

import React, {
    Component,
    PropTypes,
} from 'react';

import {
    View,
	WebView,
    ScrollView,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
	InteractionManager,
	Dimensions,
	Modal,
} from 'react-native';

import * as Global  from '../../Global';
import EasyIcon     from 'rn-easy-icon';
import EasyButton from 'rn-easy-button';
import EasySeparator from 'rn-easy-separator';
import NavBar       from 'rn-easy-navbar';
import Swiper       from 'react-native-swiper';
import Order 		from './Order';
import * as ECGB from '../util/ShopUtil';

import Fetch from '../util/Fetch';

const FIND_URL = ECGB.ServerUrl + '?act=interface_app&op=goodsinfo';
const DETAIL_URL = ECGB.ServerUrl + '?act=interface_app&op=goods_body';
const ADD_CART = ECGB.ServerUrl + '?act=interface_app&op=cartadd';

class GoodDetail extends Component {

    static displayName = 'Comp';
    static description = '组件';

    static propTypes = {
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,
		fetchOk:false,
		webViewHeight:0,
		showModal:false,
		num:1,
		goodId:false,
		atOnce:true,
		contentOk:false,
	};

	_goods = null;
	_uid = 6;

    constructor (props) {
        super(props);
		this.state.id = props.id;
    }

	componentDidMount () {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
			this.fetchData();
		});
	}

	/**
	 * 异步加载数据
	 */
	async fetchData () {
		try {
			let responseData = await this.request(
				FIND_URL + '&goods_id=' + this.state.id,//this.state.id
				{ method : "GET" });
/*			let responseData = null;
			let req = await Fetch.getGood().then((res)=>{
				responseData = res;
			});*/

			this._goods = responseData.root;
			this.setState({
				fetchOk:true
			});
		} catch(e) {
			this.handleRequestException(e);
		}
	}

	_renderSwiperItems() {
		if(!this.state.fetchOk)
			return null;
		let arr = [];
		this._goods.goods_image.forEach((v, i) => {
			arr.push(
				<View style={styles.slide} key={i}>
					<Image source={{uri:v}}
						   style={styles.slideImg}
					/>
				</View>
			);
		});
		return (
			<Swiper style={styles.swiper}
					height={360}
					autoplay={true}
					paginationStyle={{bottom: 2}}
			>
				{arr}
			</Swiper>
		);
	}

	_showDetail() {
		return (
			<View style={styles.goodsInfo}>
				<Text style={{fontSize:16,marginTop:20}}>{this._goods.goods_name}</Text>
				<Text style={{color:Global._colors.ORANGE,marginTop:10}}>￥{this._goods.goods_price}</Text>
			</View>
		);
	}

	//called when HTML was loaded and injected JS executed
	_updateWebViewHeight(event) {
		this.setState({
			webViewHeight: parseInt(event.title),
			contentOk:true,
		});
		console.log("contentOk:",true);
	}

	_showSpec() {
		if(!this.state.fetchOk)
			return false;

		/*let script = `var style = document.createElement("style");
						  document.body.appendChild(style);
						  
						  function addCSSRule(sheet, selector, rules, index) {
								if("insertRule" in sheet) {
									sheet.insertRule(selector + "{" + rules + "}", index);
								}
								else if("addRule" in sheet) {
									sheet.addRule(selector, rules, index);
								}
							}
						  addCSSRule(document.styleSheets[0], "img", "width: 100%");
						  var i=1;document.title = document.body.scrollHeight; window.location.hash = ++i;`;*/

		let script = `var i=1;document.title = document.body.scrollHeight; window.location.hash = ++i;`;

		let vw = <ScrollView>
					{this._showDetail()}
					{
						this.state.contentOk ? false
						:
						<View style={{height:100,alignItems:'center',paddingVertical:20}}>
							<Text>...</Text>
						</View>
					}
					<WebView
						source={{uri:DETAIL_URL + '&goods_id='+this.state.id}}
						javaScriptEnabled={true}
						scalesPageToFit={true}
						injectedJavaScript={script}
						scrollEnabled={false}
						onNavigationStateChange={this._updateWebViewHeight.bind(this)}
						automaticallyAdjustContentInsets={false}
						style={{width: Dimensions.get('window').width, height:this.state.webViewHeight}}
					/>
				 </ScrollView>
		return vw;
	}

	_btns() {
		return (
			<View style={styles.btns}>
				<EasyButton size="small" stretch={false} style={{width:(Dimensions.get('window').width-15)/2}} text="立即购买" onPress={()=>{
						this.setState({
							atOnce:true,
							showModal:true
						});
					}}/>
				<EasyButton size="small" stretch={false} style={{width:(Dimensions.get('window').width-15)/2}} text="加入购物车" theme={EasyButton.THEME.ORANGE} onPress={()=>{
						this.setState({
							atOnce:false,
							showModal:true
						});
					}}/>
			</View>
		);
	}

	async _addToCart() {

		//&goods_id=100009&quantity=3&user_id=7
		let res = await this.request(
			ADD_CART + '&goods_id=' + this.state.id + '&quantity=' + this.state.num + '&user_id=' + this._uid,//this.state.id
			{ method : "GET" });

		if(res.success)
			this.toast('加入购物车成功');
		else
			this.toast('加入购物车失败');
	}

	render () {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		return (
			<View style = {Global._styles.CONTAINER} >
				{this._getNavBar()}
				<ScrollView style = {styles.scrollView} >
					{this._renderSwiperItems()}
					{this._showSpec()}
				</ScrollView>
				{this._btns()}
				<Modal
					animationType = "slide"
					transparent = {true}
					visible = {this.state.showModal} >
						<View style = {{flex:1,backgroundColor: 'rgba(0,0,0,.6)'}} >
							<View style = {{
								position: 'absolute',
								left: 0,
								bottom: 0,
								width: Dimensions.get('window').width,
								backgroundColor: '#ffffff',
								flexDirection: 'column',
							}} >
								<View style={{paddingVertical:20,paddingHorizontal:10}}>
									<View style={{flexDirection:'row'}}>
										<Text>选择数量</Text>
										<TouchableOpacity onPress={()=>{
											this.setState({
												showModal:false
											});
										}}>
											<EasyIcon name="ios-close"/>
										</TouchableOpacity>
									</View>
									<View style={{flexDirection:'row'}}>
										<EasyButton stretch={false} style={{width:40,height:40}} text="-"  onPress={()=>{
											this.setState({
												num:this.state.num===1?1:this.state.num-1
											});
										}}/>
										<Text style={{marginHorizontal:20,fontSize:20}}>{this.state.num}</Text>
										<EasyButton stretch={false} style={{width:40,height:40}} text="+" onPress={()=>{
											this.setState({
												num:this.state.num+1
											});
										}}/>
									</View>
								</View>
								<EasyButton style={{borderRadius:0}} text="下一步" stretch={false} theme={EasyButton.THEME.ORANGE} onPress={()=>{

									this.setState({
										showModal:false
									},()=>{
										if(this.state.atOnce){
											//立即购买
											this.props.navigator.push({
											title:'提交订单',
											component:Order,
											hideNavBar:true,
											passProps:{
												goods:this._goods,
												num:this.state.num
											}
										});
										}else{
											this._addToCart();
										}
									});
								}}/>
							</View>
						</View>
				</Modal>
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
			<NavBar title = '商品详情'
		    	navigator = {this.props.navigator} 
				route = {this.props.route}
		    	hideBackButton = {false}
		    	hideBottomLine = {false}/>
		);
	}
}

const styles = StyleSheet.create({
	scrollView: {
		marginBottom:40
	},
	swiper: {

	},
	slideImg: {
		height: 360,
		resizeMode: 'cover',
	},
	goodsInfo: {
		paddingHorizontal:10,
		backgroundColor:'#fff',

	},
	btns: {
		position:'absolute',
		bottom:0,
		width:Dimensions.get('window').width,
		height:40,
		flexDirection:'row',
		alignItems:'center',
		backgroundColor:'#fff',
		borderTopWidth:1,
		borderTopColor:'#ccc',
		justifyContent:'space-around'
	}
});

export default GoodDetail;



