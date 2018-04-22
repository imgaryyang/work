import React, { Component } from 'react';
import { Row, Col } from 'antd';

import Button from '../../components/Button.jsx';
import Card from '../../components/Card.jsx';
import NavContainer from '../../components/NavContainer.jsx';
import Steps from '../../components/Steps.jsx';
import baseUtil from '../../utils/baseUtil.jsx';
import logUtil,{ log } from '../../utils/logUtil.jsx';
import socket from '../../utils/socket.jsx';
import styles from './PayChannels.css';


class Page extends Component {
	
  constructor(props){
	  super(props);
	  this.onBack = this.onBack.bind(this);
	  this.onHome = this.onHome.bind(this);
	  this.onSelect = this.onSelect.bind(this);
	  this.afterSelect = this.afterSelect.bind(this);
  }
  
  componentDidMount() {
  }
  onBack(){
	  if(this.props.cancelChannel)this.props.cancelChannel();
  }
  onHome(){
    baseUtil.goHome('payChannelHome'); 
  }
  onSelect(channel){
	  this.afterSelect(channel);
  }
  afterSelect(channel){//console.info('afterSelect',channel);
	if(this.props.onSelect)this.props.onSelect(channel);
  }
  render() {
	 const { order } = this.props;
	const width           = document.body.clientWidth - 36,
		
        containerHeight = document.body.clientHeight - 13.5 * 12,
        height          = containerHeight * 5 / 7,
        cardWidth       = (width - 4 * 1.5 * 12) / 2,
        cardHeight      = height / 2 - 2 * 12,

        imgHeight       = cardHeight / 4,
        upImgWidth      = imgHeight * 600 / 376,
        weixinImgWidth  = imgHeight,
        alipayImgWidth  = imgHeight,
        cashImgWidth    = imgHeight * 600 / 365,

        cardStyle       = {
          height: cardHeight + 'px',
          textAlign: 'center',
          paddingTop: (cardHeight / 4) + 'px',
        };
		
    return (
      <NavContainer title='支付渠道' onBack={this.onBack} onHome={this.onHome} >
		<Card style = {{margin: '2rem', padding: '2rem', fontSize: '3rem'}} >
		  <span>交易金额：<font style = {{color: '#BC1E1E', fontSize: '4.5rem'}} >{order.amt}</font>&nbsp;&nbsp;元</span>
		</Card>
		<div style = {{width:width + 'px', height: height + 'px', position: 'relative'}} >
		  <div className = 'pay_chl_container' style = {{width: width + 'px', height: height + 'px', padding: '0 3rem'}} >
		    <Row gutter = {36} type = 'flex' justify = 'center' >
		      <Col className = 'pay_chl_col' style = {{paddingBottom: '36px'}} span = {12} >
		      	<Card shadow = {true} style = {cardStyle} onClick = {() => this.onSelect('0000')} >
		          <img src = './images/base/cash.png' width = {cashImgWidth} height = {imgHeight} />
		          <font>现金支付</font>
		        </Card>
		      </Col>
		      <Col className = 'pay_chl_col' style = {{paddingBottom: '36px'}} span = {12} >
		        <Card shadow = {true} style = {cardStyle} onClick = {() => this.onSelect('unionpay')} >
		          <img src = './images/base/union-pay.png' width = {upImgWidth} height = {imgHeight} />
		          <font>银行卡支付</font>
		        </Card>
		      </Col>
		      <Col className = 'pay_chl_col' style = {{paddingBottom: '36px'}} span = {12} >
		        <Card shadow = {true} style = {cardStyle} onClick = {() => this.onSelect('9999')} >
		          <img src = './images/base/alipay.png' width = {alipayImgWidth} height = {alipayImgWidth} />
		          <font>支付宝支付</font>
		        </Card>
		      </Col>
		      <Col className = 'pay_chl_col' style = {{paddingBottom:'36px'}} span = {12} >
		        <Card shadow = {true} style = {cardStyle} onClick = {() => this.onSelect('9998')} >
		          <img src = './images/base/weixin.png' width = {weixinImgWidth} height = {weixinImgWidth} />
		          <font>微信支付</font>
		        </Card>
		      </Col>
		    </Row>
		  </div>
		</div>
      </NavContainer>
    );
  }
}
module.exports = Page;