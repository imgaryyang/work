"use strict";

import { Component, PropTypes } from 'react';
import { Row, Col, Icon ,Modal }   from 'antd';
import Confirm from '../../components/Confirm.jsx';
import Button from '../../components/Button.jsx';
import baseUtil from '../../utils/baseUtil.jsx';
import logUtil,{ log } from '../../utils/logUtil.jsx';
import medicalCardUtil from '../../utils/medicalCardUtil.jsx';
import CashPay from '../cashierDesk/CashPay.jsx';
import AliPay from '../cashierDesk/AliPay.jsx';
import WeixinPay from '../cashierDesk/WeixinPay.jsx';
// import UnionPay from '../cashierDesk/UnionPay.jsx';
import SingleePay from '../cashierDesk/SingleePay.jsx';
import PrepaidOrder from './PrepaidOrder.jsx';
import PrepaidDone from './PrepaidDone.jsx';
import TimerModule from '../../TimerModule.jsx';
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
class Page extends TimerModule {
	constructor (props) {
		super(props);
		const { channel } = props.params||{};
		this.next = this.bind(this.next,this);
		this.previous = this.bind(this.previous,this);
		this.preCreate = this.bind(this.preCreate,this);
		this.afterOrderCreate = this.bind(this.afterOrderCreate,this);
		this.buildSettle = this.bind(this.buildSettle,this);
		this.cancelAli = this.bind(this.cancelAli,this);
		this.cancelWX = this.bind(this.cancelWX,this);
		this.cancelUnionpay = this.bind(this.cancelUnionpay,this);
		this.afterPay = this.bind(this.afterPay,this);
		this.reloadOrder = this.bind(this.reloadOrder,this);
		this.onCancelCheckCard = this.bind(this.onCancelCheckCard,this);
		this.afterCheckCard = this.bind(this.afterCheckCard,this);
		this.listenCard = this.listenCard.bind(this);
		var machine = baseUtil.getMachineInfo();
	
		this.channels={
		  'unionpay': { payChannelCode : machine.mngCode,payTypeCode:'ssm'},// 银行卡支付
		  'singleepay': { payChannelCode : machine.mngCode,payTypeCode:'ssm'},// 银行卡支付
		  '9999' : { payChannelCode : '9999',payTypeCode:'scan'},// 支付宝支付
		  '9998' : { payChannelCode : '9998',payTypeCode:'scan'},// 微信支付
		  '0000' : { payChannelCode : '0000',payTypeCode:'scan'},
		}
		this.state = {
			step : 1,
			channel:channel,
			order:{},
			settlement:{},
			cardModal:false,
		}
		this.stopCard = false;
	}
	componentWillUnmount(){
		this.stopCard = true;
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
	onCancelCheckCard(){
		this.setState({cardModal:false},()=>{
			baseUtil.goHome('prepaidCancelCard');
		})
	}
	afterOrderCreate(order){
		this.setState({cardModal:true},()=>{
			this.listenCard(order);
		})
	}
	listenCard(order){console.info('prepaid listenCard ');
		var oldPatient = baseUtil.getCurrentPatient();
		var { cardModal } = this.state;
		if( !cardModal || this.stopCard )return;
		
		var cardState = medicalCardUtil.findCard();
		if(cardState == 144){
			var cardInfo = medicalCardUtil.readCard();
			var { cardNo } = cardInfo;
			var loginInfo = {medicalCardNo:cardInfo.cardNo,};
			let fetch = Ajax.post("/api/ssm/treat/patient/login", loginInfo, {catch: 3600});
			fetch.then(res => {
				let patient = res.result||{};
		    	return patient;
			}).then((patient)=>{
				log('prepaid-用户校验结果',patient);
				if(oldPatient.no != patient.no ){
					baseUtil.error('当前用户与登录用户不符，请重新操作!');
				}else{
					this.setState({cardModal:false},()=>{
						this.afterCheckCard(order);
					})
				}
			}).catch((ex) =>{
				log('prepaid-用户校验异常!',ex); 
				baseUtil.error('用户校验异常!');
				return;
			})
		}else{
			setTimeout(()=>{
				this.listenCard(order);
			},200);
		}
	}
	afterCheckCard(order ){
		const { step,channel } = this.state;
		if(channel != '0000'){
			this.preCreate(order);
		}else{
			this.setState({step:2,order:order});
		}
	}
	buildSettle(order){
		const { channel } = this.state;console.info('buildSettle ',channel);
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
		  	  	cancelPay={this.cancelWX}/>	
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
		  	step == 2 && channel=='singleepay'?(//银行卡
		  		<SingleePay
		  		  order={this.state.order} 
		  	  	  settlement={this.state.settlement} 
		  	  	  afterPay = {this.afterPay}
		  	  	  cancelPay={this.cancelUnionpay}/>
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
		  <Modal visible = {this.state.cardModal} closable = {false} footer = {null} width = {document.body.clientWidth * 0.6836 + 'px'} style={{top:'17rem'}} >
		      <div style = {{	backgroundColor:'#f5f5f5',marginTop:'-16px',marginBottom:'-50px',marginLeft:'-16px',marginRight:'-16px',}}>
			        <div className = 're_act_guideTextContainer' >
						<font className = 're_act_guideText' >重新刷卡校验!!!</font>
					</div>	
					<div style = {{height: '30rem', width: '30rem', margin: '3rem auto',backgroundColor:'#f5f5f5'}} >
						<img alt = "" src = './images/guide/med-card-read.gif' className = 'login_guidePic' />
					</div>
					<Row style = {{padding : '1.5rem'}} >
			            <Col span = {8}>&nbsp;</Col>
			            <Col span = {8}><Button text = "取消"  onClick = {this.onCancelCheckCard} /></Col>
			            <Col span = {8} >&nbsp;</Col>
		          </Row>
		      </div>
		  </Modal>
		  </div>
	    );
	}
}

Page.propTypes = {
  children: PropTypes.any
}

module.exports = Page;