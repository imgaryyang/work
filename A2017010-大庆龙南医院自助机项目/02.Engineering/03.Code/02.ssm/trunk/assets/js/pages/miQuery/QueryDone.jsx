import React, { PropTypes } from 'react';
import { Row, Col, Icon }   from 'antd';
import moment               from 'moment';

import listStyles           from '../../components/List.css';

import NavContainer from '../../components/NavContainer.jsx';
import Card from '../../components/Card.jsx';
import Button from '../../components/Button.jsx';
import baseUtil from '../../utils/baseUtil.jsx';
import TimerPage from '../../TimerPage.jsx';
/**
 * 生成收费订单
 */
class PaymentConfirm extends TimerPage {

  constructor(props) {
    super(props);
    this.onBack = this.bind(this.onBack,this);
    this.onHome = this.bind(this.onHome,this);
  }
  onBack(){
	  baseUtil.goHome('queryMiDone'); 
  }
  onHome(){
	 baseUtil.goHome('queryMiDone'); 
  }
  render() {
    let wsHeight    = 600;
    let cardHeight  = 336;
    let baseInfo    = baseUtil.getCurrentPatient();
    let { cardInfo } = this.props;
	
//    "state": "0",
//    "knsj": "01^03^180218154787484181153",
//    "grbh": "40925053",
//    "xm": "红志军",
//    "xb": "男",
//    "csrq": "1940/1/1 00:00:00",
//    "sfzh": "230604194001017357",
//    "cbsf": "",
//    "age": "77",
//    "ye": "4464.65",
//    "bz": "",
//    "dw": "第一采油厂第二油矿",
//    "rqlb": "","dwdm": "YB0Z","cwxx": ""
	
    
    return (
      <NavContainer title='医保信息' onBack={this.onBack} onHome={this.onHome} >
          <Row height = {wsHeight + 'px'} style = {{padding: '3rem', fontSize: '2.6rem', lineHeight: '5rem'}} >
            <Col span = {24} style = {{padding: '0 0 3rem 1.5rem'}} >
              <Card  style = {{height: cardHeight + 'px', padding: '2rem'}} >
                <Row>
                  <Col span = {12} className = 'list_amt' >姓名：</Col>
                  <Col span = {12} className = 'list_title' >{cardInfo.xm}</Col>
                </Row>
                <Row>
                  <Col span = {12} className = 'list_amt' >性别：</Col>
                  <Col span = {12} className = 'list_title' >{cardInfo.xb}</Col>
                </Row>
                <Row>
                  <Col span = {12} className = 'list_amt' >年龄：</Col>
                  <Col span = {12} className = 'list_title' >{cardInfo.age}&nbsp;岁</Col>
                </Row>
                <Row>
	              <Col span = {12} className = 'list_amt' >单位：</Col>
	              <Col span = {12} className = 'list_title' >{cardInfo.dw}&nbsp;</Col>
	            </Row>
                <Row  style = {{color: '#BC1E1E'}} >
                  <Col span = {12} className = 'list_amt' style = {{whiteSpace: 'nowrap'}} >医保账户余额：</Col>
                  <Col span = {12} className = 'list_title' >{cardInfo.ye}&nbsp;元</Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </NavContainer>
    );
  }
}
module.exports = PaymentConfirm;