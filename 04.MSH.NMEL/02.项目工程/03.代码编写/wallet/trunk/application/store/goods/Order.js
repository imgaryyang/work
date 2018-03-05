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
import * as ECGB from '../util/ShopUtil';
import EasyIcon     from 'rn-easy-icon';
import NavBar       from 'rn-easy-navbar';
import EasyButton from 'rn-easy-button';

import OrderDetail from '../user/OrderDetail';
import AddressList from '../user/AddressList';

const FIND_URL = ECGB.ServerUrl+'?act=interface_app&op=address';

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

			this.setState({
				fetchOk:true,
				address:responseData.root
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
				content = <View style={{padding:5}}>
					<View style={{flexDirection:'row'}}>
						<Text style={{flex:1}}>{this.state.address.true_name}</Text>
						<Text style={{flex:1,textAlign:'right'}}>{this.state.address.mob_phone}</Text>
					</View>
					<Text>{this.state.address.area_info}</Text>
					<Text>{this.state.address.address}</Text>
				</View>
			}else {
				content = <Text>新增收货地址</Text>
			}
		}else {
			content = <Text>...</Text>
		}
		return (

				<View style={{height:100}}>
					<View style={{borderBottomWidth:1,borderBottomColor:'#fff',paddingLeft:5,paddingTop:5}}>
						<Text style={styles.title}>收货信息:</Text>
					</View>
					<TouchableOpacity onPress={()=>{
						if(!this.state.address)
							return false;

						this.props.navigator.push({
							hideNavBar:true,
							component:AddressList,
							title:'设置收货地址',
							passProps: {
								from:'order',
								refreshFn:(addrId)=>{
									console.log("addrId:",addrId);
									this.setState({
										fetchOk:false,
										address:null
									},()=>{
										this.fetchData(addrId);
									});
								}
							}
						});
					}}>
						<View style={{flex:1,flexDirection:'row',backgroundColor:'#eee'}}>
							<View style={{flex:1}}>
								{content}
							</View>
							<View style={{justifyContent:'center',alignItems:'center'}}>
								<EasyIcon name="ios-arrow-forward"/>
							</View>
						</View>
					</TouchableOpacity>
				</View>

		);
	}

	_goodsInfo() {
		if(this.props.from && this.props.from === 'cart'){
			return <View style={{padding:10}}>
				{this._goods.map((item)=>{
					return(
						<View>
							<View style={{flexDirection:'row'}}>
								<Image source={{uri:ECGB.ServerDomain + item.goods_image}} style={{width:60,height:60}}/>
								<View>
									<Text>{item.goods_name}</Text>
									<Text>{item.goods_price}</Text>
								</View>
							</View>
							<Text>数量：{item.goods_num}</Text>
						</View>
					);
				})}
				<View>
					<Text>商品数量：{this.props.num}</Text>
					<Text>免运费</Text>
					<Text>快递配送</Text>
				</View>
			</View>
		} else {
			return (
				<View style={{padding:10}}>
					<View style={{flexDirection:'row'}}>
						<Image source={{uri:ECGB.ServerDomain+this._goods.goods_image2}} style={{width:60,height:60}}/>
						<View>
							<Text>{this._goods.goods_name}</Text>
							<Text>{this._goods.goods_price}</Text>
						</View>
					</View>
					<View>
						<Text>购买数量：{this.props.num}</Text>
						<Text>免运费</Text>
						<Text>快递配送</Text>
					</View>
				</View>
			);
		}
	}

	_orderInfo() {
		return (
			<View style={{paddingVertical:20,paddingHorizontal:20,alignItems:'center',justifyContent:'center'}}>
				<Text>共需支付 ￥8999.0</Text>
			</View>
		);
	}

	async save() {
		this.setState({
			disableSubmit:true
		});

		let url = `${ECGB.ServerUrl}?act=interface_app&op=order`;
		let body = ECGB.toQueryString({
			goods_id:this._goods.goods_id,
			goods_num:this.props.num,
			area_id:this.state.address.area_id,
			city_id:this.state.address.city_id,
			address_id:this.state.address.address_id,
			uid:this._uid  //FIXME 暂时写死
		});

		if(this.props.from && this.props.from === 'cart'){
			url = `${ECGB.ServerUrl}?act=interface_app&op=cart`;
			let cart = (()=>{
				let tmp = [];
				this._goods.forEach((v,i)=>{
					tmp.push(v.cart_id + '|' + v.goods_num);
				});
				return tmp.join(',');
			})();
			body = ECGB.toQueryString({
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
					{this._orderInfo()}
					<EasyButton disabled={this.state.disableSubmit} text="提交订单" style={{marginTop:20,marginHorizontal:20}} onPress={()=>{
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
	}
});

export default Order;



