'use strict';

import React, {
    Component,

} from 'react';

import {
    View,
    ScrollView,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
	InteractionManager,
	ActivityIndicator,
} from 'react-native';

import * as Global  from '../../Global';
import * as Filters from '../../utils/Filters';

import NavBar       from 'rn-easy-navbar';
// import EasyIcon     from 'rn-easy-icon';
import Card       	from 'rn-easy-card';
import Separator    from 'rn-easy-separator';
import Button       from 'rn-easy-button';

import CashierDesk 	from '../cashier-desk/CashierDesk';

const DETAIL_URL 	= "elh/charge/my/listByOrder/";

class BillDetail extends Component {

	statusConfig = {
		'0': {title: '待支付', 	color: Global._colors.ORANGE, 			icon: 'send-o', 	desc: '待付款状态',},
		'1': {title: '交易成功', 	color: Global._colors.IOS_GREEN, 		icon: 'stethoscope',desc: '交易完成状态',},
		'2': {title: '交易失败', 	color: Global._colors.IOS_RED, 			icon: 'envira',		desc: '交易失败状态',},
		'9': {title: '交易关闭', 	color: Global._colors.IOS_LIGHT_GRAY, 	icon: 'flash',		desc: '交易失败状态',},
		'##dft##': {title: '', 	color: Global._colors.BROWN, 			icon: 'file-text',	desc: '其他未知状态',},
	};

    static displayName = 'BillDetail';
    static description = '账单详情';

    static propTypes = {
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,
		billFolded: true,
		payFolded: true,
		billDetails: null,
		payDetails: null,
	};

    constructor (props) {
        super(props);
		this._renderBillDetails				= this._renderBillDetails.bind(this);
		//this._renderBillDetailItem			= this._renderBillDetailItem.bind(this);

      	//this.onPressBillDetails 			= this.onPressBillDetails.bind(this);
      	//this.onPressPayDetails 				= this.onPressPayDetails.bind(this);
      	this.goToPay 						= this.goToPay.bind(this);
      	this.onPayed 						= this.onPayed.bind(this);
    }

	componentDidMount () {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true}, () => {
				this.fetchDetailData();
				this.fetchBillData();
			});
		});
	}


	/**
	 * 查询明细数据
	 */
	async fetchDetailData () {
		try {
			let responseData = await this.request(Global._host + DETAIL_URL + this.props.bill.id, {
				method : "GET"
			});
			this.setState({
				billDetails: responseData.result, 
			});
		} catch(e) {
			this.handleRequestException(e);
		}
	}

	/**
	 * 查询账单数据
	 */
	async fetchBillData () {
		try {
			// TODO 暂时未做账单系统同步
			/*
			let responseData = await this.request(Global._host + BILL_URL + this.props.bill.id, {
				method : "GET"
			});
			
			this.setState({
				billDetails: responseData.result, 
			});
			*/
			if(this.props.bill.status == '1' || this.props.bill.status == '2'){
				this.setState({
					payDetails: {
						payType: 'wx',
						payTypeName: '微信支付',
						billNo: '201606191445128931',
						billTime: '2016-06-19 14:49:31',
						orderNo: this.props.bill.orderNo,
					}, 
				});	
			}
		} catch(e) {
			this.handleRequestException(e);
		}
	}

	/**
	 * 获取账单类型对应Icon
	 */
	getStatusConfig (status) {
		if(this.statusConfig[status])
			return this.statusConfig[status];
		else
			return this.statusConfig['##dft##'];
	}

	/**
	 * 去缴费
	 */
	goToPay (orderId, amt) {
		this.props.navigator.push({
			component: CashierDesk,
			hideNavBar: true,
			passProps: {
				orderId: orderId,
				callback: this.onPayed,
				backRoute: this.props.route
			}
		})
	}

	/**
	 * 支付完成回调
	 * @param  {[string]} orderId [订单ID]
	 * @param  {[boolean]} status  [支付状态]
	 * @return {[null]}         [description]
	 */
	onPayed (orderId, status) {
		if(status)
			this.toast('付款成功！');
		else
			this.toast('付款失败，请稍后再试！');

		this.props.navigator.popToTop();
		if(typeof this.props.refresh == "function"){

			this.props.refresh();
		}
	}
    /**
	 * 展开账单详情
	 */
    /*onPressBillDetails () {
		this.setState({
			billFolded: !this.state.billFolded,
		});
    }*/

    /**
	 * 展开支付详情
	 */
    /*onPressPayDetails () {
		this.setState({
			payFolded: !this.state.payFolded,
		});
    }*/

	render () {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		return (
			<View style = {Global._styles.CONTAINER} >
				{this._getNavBar()}

				<ScrollView style = {styles.scrollView} >
					<Card radius = {5} style = {{margin: 8, marginTop: 20, paddingLeft: 0, paddingRight: 0}} >
						<View style={[Global._styles.CENTER, {
								flexDirection: 'row', 
								borderBottomWidth: 1 / Global._pixelRatio, 
								borderBottomColor: Global._colors.IOS_SEP_LINE,
								padding: 10,
								paddingTop: 0,
							}]} >
							<EasyIcon iconLib = "fa" 
								name = {this.props.iconConfig.icon} 
								color = "#ffffff" bgColor = {this.props.iconConfig.bgColor}
								size = {15} width = {30} height = {30} radius = {15} />
							
							<Text style={styles.billDesc} >{this.props.bill.description}</Text>
							<Text style={styles.billStatus} >{this.getStatusConfig(this.props.bill.status).title}</Text>
						</View>
						<Text style={styles.billAmt} >{Filters.filterMoney(this.props.bill.amount)}</Text>
					</Card>

					<Card radius = {5} style = {{margin: 8, marginTop: 2}} >
						{this._renderBillDetails()}

						<Separator height = {1 / Global._pixelRatio} bgColor = "default" style={styles.sep} />
						<View style = {[styles.rowItem]}>
							<Text style = {[styles.itemLeft]} >创建时间</Text>
							<Text style = {[styles.itemRight, {width: 120, }]} >{this.props.bill.createTime}</Text>
						</View>
						
						{this._renderPayDetails()}
					</Card>

					{this._renderPayButton()}
					<Separator height = {40} />

				</ScrollView>
			</View>
		);
	}

	/**
	 * 渲染账单信息
	 */
	_renderBillDetails () {
		//let icon = this.state.billFolded ? "angle-down" : "angle-up";
		
		let loadingView = !this.state.billDetails ? (
			<ActivityIndicator />
		) : this.state.billDetails.length == 0 ? (
			<View style = {[styles.subRowItem]} >
				<Text style={styles.itemLeft} >无对应账单明细信息</Text>
			</View>
		) : null;

		let billDetails = this.state.billDetails && this.state.billDetails.length > 0 ? this.state.billDetails.map(
			({name, comment, receiveAmount, key}, idx) => {
				return (
					<View key = {name} style = {[styles.subRowItem]} >
						<Text style={styles.itemLeft} >{name}</Text>
						<Text style={styles.itemRight} >{Filters.filterMoney(receiveAmount)}</Text>
					</View>
				);
			}
		) : null;

		return (
			<View>
				<View style = {[styles.rowItem,{marginTop: 0}]}>
					<Text style={styles.itemLeft}>账单明细</Text>
					{/*<TouchableOpacity style = {styles.touchRight} onPress = {()=>{this.onPressBillDetails();}}>
						<Text style={[styles.itemRight,{flex: 1,}]} >{Filters.filterMoney(this.props.bill.amount)}</Text>
						<EasyIcon iconLib = 'fa' name = {icon} size = {18} width = {20} height = {20} color = {Global._colors.IOS_ARROW} />
					</TouchableOpacity>*/}
				</View>
				{loadingView}
				{billDetails}
				{/*this._renderBillDetailItem()*/}
			</View>
		);
	}

	/**
	 * 渲染账单明细信息
	 */
	/*_renderBillDetailItem () {
		if(this.state.billDetails == null || this.state.billDetails.lenght == 0){
			return null;
		}
		if(this.state.billFolded){
			return null;
		}

		return this.state.billDetails.map(
			({name, comment, receiveAmount, key}, idx) => {
				return (
					<View key = {name} style = {[styles.rowItem]} >
						<Text style={styles.itemLeft} >{name}</Text>
						<Text style={styles.itemRight} >{Filters.filterMoney(receiveAmount)}</Text>
					</View>
				);
			}
		);
	}*/

	/**
	 * 渲染支付信息
	 */
	_renderPayDetails () {
		if(this.state.payDetails == null){
			return null;
		}

		//let icon = this.state.payFolded ? "angle-down" : "angle-up";
		
		return (
			<View>
				<Separator height = {1 / Global._pixelRatio} bgColor = "default" style={styles.sep} />
				<View style = {[styles.rowItem]}>
					<Text style={styles.itemLeft}>支付方式</Text>
					{/*<TouchableOpacity style = {styles.touchRight} onPress = {()=>{this.onPressPayDetails();}}>
						<Text style={[styles.itemRight,{flex: 1,}]} >{this.state.payDetails.payTypeName}</Text>
						<EasyIcon iconLib = 'fa' name = {icon} size = {18} width = {20} height = {20} color = {Global._colors.IOS_ARROW} />
					</TouchableOpacity>*/}
				</View>
				<View style = {[styles.subRowItem]} >
					<Text style={styles.itemLeft} >账  单  号</Text>
					<Text style={[styles.itemRight, {width: 150, }]} >{this.state.payDetails.billNo}</Text>
				</View>
				<View style = {[styles.subRowItem]} >
					<Text style={styles.itemLeft} >订  单  号</Text>
					<Text style={[styles.itemRight, {width: 150, }]} >{this.state.payDetails.orderNo}</Text>
				</View>
			</View>
		);
	}

	_renderPayButton () {
		let status = this.props.bill.status;
		if(status == "0"){
			return (
				<View style = {{margin: 8, marginTop: 12}} >
					<Button text = "立即付款"  onPress={() => this.goToPay(this.props.bill.id, this.props.bill.amount)}/>
				</View>
			);
		} else {
			return null;
		}
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
			<NavBar title = '账单详情' 
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
	billDesc: {
		flex: 1, 
		fontSize: 12, 
		color: Global._colors.FONT_GRAY,
		marginLeft: 12,
	},
	billStatus: {
		textAlign: 'right',
		width: 80, 
		fontSize: 12, 
		color: Global._colors.FONT_GRAY, 
	},
	billAmt: {
		textAlign: 'center', 
		fontSize: 40, 
		marginTop: 25,
		marginBottom: 25,
	},
	rowItem: {
		alignItems: 'center', 
		justifyContent: 'center',
		marginTop: 10,
		flexDirection: 'row',
	},
	subRowItem: {
		alignItems: 'center', 
		justifyContent: 'center',
		marginTop: 10,
		flexDirection: 'row',
		paddingLeft: 10,
	},
	itemLeft: {
		flex: 1,
		color: Global._colors.FONT_GRAY,
		fontSize: 12
	},
	itemRight: {
		textAlign: 'right',
		width: 80, 
		fontSize: 12, 
		color: Global._colors.FONT_GRAY, 
	},
	touchRight: {
		width: 80,
		justifyContent: 'center',
		alignItems: 'flex-end',
		flexDirection: 'row'
	},
	detailAmt: {
		textAlign: 'right',
		fontSize: 12, 
		color: Global._colors.FONT_GRAY, 
	},
	oppt: {
	},
	sep: {
		marginTop: 10,
	}
});

export default BillDetail;



