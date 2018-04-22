"use strict";

import { Component, PropTypes } from 'react';
import Confirm from '../../components/Confirm.jsx';
import baseUtil from '../../utils/baseUtil.jsx';

import CashPay from '../cashierDesk/CashPay.jsx';
import AliPay from '../cashierDesk/AliPay.jsx';
import WeixinPay from '../cashierDesk/WeixinPay.jsx';
import UnionPay from '../cashierDesk/UnionPay.jsx';
import PrepaidOrder from './PrepaidOrder.jsx';
import PrepaidDone from './PrepaidDone.jsx';
/**
 * 预存流程
 * --进入订单页面
 * ----现金，自动生成订单，生成订单
 * -------进入现金界面，监听钱箱，每次生成一笔结算单
 * -------支付完毕，重新加载个人信息和订单，进入结束页面
 * -------支付结束页面打印凭条
 * ----非现金，输入金额，点击确认生成订单
 * ------预结算，生成结算单
 * ------进入具体支付界面
 * ------支付完毕，重新加载个人信息和订单，进入结束页面
 * ------支付结束页面打印凭条
 */
class Page extends Component {
	constructor (props) {
		super(props);
		const { channel } = props.params||{};
		this.next = this.next.bind(this);
		this.previous = this.previous.bind(this);
		this.preCreate = this.preCreate.bind(this);
		this.afterOrderCreate = this.afterOrderCreate.bind(this);
		this.buildSettle = this.buildSettle.bind(this);
		this.cancelAli = this.cancelAli.bind(this);
		this.cancelWX = this.cancelWX.bind(this);
		this.cancelUnionpay = this.cancelUnionpay.bind(this);
		this.afterPay = this.afterPay.bind(this);
		this.reloadOrder = this.reloadOrder.bind(this);
		var machine = baseUtil.getMachineInfo();
		
		this.channels={
		  'unionpay': { payChannelCode : machine.mngCode,payTypeCode:'ssm'},// 银行卡支付
		  '9999' : { payChannelCode : '9999',payTypeCode:'scan'},// 支付宝支付
		  '9998' : { payChannelCode : '9998',payTypeCode:'scan'},// 微信支付
		  '0000' : { payChannelCode : '0000',payTypeCode:'scan'},
		}
		this.state = {
			step : 1,
			channel:channel,
			order:{},
			settlement:{},
		}
	}
	next(current){
		if(current<3){
			this.setState({step:current+1});
		}else{
			baseUtil.goHome('prepaidMainNext');
		}
	}
	previous(current){
		if(current>1){
			this.setState({step:current-1});
		}else{
			baseUtil.goHome('prepaidMainPre');
		}
	}
	afterOrderCreate(order){
		const { step,channel } = this.state;
		if(channel != '0000'){
			this.preCreate(order);
		}else{
			this.setState({step:2,order:order});
		}
	}
	buildSettle(order){
		const { channel } = this.state;
		var payChannel = this.channels[channel];
		if(!payChannel){
			baseUtil.error('不支持的支付渠道');
			return;
		}
		return { order,amt:order.amt, ...payChannel,};
	}
	preCreate(order){
		var settle = this.buildSettle(order);
		let fetch = Ajax.post("/api/ssm/payment/pay/preCreate",settle,{catch: 3600});
		fetch.then(res => {
		  if(res && res.success){
			  console.info('预结算完毕',res.result);
			  var settlement = res.result||{};
			  var newOrder = settlement.order||{};
			  this.setState({step:2,order:newOrder,settlement});
		  }else if( res && res.msg ){
			  baseUtil.error(res.msg);
		  }else{
			  baseUtil.error("无法创建预存结算单");
		  }
		}).catch((ex) =>{
			baseUtil.error("无法创建预存结算单");
		})
	}
	cancelAli(){
		this.setState({step:1,order:{},settlement:{}});
	}
	cancelWX(){
		this.setState({step:1,order:{},settlement:{}});
	}
	cancelUnionpay(){
		this.setState({step:1,order:{},settlement:{}});
	}
	afterPay(settle){
		baseUtil.reloadPatient((patient)=>{
			this.reloadOrder(settle);
		});
	}
	reloadOrder(settlement){
		var { order }  = this.state;
		let fetch = Ajax.get("/api/ssm/treat/deposit/order/get/"+order.id,{},{catch: 3600});
		fetch.then(res => {
		  if(res && res.success){
			  console.info('重新获取订单信息',res.result);
			  var newOrder = res.result||{};
			  this.setState({step:3,order:newOrder,settlement});
		  }else if( res && res.msg ){
			  baseUtil.error(res.msg);
		  }else{
			  baseUtil.error("查询订单信息失败");
		  }
		}).catch((ex) =>{
			baseUtil.error("查询订单信息失败");
		})
	}
	
	render () { 
		var patient = baseUtil.getCurrentPatient();
		if(!patient.no)return null;
		
		const { step,channel } = this.state;
		return (
		  <div>
		  {
		  	step == 1?(//订单
		  	  <PrepaidOrder 
		  	  	channel = { channel }
		  	    afterOrderCreate={this.afterOrderCreate} 
		  	  />
		  	):null	
		  }
		  {
		  	step == 2 && channel=='0000'?(//现金
		  	  <CashPay 
		  	  	order={this.state.order} 
		  	  	afterPay = {this.afterPay}
		  	  />
		  	):null	
		  }
		  {
		  	step == 2 && channel=='9998'?(//微信
		  	  <WeixinPay 
		  	  	order={this.state.order} 
		  	  	settlement={this.state.settlement} 
		  	  	afterPay = {this.afterPay}
		  	  	cancelPay={this.cancelAli}/>	
		  	):null	
		  }
		  {
		  	step == 2 && channel=='9999'?(//支付宝
		  	  <AliPay 
		  	  	order={this.state.order} 
		  	  	settlement={this.state.settlement} 
		  	  	afterPay = {this.afterPay}
		  	  	cancelPay={this.cancelAli}/>
		  	):null	
		  }
		  {
		  	step == 2 && channel=='unionpay'?(//银行卡
		  		<UnionPay
		  		  order={this.state.order} 
		  	  	  settlement={this.state.settlement} 
		  	  	  afterPay = {this.afterPay}
		  	  	  cancelPay={this.cancelAli}/>
		  	):null	
		  }
		  {
		  	step == 3?(//支付完成
		  		<PrepaidDone
		  			order={this.state.order} 
		  	  		settlement={this.state.settlement} 
		  	  	/>
		  	):null	
		  }
		  </div>
	    );
	}
}

Page.propTypes = {
  children: PropTypes.any
}

module.exports = Page;