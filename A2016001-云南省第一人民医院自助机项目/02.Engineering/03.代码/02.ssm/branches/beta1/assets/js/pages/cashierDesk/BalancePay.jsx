import React, { PropTypes } from 'react';
import { Row, Col, Icon }   from 'antd';
import moment               from 'moment';

import styles               from './BalancePay.css';
import Card                 from '../../components/Card.jsx';
import Button               from '../../components/Button.jsx';
import Input                from '../../components/Input.jsx';
import NumKeyboard          from '../../components/keyboard/NumKeyboard.jsx';
import NavContainer from '../../components/NavContainer.jsx';
import baseUtil from '../../utils/baseUtil.jsx';
import logUtil,{ log } from '../../utils/logUtil.jsx';

class BalancePay extends React.Component {

  constructor(props) {
    super(props);
	this.onHome = this.onHome.bind(this);
	this.onBack = this.onBack.bind(this);
    this.submit = this.submit.bind(this);
    this.clickButton = this.clickButton.bind(this);
    this.afterPay = this.afterPay.bind(this);
  }
  componentWillReceiveProps(nextProps){ 
  }
  componentDidMount(){
  }
  componentWillUnmount() {
  }
  onHome(){
	baseUtil.goHome('unionpayHome');//不考虑安全性
  }
  onBack(){
	log('unionpayBack');
	if(this.props.cancelPay)this.props.cancelPay();
  }
  afterPay(settle,order){
	  if(this.props.afterPay)this.props.afterPay(settle,order);
  }
  submit(){
    const { order,settlement } = this.props;
    log("余额-余额回调，结算单",settlement);
    let fetch = Ajax.post('/api/ssm/payment/pay/callback/balance/'+settlement.id,settlement,{catch: 3600});
	fetch.then(res => {
	  log("现金-余额回调返回",res);
	  if(res && res.success){
		  var settle = res.result;
		  if(!settle || !settle.order){
			  baseUtil.error("支付失败，请稍后再试");
		  }else{
			  var order = settle.order;
			  if( order.status !=  '0'){
				  log('现金-余额支付订单状态异常 ',order.status);
				  baseUtil.error("支付失败，请稍后再试");
			  }else{
				  this.setState({settlement:settle,order},()=>{
					  this.afterPay(settle,order);
				  });
			  }
		  }
	  }else{
		var msg = (res && res.msg)?res.msg:'门诊扣款失败';
		baseUtil.error(msg);
	  } 
    }).catch((ex) =>{
	  var msg = "门诊扣款异常"+JSON.stringify(ex);;
	  baseUtil.error('门诊扣款异常');
    }) 
  }
  clickButton(){
	 this.submit();
  }
  render() {
    const { order,settlement } = this.props;
    return (
      <NavContainer title='门诊余额' onBack={this.onBack} onHome={this.onHome} >
        <div style = {{ padding: '3rem 0 3rem 0'}} >
          <Card  style = {{height: '100%', textAlign: 'center'}} >
            <div className = 'bap_payAmt' >本次预缴金额&nbsp;<font>{order ? order.amt : 0}</font>&nbsp;元</div>
          </Card>
        </div>
        <div style = {{ padding: '0 0 3rem 0'}} >
          <Card  style = {{height: '100%'}} >
            <Row className = 'bap_tip' >
              <Col span = {3} >提示</Col>
              <Col span = {21} >
                <li><Icon type="caret-right" />&nbsp;&nbsp;您从预存账户中转到住院预缴中的金额，退款时将退回到预存账户中</li>
              </Col>
            </Row>
          </Card>
        </div>
        <div style = {{ padding: '0 0 0 0'}} >
          <Button text = "确定" onClick = {this.clickButton} />
        </div>
      </NavContainer>
    );
  }
}
module.exports = BalancePay;