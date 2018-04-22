"use strict";

import { Component, PropTypes } from 'react';
import Confirm from '../../components/Confirm.jsx';
import baseUtil from '../../utils/baseUtil.jsx';
import logUtil,{log} from '../../utils/logUtil.jsx';
import CashPay from '../cashierDesk/CashPay.jsx';
import AliPay from '../cashierDesk/AliPay.jsx';
import WeixinPay from '../cashierDesk/WeixinPay.jsx';
import UnionPay from '../cashierDesk/UnionPay.jsx';
import BalancePay from '../cashierDesk/BalancePay.jsx';
import ForegiftOrder from './ForegiftOrder.jsx';
import ForegiftDone from './ForegiftDone.jsx';
/**
 * 预存流程
 */
class Page extends Component {
	constructor (props) {
		super(props);
		const { channel } = props.params||{};
		this.error = this.error.bind(this);
		this.loadInpatientInfo = this.loadInpatientInfo.bind(this);
		
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
		  'balance': { payChannelCode : 'balance',payTypeCode:'balance'},// 余额
		  'unionpay': { payChannelCode : machine.mngCode,payTypeCode:'ssm'},// 银行卡支付
		  '9999' : { payChannelCode : '9999',payTypeCode:'scan'},// 支付宝支付
		  '9998' : { payChannelCode : '9998',payTypeCode:'scan'},// 微信支付
		  '0000' : { payChannelCode : '0000',payTypeCode:'cash'},
		}
		this.state = {
			mask:false,
			inpatientInfo:{},
			step : 1,
			channel:channel,
			order:{},
			settlement:{},
		}
	}
	componentWillMount(){
		var patient = baseUtil.getCurrentPatient();
		if(!patient.no)return;
		else if(patient.balance<=0){
			baseUtil.error('您的门诊预存余额为0,无需转账到住院预缴费用中');
		}else{
			this.loadInpatientInfo();
		}
	}
	error(msg){
		this.setState({mask:true},()=>{
			baseUtil.error(msg);
		});
	}
	loadInpatientInfo(){
		var patient = baseUtil.getCurrentPatient();
		var param = {patientNo:patient.no};
		log('加载住院信息');
		let fetch = Ajax.get("/api/ssm/treat/inpatient/info",param,{catch: 3600});
		fetch.then(res => {
		  log('加载住院信息返回',res);
		  if(res && res.success){
			  var inpatientInfo = res.result||{};
			  this.setState({inpatientInfo,mask:false})
		  }else if( res && res.msg ){
			  this.error(res.msg);
		  }else{
			  this.error("暂无该病人的住院信息,请核实该病人是否已经办理完入院手续");
		  }
		}).catch((ex) =>{
			baseUtil.error("无法加载住院信息");
		})
	}
	reLoadInpatientInfo(){
		var patient = baseUtil.getCurrentPatient();
		var param = {patientNo:patient.no};
		log('重新加载住院信息');
		let fetch = Ajax.get("/api/ssm/treat/inpatient/info",param,{catch: 3600});
		fetch.then(res => {
		  log('重新加载住院信息返回',res);
		  if(res && res.success){
			  var inpatientInfo = res.result||{};
			  this.setState({inpatientInfo,mask:false,step:3})
		  }else if( res && res.msg ){
			  this.error(res.msg);
		  }else{
			  this.error("暂无该病人的住院信息,请核实该病人是否已经办理完入院手续");
		  }
		}).catch((ex) =>{
			baseUtil.error("无法加载住院信息");
		})
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
		log('预缴预结算 ',settle);
		let fetch = Ajax.post("/api/ssm/payment/pay/preCreate",settle,{catch: 3600});
		fetch.then(res => {
		  if(res && res.success){
			  log('预缴预结算完毕',res.result);
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
			  this.setState({order:newOrder,settlement,},()=>{
				  this.reLoadInpatientInfo();
			  });
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
		
		const { step,channel,inpatientInfo } = this.state;
		return (
		  <div>
		  {
		  	step == 1?(//订单
		  	  <ForegiftOrder 
		  	  	channel = { channel }
		  	  	inpatientInfo ={ inpatientInfo }
		  	    afterOrderCreate={this.afterOrderCreate} 
		  	  />
		  	):null	
		  }
		  {
		  	step == 2 && channel=='balance'?(//余额
		  	  <BalancePay 
		  	  	order={this.state.order} 
		  	  	settlement={this.state.settlement} 
		  	  	afterPay = {this.afterPay}
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
		  		<ForegiftDone
		  			inpatientInfo ={ inpatientInfo }
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




///**
// * 查询住院预缴余额
// */
//export async function loadPrepaidBalance (param) {
//  return ajax.GET(_API_ROOT + '/api/ssm/treat/inpatient/deposit/balance');
//}
//
//
///**
// * 查询住院基本信息
// */
//export async function loadinpatientInfo (param) {
//  return ajax.GET(_API_ROOT + '/api/ssm/treat/inpatient/info',param);
//}
//
///**
// * 查询住院日清单
// */
//export async function loadInpatientBills (param) {
//  return ajax.GET(_API_ROOT + '/api/ssm/treat/inpatient/inpatientBill/list',param);
//}
