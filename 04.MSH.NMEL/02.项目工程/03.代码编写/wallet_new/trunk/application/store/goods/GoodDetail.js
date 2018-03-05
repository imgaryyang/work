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
import EasyButton from 'rn-easy-button';
import NavBar       from '../common/TopNavBar';
import Swiper       from 'react-native-swiper';
import Order 		from './Order';
import TopNavBarRightButtons from '../common/TopNavBarRightButtons';
import ShopAction   from '../../flux/ShopAction';

const FIND_URL = Global.ServerUrl + '?act=interface_app&op=goodsinfo';
const DETAIL_URL = Global.ServerUrl + '?act=interface_app&op=goods_body';
const ADD_CART = Global.ServerUrl + '?act=interface_app&op=cartadd';

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
		content:false,
		showModal:false,
		num:1,
		goodId:false,
		atOnce:true,
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
			this.fetchContent();
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

			this._goods = responseData.root;
			this.setState({
				fetchOk:true
			});
		} catch(e) {
			this.handleRequestException(e);
		}
	}

	async fetchContent() {
		try {
			let responseData = await this.request(
				DETAIL_URL + '&goods_id=' + this.state.id,
				{ method : "GET" });

			this.setState({
				content : responseData.root,
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
					height={Dimensions.get('window').width}
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
				<View style={styles.goodsInfoMain}>
					<Text style={{fontSize:Global.FontSize.BASE,color:Global.Color.DARK_GRAY}}>{this._goods.goods_name}</Text>
					<Text style={{fontSize:Global.FontSize.BASE,color:Global.Color.GRAY,marginTop:10}}>￥{this._goods.goods_price}</Text>
				</View>
			</View>
		);
	}

	_showSpec() {
		if(!this.state.content || !this.state.fetchOk)
			return false;

		return (
			<View style={{paddingBottom:10}}>
				{this._showDetail()}
				{this.state.content && this.state.content.map((v)=>{
					return (
						<ImageView source={v}/>
					);
				})}
			</View>
		);
	}

	_btns() {
		return (
			<View style={styles.btns}>
				<EasyButton text="立即购买" style={styles.btnNowBuy} onPress={()=>{
						this.setState({
							atOnce:true,
							showModal:true
						});
					}}/>
				<EasyButton text="加入购物车" style={styles.btnAddShoppingCart} onPress={()=>{
						this.setState({
							atOnce:false,
							showModal:true
						});
					}}/>
			</View>
		);
	}

	async _addToCart() {

		let res = await this.request(
			ADD_CART + '&goods_id=' + this.state.id + '&quantity=' + this.state.num + '&user_id=' + this._uid,
			{ method : "GET" });

		if(res.success)
			this.toast('加入购物车成功');
		else
			this.toast('加入购物车失败');

		if (res.success) {
			ShopAction.onShoppingCartNumAdd(this.state.num);
		}
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
								<View>
									<View style={styles.buySelectHead}>
										<View style={{flex: 1}}></View>
										<View style={styles.buySelectTitle}>
											<Text style={styles.buySelectTitleTxt}>选择数量</Text>
										</View>
										<View style={{flex: 1, alignItems: 'flex-end'}}>
											<TouchableOpacity
												onPress={()=>{
													this.setState({
														showModal:false
													});
												}}
											>
												<Image style={styles.clearImage}
													source={require('../images/clear.png')}
												/>
											</TouchableOpacity>
										</View>
									</View>
									<View style={{flexDirection:'row',paddingTop: 30, paddingBottom: 30, alignItems: 'center', justifyContent: 'center'}}>
										<TouchableOpacity
											onPress={() => {
												this.setState({
													num:this.state.num===1?1:this.state.num-1
												});
											}}
										>
											<Image style={styles.goodsChangeImage}
												source={require('../images/button_sub.png')}
											/>
										</TouchableOpacity>
										<Text style={{color:Global.Color.DARK_GRAY,fontSize:Global.FontSize.BASE,marginLeft: 10,marginRight: 10}}>{this.state.num}</Text>
										<TouchableOpacity
											onPress={() => {
												this.setState({
													num:this.state.num+1
												});
											}}
										>
											<Image style={styles.goodsChangeImage}
												source={require('../images/button_add.png')}
											/>
										</TouchableOpacity>
									</View>
								</View>
								<EasyButton style={{backgroundColor: Global.Color.RED,marginLeft: 8,marginRight: 8, marginBottom: 10}} text="下一步" onPress={()=>{

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
		    	hideBottomLine = {false}
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
}

class ImageView extends Component {

	constructor (props) {
		super(props);
	}

	state = {
		width: null,
		height: null,
	};

	componentDidMount () {
		Image.getSize(this.props.source, (width, height) => {
			let windowWidth = Dimensions.get('window').width;
			let m = windowWidth / width;
			this.setState({
				width: windowWidth,
				height: height * m,
			});
		})
	}

	render() {
		if(!this.state.width || !this.state.height)
			return null;
		return (
			<Image
				resizeMode="cover"
				source={{uri: this.props.source}}
				style={{width: this.state.width, height: this.state.height}}
			/>
		);
	}

}

const styles = StyleSheet.create({
	scrollView: {
		marginBottom:60
	},
	swiper: {

	},
	slideImg: {
		height: Dimensions.get('window').width,
		resizeMode: 'cover',
	},
	goodsInfo: {
		backgroundColor:'#fff',
		paddingBottom: 16,
	},
	goodsInfoMain: {
		padding: 16,
		borderTopColor: '#dcdce1',
		borderTopWidth: 1 / Global._pixelRatio,
		borderBottomColor: '#dcdce1',
		borderBottomWidth: 1 / Global._pixelRatio,
	},
	btns: {
		position:'absolute',
		bottom:0,
		width:Dimensions.get('window').width,
		paddingTop: 10,
		paddingBottom: 10,
		paddingLeft: 16,
		paddingRight: 16,
		flexDirection:'row',
		alignItems:'center',
		backgroundColor:'#fff',
		borderTopWidth:1 / Global._pixelRatio,
		borderTopColor:Global.Color.LIGHTER_GRAY,
		justifyContent:'space-around'
	},
	btnNowBuy: {
		backgroundColor: '#ff8347',
		borderColor: '#ff8347',
	},
	btnAddShoppingCart: {
		backgroundColor: Global.Color.RED,
		borderColor: Global.Color.RED,
		marginLeft: 10,
	},
	buySelectHead: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderBottomColor: Global.Color.LIGHT_GRAY,
		borderBottomWidth: 1 / Global._pixelRatio,
	},
	buySelectTitle: {
		flexDirection:'row',
		alignItems:'center',
		justifyContent: 'center',
		flex: 2,
	},
	buySelectTitleTxt: {
		fontSize: Global.FontSize.BASE,
		color: Global.Color.DARK_GRAY,
	},
	clearImage: {
		width: 21,
		height: 21,
		resizeMode: 'contain',
		margin: 16,
	},
	goodsChangeImage: {
		width: 33,
		height: 33,
		resizeMode: 'contain',
	},
});

export default GoodDetail;



