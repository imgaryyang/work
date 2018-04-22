import React, { Component } from 'react';
import { Row, Col } from 'antd';

import Button from '../../components/Button.jsx';
import NavContainer from '../../components/NavContainer.jsx';
import Steps from '../../components/Steps.jsx';
import Card from '../../components/Card.jsx';
import baseUtil from '../../utils/baseUtil.jsx';
import Consume from '../cashierDesk/Consume.jsx';

class DepositConsume extends Component {
	
  constructor(props){
	  super(props);
	  this.cancelPay = this.cancelPay.bind(this);
	  this.afterPay = this.afterPay.bind(this);
	  this.state = {
		steps : ['读取身份证', '校验手机号', '收费','发卡'],
	  }
  }
  cancelPay(){
    if(this.props.cancelPay)this.props.cancelPay(); 
  }
  afterPay(order){//支付成功
	if(this.props.afterPay)this.props.afterPay(order);
  }
  render() {
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
  }
}
module.exports = DepositConsume;