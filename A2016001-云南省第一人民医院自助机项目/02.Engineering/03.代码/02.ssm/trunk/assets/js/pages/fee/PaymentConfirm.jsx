import React, { PropTypes } from 'react';
import { Row, Col, Icon }   from 'antd';
import moment               from 'moment';

import listStyles           from '../../components/List.css';

import NavContainer from '../../components/NavContainer.jsx';
import Card from '../../components/Card.jsx';
import Button from '../../components/Button.jsx';
import baseUtil from '../../utils/baseUtil.jsx';
/**
 * 生成收费订单
 */
class PaymentConfirm extends React.Component {

  constructor(props) {
    super(props);
    this.onBack = this.onBack.bind(this);
    this.onHome = this.onHome.bind(this);
    this.goToPay = this.goToPay.bind(this);
  }
  onBack(){
	if(this.props.onCancel) this.props.onCancel(); 
  }
  onHome(){
	 baseUtil.goHome('payConfirmHome'); 
  }
  goToPay () {
	console.info("创建收费订单");
	const { order } = this.props;
	let fetch = Ajax.post("/api/ssm/treat/fee/createOrder",order,{catch: 3600});
	fetch.then(res => {
		if(res && res.success){
			var orders = res.result||{};
			var {consume,recharge} = orders;
			console.info("创建收费订单完毕");
			console.info("消费订单",consume);
			console.info("充值订单",recharge);
			this.afterConfirm(consume,recharge);
		}else if( res && res.msg ){
			baseUtil.error(res.msg);
    	}else{
    		baseUtil.error("创建收费订单失败");
    	}
	}).catch((ex) =>{
		baseUtil.error("创建收费订单异常");
	})
  }
  afterConfirm(consume,recharge){
	  if(this.props.afterConfirm)this.props.afterConfirm(consume,recharge);
  }
  render() {
    let wsHeight    = 600;
    let cardHeight  = 336;
    let baseInfo    = baseUtil.getCurrentPatient();
    let { order } = this.props;
//    ...order,
//	selfAmt:result.yczf,// 预存支付
//	miAmt:result.jzje,// 记账金额
//	paAmt:result.zfje,// 自费金额
//	reduceAmt:result.jmje,// 减免金额
	
    return (
      <NavContainer title='预结算信息' onBack={this.onBack} onHome={this.onHome} >
          <Row height = {wsHeight + 'px'} style = {{padding: '3rem', fontSize: '2.6rem', lineHeight: '5rem'}} >
            <Col span = {24} style = {{padding: '0 0 3rem 1.5rem'}} >
              <Card  style = {{height: cardHeight + 'px', padding: '2rem'}} >
                <Row>
                  <Col span = {12} className = 'list_amt' >共需支付：</Col>
                  <Col span = {12} className = 'list_amt' >{(order.amt||0).formatMoney()}&nbsp;元</Col>
                </Row>
                <Row>
                  <Col span = {12} className = 'list_amt' >医保报销：</Col>
                  <Col span = {12} className = 'list_amt' >{(order.miAmt||0).formatMoney()}&nbsp;元</Col>
                </Row>
                <Row>
                  <Col span = {12} className = 'list_amt' style = {{whiteSpace: 'nowrap'}} >医保个人账户支付：</Col>
                  <Col span = {12} className = 'list_amt' >{(order.paAmt||0).formatMoney()}&nbsp;元</Col>
                </Row>
                <Row style = {{color: '#BC1E1E'}} >
                  <Col span = {12} className = 'list_amt' >还需支付：</Col>
                  <Col span = {12} className = 'list_amt' >{(order.selfAmt|| 0).formatMoney()}&nbsp;元</Col>
                </Row>
                {
	                  order.selfAmt > baseInfo.balance ?( 
	                		<Row style = {{color: '#BC1E1E'}} >
	                          <Col span = {12} className = 'list_amt' >余额不足，需要充值：</Col>
	                          <Col span = {12} className = 'list_amt' >{(order.selfAmt - baseInfo.balance)|| 0}&nbsp;元</Col>
	                        </Row>
	                  ):null
                }
              </Card>
            </Col>
          </Row>
          <Button text = "确认缴费" onClick = {this.goToPay} />
        </NavContainer>
    );
  }
}
module.exports = PaymentConfirm;