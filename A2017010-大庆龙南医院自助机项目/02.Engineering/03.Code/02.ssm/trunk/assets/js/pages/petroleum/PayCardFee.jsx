import React, { Component } from 'react';
import { Row, Col } from 'antd';

import Button from '../../components/Button.jsx';
import NavContainer from '../../components/NavContainer.jsx';
import Steps from '../../components/Steps.jsx';
import Card from '../../components/Card.jsx';
import baseUtil from '../../utils/baseUtil.jsx';
import Consume from '../cashierDesk/Consume.jsx';
import CashierDesk from '../cashierDesk/CashierDesk.jsx';
import logUtil,{ log } from '../../utils/logUtil.jsx';
/*import TimerPage from '../../TimerPage.jsx';*/

class DepositConsume extends Component {
	
  constructor(props){
	  super(props);
	  /*this.cancelPay = this.bind(this.cancelPay,this);
	  this.afterPay = this.bind(this.afterPay,this);
	  this.state = {
		steps : ['读取医保卡', '校验手机号', '收费','发卡'],
	  }*/
	  this.cancelPay = this.cancelPay.bind(this);
	  this.afterPay = this.afterPay.bind(this);
	  this.cancelRecharge = this.cancelRecharge.bind(this);
	  this.afterRecharge = this.afterRecharge.bind(this);
	  this.state = {
		step:1,
		patient:props.patient,
	  }
  }
  cancelPay(){
    if(this.props.cancelPay)this.props.cancelPay(); 
  }
  /*afterPay(order){//支付成功
	if(this.props.afterPay)this.props.afterPay(order);
  }*/
  afterPay(order){//支付成功
	const { rechargeOrder } =this.state;
	if(this.props.afterPay)this.props.afterPay(rechargeOrder,order);
  }
  cancelRecharge(){
	  this.cancelPay();
  }
  afterRecharge(rechargeOrder){
	const loginInfo = this.props.patient;
	const consumeOrder = this.props.consumeOrder;
	log('建档-充值完毕加载用户信息',loginInfo);
	let fetch = Ajax.get("/api/ssm/treat/patient/info", loginInfo, {catch: 3600});
	fetch.then(res => {
		let patient = res.result||{};
    	return patient;
	}).then((patient)=>{
		log('建档-重新加载患者信息结果',patient);
		if(!patient || !patient.no){
			baseUtil.error('未注册的患者');
			return;
		}
		if(patient.balance < consumeOrder.amt){
			baseUtil.error('您充值后的余额不足扣除办卡费，请重新办卡');
			return;
		}
		this.setState({patient,rechargeOrder,step:2});
	}).catch((ex) =>{
		log('建档-重新加载患者信息异常!',ex); 
		baseUtil.error('加载患者信息异常!');
		return;
	})
  }
  render() {
	const { order,rechargeOrder,consumeOrder } = this.props;
	const { patient,step } = this.state;
	return (
	  <div>
	  {
	    (step == 1 && rechargeOrder && rechargeOrder.amt>0 )?(
  			<CashierDesk 
  				order= {rechargeOrder}
  				cancelRecharge={this.cancelRecharge}
  				afterRecharge={this.afterRecharge}
  			/>
	  	):null	
	  }
	  {
		(step == 2 || (rechargeOrder && rechargeOrder.amt<=0))?(
		      <Consume
		      	order={consumeOrder} 
		      	stepIndex = {3}
		        cancelPay = {this.cancelPay}
		      	patient={patient} 
		      	afterPay={this.afterPay} />
	  	):null	  
	  }
	  </div>
	);
  }
  /*render() {
	const { order,patient } = this.props;
    return (
      <Consume
      	order={order} 
      	steps = {this.state.steps}
      	stepIndex = {3}
        cancelPay = {this.cancelPay}
      	patient={patient} 
      	afterPay={this.afterPay} />
    );
  }*/
}
module.exports = DepositConsume;
