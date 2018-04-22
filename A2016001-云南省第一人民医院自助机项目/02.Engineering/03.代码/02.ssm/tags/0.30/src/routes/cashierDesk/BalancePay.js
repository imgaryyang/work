import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Row, Col, Icon }   from 'antd';
import moment               from 'moment';

import config               from '../../config';
import styles               from './BalancePay.css';

import WorkSpace            from '../../components/WorkSpace';
import Card                 from '../../components/Card';
import Button               from '../../components/Button';
import Input                from '../../components/Input';
import NumKeyboard          from '../../components/keyboard/NumKeyboard';


class CashPay extends React.Component {

  state = {
  };
  
  timer = 60 ; //60s无操作，自动提交
  
  constructor(props) {
    super(props);
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
  afterPay(){
	  if(this.props.afterPay)this.props.afterPay();
  }
  submit(){
    const { order } = this.props.payment;
  	this.props.dispatch({
		 type: "payment/submitBalanceOrder",
		 callback:(success)=>{
			 if(success)this.afterPay();
		 }
	});
  }
  clickButton(){
	 this.submit();
  }
  render() {
    const { order,settlement } = this.props.payment;
    return (
      <WorkSpace fullScreen = {true} style = {{padding: '6rem 6rem 6rem 6rem'}} >
        <div style = {{ padding: '3rem 0 3rem 0'}} >
          <Card  style = {{height: '100%', textAlign: 'center'}} >
            <div className = {styles.payAmt} >本次预缴金额&nbsp;<font>{order ? order.amt : 0}</font>&nbsp;元</div>
          </Card>
        </div>
        <div style = {{ padding: '0 0 3rem 0'}} >
          <Card  style = {{height: '100%'}} >
            <Row className = {styles.tip} >
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
      </WorkSpace>
    );
  }
}
  
//minHeight:'10rem',lineHeight:'100%',
export default connect(({payment,patient}) => ({payment,patient}))(CashPay);
