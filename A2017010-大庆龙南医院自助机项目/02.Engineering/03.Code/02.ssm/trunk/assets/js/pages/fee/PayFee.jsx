import React, { Component } from 'react';
import { Row, Col } from 'antd';

import Button from '../../components/Button.jsx';
import NavContainer from '../../components/NavContainer.jsx';
import Card from '../../components/Card.jsx';
import baseUtil from '../../utils/baseUtil.jsx';
import Consume from '../cashierDesk/Consume.jsx';
import TimerPage from '../../TimerPage.jsx';
class DepositConsume extends TimerPage {
	
  constructor(props){
	  super(props);
	  this.cancelPay = this.bind(this.cancelPay,this);
	  this.afterPay = this.bind(this.afterPay,this);
	  this.state = {
	  }
  }
  cancelPay(){
    if(this.props.cancelPay)this.props.cancelPay(); 
  }
  afterPay(order,recMsg){//支付成功
	if(this.props.afterPay)this.props.afterPay(order,recMsg);
  }
  render() {
	  
    const { order,patient } = this.props;
    return (
      <Consume
      	order={order} 
        cancelPay = {this.cancelPay}
      	patient={patient} 
      	afterPay={this.afterPay} />
    );
  }
}
module.exports = DepositConsume;
