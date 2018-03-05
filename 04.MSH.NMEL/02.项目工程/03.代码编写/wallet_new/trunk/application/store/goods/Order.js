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

import * as Global  from '../../Global';
import EasyIcon     from 'rn-easy-icon';
import NavBar       from '../common/TopNavBar';
import EasyButton from 'rn-easy-button';

import OrderDetail from '../user/OrderDetail';
import AddressList from '../user/AddressList';
import ShopAction from '../../flux/ShopAction';

const FIND_URL = Global.ServerUrl+'?act=interface_app&op=address';

class Order extends Component {

    static displayName = 'Order';
    static description = '组件';

    static propTypes = {
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,
		address:null,
		fetchOk:false,
		disableSubmit:false,
	};

	_goods = null;
	_uid = 6;
	_order = null;

    constructor (props) {
        super(props);
		this._goods = props.goods;

		this.totalAmount = 0;
		if (this._goods && this._goods.length > 0) {
			for (let item of this._goods) {
				let price = Global.accMul(item.goods_price, item.goods_num);
				this.totalAmount = Global.floatAdd(this.totalAmount, price);
			}
		} else {
			this.totalAmount = Global.accMul(this._goods.goods_price, this.props.num);
		}
		this.totalAmount = this.totalAmount.toFixed(2);
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
	async fetchData (addrId) {
		try {

			let url = FIND_URL + '&user_id=6';
			if(addrId){
				url += '&address_id='+addrId;
			} else {
				url +='&is_default=1';
			}

			let responseData = await this.request(
			 url,{ method : "GET" });

			if(!responseData.root || responseData.root.length === 0)
				this.setState({
					fetchOk:true,
					address:null,
				});
			else
				this.setState({
					fetchOk:true,
					address:responseData.root,
				});
		} catch(e) {
			this.handleRequestException(e);
		}
	}

	_showDetail() {
		let details = [];
		for(let prop in this._goods) {
			details.push(<Text>{JSON.stringify(prop)} --> {JSON.stringify(this._goods[prop])}</Text>);
		}
		return (
			<View>
				<Text>商品名称：{this._goods.goods_name}</Text>
				<Text>价格：{this._goods.goods_price}</Text>
				<View style={{backgroundColor:'#ccc',padding:10}}>
					{details}
				</View>
			</View>
		);
	}

	_addr() {
		let content = null;
		if(this.state.fetchOk){
			if(this.state.address && this.state.address.address_id){
				content = <View>
					<View style={{flexDirection:'row'}}>
						<Text style={[{flex:1}, styles.addressTopTxt]}>{this.state.address.true_name}</Text>
						<Text style={[{flex:1,textAlign:'right',marginRight:5,}, styles.addressTopTxt]}>{this.state.address.mob_phone}</Text>
					</View>
					<Text style={styles.addressBottomTxt}>{this.state.address.area_info} {this.state.address.address}</Text>
				</View>
			} else {
				content = <Text style={styles.addressTopTxt}>新增收货地址</Text>
			}
		}else {
			content = <Text>...</Text>
		}
		return (
				<View style={styles.addressModule}>
					<TouchableOpacity onPress={()=>{
						if(!this.state.fetchOk)
							return false;

						this.props.navigator.push({
							hideNavBar:true,
							component:AddressList,
							title:'设置收货地址',
							passProps: {
								from:'order',
								refreshFn:(addrId)=>{
									if(!addrId) {
										this.setState({
											address:null
										});
									} else {
										this.setState({
											fetchOk:false,
											address:null
										},()=>{
											this.fetchData(addrId);
										});
									}
								}
							}
						});
					}}>
						<View style={{flex:1,flexDirection:'row'}}>
							<View style={{flex:1}}>
								{content}
							</View>
							<View style={{justifyContent:'center',alignItems:'center',marginLeft: 10,}}>
								<Image style={styles.rightImg}
									source={require('../images/shop_center_right.png')}
								/>
							</View>
						</View>
					</TouchableOpacity>
				</View>

		);
	}

	_goodsInfo() {
		if(this.props.from && this.props.from === 'cart'){
			return <View style={styles.goodsList}>
				{this._goods.map((item)=>{
					return(
						<View style={styles.goodsListItem}>
							<Image source={{uri:Global.ServerDomain + item.goods_image}} style={{width:40,height:40}}/>
							<View style={styles.goodsParam}>
								<Text style={styles.goodsParamTxt}>{item.goods_name}</Text>
								<Text style={styles.goodsParamTxt2}>￥{item.goods_price}</Text>
								<Text style={styles.goodsParamTxt2}>×{item.goods_num}</Text>
							</View>
							{/*<View style={{flexDirection: 'row', alignItems: 'center'}}>
								<Image style={styles.rightImg}
									source={require('../images/shop_center_right.png')}
								/>
							</View>*/}
						</View>
					);
				})}
				<View style={styles.goodsTotal}>
					<Text style={styles.goodsTotalPrice}>共需支付：</Text>
					<Text style={styles.goodsTotalPriceTxt}>￥{this.totalAmount}</Text>
				</View>
			</View>
		} else {
			return (
				<View style={styles.goodsList}>
					<View style={styles.goodsListItem}>
						<Image source={{uri:Global.ServerDomain+this._goods.goods_image2}} style={{width:40,height:40}}/>
						<View style={styles.goodsParam}>
							<Text style={styles.goodsParamTxt}>{this._goods.goods_name}</Text>
							<Text style={styles.goodsParamTxt2}>￥{this._goods.goods_price}</Text>
							<Text style={styles.goodsParamTxt2}>×{this.props.num}</Text>
						</View>
						{/*<View style={{flexDirection: 'row', alignItems: 'center'}}>
							<Image style={styles.rightImg}
								source={require('../images/shop_center_right.png')}
							/>
						</View>*/}
					</View>
					<View style={styles.goodsTotal}>
						<Text style={styles.goodsTotalPrice}>共需支付：</Text>
						<Text style={styles.goodsTotalPriceTxt}>￥{this.totalAmount}</Text>
					</View>
				</View>
			);
		}
	}

	async save() {
		this.setState({
			disableSubmit:true
		});


		let allnum = 0;
		let url = `${Global.ServerUrl}?act=interface_app&op=order`;
		let body = Global.toQueryString({
			goods_id:this._goods.goods_id,
			goods_num:this.props.num,
			area_id:this.state.address.area_id,
			city_id:this.state.address.city_id,
			address_id:this.state.address.address_id,
			uid:this._uid  //FIXME 暂时写死
		});

		if(this.props.from && this.props.from === 'cart'){
			url = `${Global.ServerUrl}?act=interface_app&op=cart`;
			let cart = (()=>{
				let tmp = [];
				this._goods.forEach((v,i)=>{
					tmp.push(v.cart_id + '|' + v.goods_num);
					allnum+=v.goods_num;
				});
				return tmp.join(',');
			})();
			body = Global.toQueryString({
				cart:cart,
				area_id:this.state.address.area_id,
				city_id:this.state.address.city_id,
				address_id:this.state.address.address_id,
				uid:this._uid  //FIXME 暂时写死
			});
		}


		let options = {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: body
		};
		try {
			let responseData = await this.request(url, options);
			ShopAction.onShoppingCartNumAdd(-allnum);
			this.props.navigator.replace({
				hideNavBar:true,
				component:OrderDetail,
				title:'去支付',
				passProps:{
					orderId:responseData.root
				}
			});
		} catch(e) {
			this.setState({ disableSubmit: false });
			this.handleRequestException(e);
		}
	}

	render () {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		return (
			<View style = {Global._styles.CONTAINER} >
				{this._getNavBar()}
				<ScrollView style = {styles.scrollView}>
					{this._addr()}
					{this._goodsInfo()}
					<EasyButton disabled={this.state.disableSubmit} text="提交订单" style={{height: 48, marginTop: 40, marginLeft: 8, marginRight: 8, backgroundColor: Global.Color.RED}} onPress={()=>{
						if(!this.state.address){
							this.toast('请选择收货地址');
							return false;
						}
						this.save();
					}}/>
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
			<NavBar title = '提交订单'
		    	navigator = {this.props.navigator}
				route = {this.props.route}
		    	hideBackButton = {false} 
		    	hideBottomLine = {false} />
		);
	}

}

const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
	},
	title: {
		fontSize:12,
	},
	addressModule: {
		marginTop: 10,
		borderTopColor: '#dcdce1',
		borderTopWidth: 1 / Global._pixelRatio,
		borderBottomColor: '#dcdce1',
		borderBottomWidth: 1 / Global._pixelRatio,
		backgroundColor: '#fff',
		padding: 16,
	},
	addressTopTxt: {
		fontSize: Global.FontSize.BASE,
		color: Global.Color.DARK_GRAY,
	},
	addressBottomTxt: {
		marginTop: 10,
		fontSize: Global.FontSize.SMALL,
		color: Global.Color.DARK_GRAY,
	},
	rightImg: {
		width: 10,
		height: 18,
		resizeMode: 'contain',
	},
	goodsList: {
		marginTop: 10,
		borderTopColor: '#dcdce1',
		borderTopWidth: 1 / Global._pixelRatio,
		borderBottomColor: '#dcdce1',
		borderBottomWidth: 1 / Global._pixelRatio,
		backgroundColor: '#fff',
	},
	goodsListItem: {
		padding: 16,
		flexDirection: 'row',
		// alignItems: 'center',
		borderBottomColor: Global.Color.LIGHT_GRAY,
		borderBottomWidth: 1 / Global._pixelRatio,
	},
	goodsParam: {
		marginLeft: 10,
		flex: 1,
	},
	goodsParamTxt: {
		fontSize: Global.FontSize.BASE,
		color: Global.Color.DARK_GRAY,
	},
	goodsParamTxt2: {
		fontSize: Global.FontSize.SMALL,
		color: Global.Color.DARK_GRAY,
		marginTop: 3,
	},
	goodsTotal: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
	},
	goodsTotalPrice: {
		fontSize: Global.FontSize.SMALL,
		color: Global.Color.DARK_GRAY,
	},
	goodsTotalPriceTxt: {
		fontSize: Global.FontSize.BASE,
		color: Global.Color.DARK_GRAY,
	},
});

export default Order;



