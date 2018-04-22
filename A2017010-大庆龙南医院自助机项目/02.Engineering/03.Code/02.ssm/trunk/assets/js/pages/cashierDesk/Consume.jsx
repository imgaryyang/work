import React, { Component } from 'react';
import { Row, Col } from 'antd';

import Button from '../../components/Button.jsx';
import Card from '../../components/Card.jsx';
import NavContainer from '../../components/NavContainer.jsx';
import Steps from '../../components/Steps.jsx';
import baseUtil from '../../utils/baseUtil.jsx';
import logUtil,{ log } from '../../utils/logUtil.jsx';
import socket from '../../utils/socket.jsx';
import TimerPage from '../../TimerPage.jsx';
import styles from './Consume.css';
class DepositConsume extends TimerPage {
	
  constructor(props){
	  super(props);
	  this.onBack = this.bind(this.onBack,this);
	  this.onHome = this.bind(this.onHome,this);
	  this.clickButton = this.bind(this.clickButton,this);
	  this.consumeCallback = this.bind(this.consumeCallback,this);
	  this.afterPay = this.bind(this.afterPay,this);
	  this.consume  = this.bind(this.consume,this);
	  this.error = this.bind(this.error,this);
	  this.state = {
		showMask:false,
	  };
  }
  
  componentDidMount() {
  }
  onBack(){
    if(this.props.cancelPay)this.props.cancelPay(); 
  }
  onHome(){
    baseUtil.goHome('consumeHome'); 
  }
  afterPay(order,recMsg){//支付成功
	if(this.props.afterPay)this.props.afterPay(order,recMsg);
  }
  clickButton(){
	if(this.flag)return;//防止重复提交
	this.flag = true;
	this.setState({showMask:true},()=>{
		setTimeout(()=>{
			this.consume();//扣款遮罩
		},200)
	});
  }
  error(msg){
	this.setState({showMask:true},()=>{
		baseUtil.error(msg);
	});
  }
  consume(){
	var machine = baseUtil.getMachineInfo();
	var order = this.props.order;
	
	var response = {resultCode:'-1'};
	var { 
		selfAmt ,/**预存支付*/
		miAmt,/**记账金额*/
		paAmt ,/**自费金额*/
		reduceAmt,/**减免金额*/
		bizType,/**业务类型*/
	} = order; 
	
	if(selfAmt == 0 &&  miAmt == 0 && paAmt ==0 && reduceAmt ==0  ){//  ( bizType == '05' || bizType == '06' ) 
		log('消费-订单金额为0,不请求socket');
		response = {resultCode:'0',recMsg:{state:'0'}};
	}else{
		try {
		  if(order.bizType == '05'){//就诊卡支付
			  log('消费-准备扣除卡费 ', order.patientName,order.amt);
			  var resp = socket.SEND('F|' + order.patientCardNo + '|' + order.selfAmt+ '|'+ machine.hisUser + "|");
			  response = resp.data;
		  }else if(order.bizType == '06'){//建档费
			  log('消费-准备扣除建档费 ', order.patientName,order.amt);
			  var resp = socket.SEND('E|' + order.patientCardNo + '|' + order.selfAmt+ '|'+ machine.hisUser + "|");
			  response = resp.data;
		  }else{//正常收费
			  log('消费-准备结算 ', order.patientName,order.amt);
			  var resp = socket.SEND("C|"+order.patientCardNo+ "|"+ machine.hisUser + "|");
			  response = resp.data;
		  }	
		}catch (e) {
			log('消费-扣款异常 ',e);
			this.error('扣款异常 ');
			return;
		}
	}
	
	var { resultCode,recMsg } = response;
	if(resultCode=='0' && recMsg && recMsg.state =='0'){
		log("消费-扣款 成功");
		this.consumeCallback(true,recMsg);
	}else{
		log("消费-扣款失败  : ",resultCode,'recMsg',recMsg )
		this.error("扣款失败！！"); 
		this.consumeCallback(false,recMsg);
	}
  }
  consumeCallback(success,recMsg){
	var status = success?'1':'0';
	log("消费-登记扣款结果:"+success+","+status);
	var { order } = this.props;
	let fetch = Ajax.put('/api/ssm/treat/deposit/consume/'+order.id+"/"+status,{catch: 3600});
	fetch.then(res => {	log("消费-登记扣款返回:",res);
		if(res && res.success){
			var newOrder = res.result||{};
			//if(yczf)newOrder.realAmt = yczf;
			newOrder.realAmt = newOrder.amt;
			if(success)this.afterPay(newOrder,recMsg);//只有成功了才回调
		}else if( res && res.msg ){
			this.error(res.msg);
    	}else{
    		this.error("登记扣款结果失败");
    	}
	}).catch((ex) =>{
		this.error("登记扣款结果失败");
	});
  }
  render() {
	const { order,patient,steps,stepIndex } = this.props;
	let height = (document.body.clientHeight - 384)/2;
	const { showMask } = this.state;
	var loadingDisplay = showMask?'':'none' ;
	var stepCmp = null;
	if(steps){
		stepCmp = (<Steps steps = {steps} current = {(stepIndex||0)} />);
	}
    return (
      <NavContainer title='收费' onBack={this.onBack} onHome={this.onHome} >
      	{stepCmp}
        <div style = {{ padding: '6rem 0 3rem 0'}} >
          <Card  style = {{height: height+'px', textAlign: 'center'}} >
            <div className = 'consume_payAmt' >
            	您的就诊卡账户余额&nbsp;<font>{patient.balance ? patient.balance : 0}</font>&nbsp;元,
            	将被扣除&nbsp;<font>{order.selfAmt ? order.selfAmt : 0}</font>&nbsp;元
            </div>
          </Card>
        </div>
        <div style = {{ padding: '0 0 0 0'}} >
          <Button text = "确定" onClick = {this.clickButton} />
        </div>
        <div className='fm_modal' style={{display:loadingDisplay,backgroundImage:"url('./images/loading06.gif')"}}></div>
      </NavContainer>
    );
  }
}
module.exports = DepositConsume;
