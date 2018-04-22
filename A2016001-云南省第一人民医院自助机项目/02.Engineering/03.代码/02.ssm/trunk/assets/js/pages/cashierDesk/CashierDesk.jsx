import React, { Component } from 'react';
import { Row, Col } from 'antd';

import Button from '../../components/Button.jsx';
import NavContainer from '../../components/NavContainer.jsx';
import Steps from '../../components/Steps.jsx';
import Card from '../../components/Card.jsx';
import baseUtil from '../../utils/baseUtil.jsx';
import logUtil,{ log } from '../../utils/logUtil.jsx';
import PayChannels from './PayChannels.jsx';
import Consume from './Consume.jsx';
import CashPay from './CashPay.jsx';
import UnionPay from './UnionPay.jsx';
import WeixinPay from './WeixinPay.jsx';
import AliPay from './AliPay.jsx';


class DepositConsume extends Component {
	
  constructor(props){
	  super(props);
	  this.cancelPay = this.cancelPay.bind(this);
	  this.selectPayChannel = this.selectPayChannel.bind(this);
	  this.cancelPayChannel = this.cancelPayChannel.bind(this);
	  this.preCreate = this.preCreate.bind(this);
	  this.buildSettle = this.buildSettle.bind(this);
	  
	  this.cancelPay = this.cancelPay.bind(this);
	  this.cancelAli = this.cancelAli.bind(this);
	  this.cancelWX = this.cancelWX.bind(this);
	  this.cancelUnionpay = this.cancelUnionpay.bind(this);
	  this.afterPay = this.afterPay.bind(this);
	  this.reloadOrder = this.reloadOrder.bind(this);
	  this.afterRecharge =this.afterRecharge.bind(this);
	  const { channel ,order } = props;
	  
	  this.state = {
		step:1,
		channel:channel||'',
		settlement:{},
		order:order,
	  }
	  var machine = baseUtil.getMachineInfo();
	  this.channels={
		  'unionpay': { payChannelCode : machine.mngCode,payTypeCode:'ssm'},// 银行卡支付
		  '9999' : { payChannelCode : '9999',payTypeCode:'scan'},// 支付宝支付
		  '9998' : { payChannelCode : '9998',payTypeCode:'scan'},// 微信支付
		  '0000' : { payChannelCode : '0000',payTypeCode:'scan'},
	  }
  }
  componentWillMount(){
	 //如果支付渠道确认，则预结算 
	  log('进入收银台');
  }
  cancelPayChannel(){
	  this.cancelPay();
  }
  selectPayChannel(channel){
	  this.setState({channel},()=>{
		  if(channel != '0000'){
			this.preCreate();
		  }else{
			this.setState({step:2});
		  }
	  });
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
  preCreate(){
	const { order } = this.state;
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
  cancelPay(){
    if(this.props.cancelPay)this.props.cancelPay(); 
  }
  cancelAli(){
	this.setState({step:1, settlement:{}});
  }
  cancelWX(){
	this.setState({step:1, settlement:{}});
  }
  cancelCash(){
	this.setState({step:1, settlement:{}});
  }
  cancelUnionpay(){
	this.setState({step:1, settlement:{}});
  }
  afterPay(settle){
	this.reloadOrder(settle);
  }
  reloadOrder(settlement){
	var { order }  = this.state;
	let fetch = Ajax.get("/api/ssm/treat/deposit/order/get/"+order.id,{},{catch: 3600});
	fetch.then(res => {
	  if(res && res.success){
		  console.info('重新获取订单信息',res.result);
		  var newOrder = res.result||{};
		  this.afterRecharge(newOrder);
	  }else if( res && res.msg ){
		  baseUtil.error(res.msg);
	  }else{
		  baseUtil.error("查询订单信息失败");
	  }
	}).catch((ex) =>{
		baseUtil.error("查询订单信息失败");
	})
  }
  afterRecharge(newOrder){
	  if(this.props.afterRecharge)this.props.afterRecharge(newOrder);
  }
  render() {
	const { order } = this.props;
	const { step,channel,settlement} = this.state;
    return (
		<div>
		  {
	  	    step == 1?(//选择支付方式
	  	      <PayChannels
	  	      	order={order}
	  	    	cancelChannel={this.cancelPayChannel} 
	  	        onSelect={this.selectPayChannel} 
	  	      />
	  	    ):null	
	      }
		  {
		  	step == 2 && channel=='0000'?(//现金
		  	  <CashPay 
		  	  	order={order} 
		  	  	afterPay = {this.afterPay}
		  	  />
		  	):null	
		  }
		  {
		  	step == 2 && channel=='9998'?(//微信
		  	  <WeixinPay 
		  	  	order={order} 
		  	  	settlement={settlement} 
		  	  	afterPay = {this.afterPay}
		  	  	cancelPay={this.cancelAli}/>	
		  	):null	
		  }
		  {
		  	step == 2 && channel=='9999'?(//支付宝
		  	  <AliPay 
		  	  	order={order} 
		  	  	settlement={settlement} 
		  	  	afterPay = {this.afterPay}
		  	  	cancelPay={this.cancelAli}/>
		  	):null	
		  }
		  {
		  	step == 2 && channel=='unionpay'?(//银行卡
		  		<UnionPay
		  		  order={order} 
		  	  	  settlement={settlement} 
		  	  	  afterPay = {this.afterPay}
		  	  	  cancelPay={this.cancelAli}/>
		  	):null	
		  }
		</div>
    );
  }
}
module.exports = DepositConsume;
