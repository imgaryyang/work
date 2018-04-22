import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Row, Col, Icon }   from 'antd';
import moment               from 'moment';

import config               from '../../config';
import styles               from './CashPayMain.css';

import WorkSpace            from '../../components/WorkSpace';
import Card                 from '../../components/Card';
import Button               from '../../components/Button';


class CashPay extends React.Component {

  state = {
  };
  
  timer = 60 ; //60s无操作，自动提交
  
  constructor(props) {
    super(props);
    this.checkTimer= this.checkTimer.bind(this);
    this.submit = this.submit.bind(this);
    this.clickButton = this.clickButton.bind(this);
    this.startPay= this.startPay.bind(this);
  }
  componentWillReceiveProps(nextProps){ 
	  this.timer = 60;
  }
  componentDidMount(){
	  if(this.props.patient.baseInfo.no){
		  this.startPay();
	  }
  }
  startPay(){
	console.info("现金收费开始,监听钱箱,定时 ： ",this.timer);
	this.props.dispatch({
		type: "payment/listenCashBox",
		callback:()=>{
			this.checkTimer();
		}
	});
  }
  componentWillUnmount() {
	  if(this.props.patient.baseInfo.no){
		  this.timer = 0;
		  //this.submit();//注销时提交
	  }
  }
  checkTimer(){
	  if(this.timer > 0 ){
		  this.timer = this.timer-1;
		  setTimeout(this.checkTimer,1000);
	  }else{
		  console.info('时间到，自动提交订单');
		  this.submit();//时间到提交
	  }
  }
  afterPay(){
	  console.info('现金支付完毕,调用回调函数');
	  if(this.props.afterPay)this.props.afterPay();
  }
  submit(){console.info('提交订单');
  	this.props.dispatch({
		 type: "payment/closeCashBox",
	});
    const { order,settlement } = this.props.payment;
    console.info('现金订单id ： '+order.id,'现金结算单id ： '+settlement.id);
    if(!(order && order.id )){
    	console.info('未生成任何订单,返回首页');
    	this.props.dispatch(routerRedux.push('/homepage'));
    	return;
    }
    if(order && order.realAmt <= 0 ){
    	console.info('订单金额为 '+order.amt,'返回首页');
    	this.props.dispatch(routerRedux.push('/homepage'));
    	return;
    }
  }
  clickButton(){
	  this.timer=0;
  }
  render() {
    const { order,settlement } = this.props.payment;
    return (
      <WorkSpace fullScreen = {true} style = {{padding: '6rem 6rem 6rem 6rem'}} >
        <div style = {{ padding: '3rem 0 3rem 0'}} >
          <Card  style = {{height: '100%', textAlign: 'center'}} >
            <div className = {styles.payAmt} >本次预存金额&nbsp;<font>{order ? order.realAmt : 0}</font>&nbsp;元</div>
            </Card>
        </div>
        <div style = {{ padding: '0 0 3rem 0'}} >
          <Card  style = {{height: '100%'}} >
            <Row className = {styles.tip} >
              <Col span = {3} >提示</Col>
              <Col span = {21} >
	              {
	            	 (order.amt == 0 ) ? null : (
	            		<li style = {{color:'red'}}><Icon type="caret-right" />&nbsp;&nbsp;您可以插入超过<font>{order ? order.realAmt : 0}</font>&nbsp;元的纸币，剩余金额会存进您的余额账户中</li>
	            	  )
	              }
              	<li><Icon type="caret-right" />&nbsp;&nbsp;本机支持面额&nbsp;100、50、20、10、5、1&nbsp;元的人民币纸币</li>
                <li><Icon type="caret-right" />&nbsp;&nbsp;请将纸币整理平整按提示逐张放入现金入钞口</li>
              </Col>
            </Row>
          </Card>
        </div>
        <div style = {{ padding: '0 0 0 0'}} >
          <Button disabled={disableSubmit} text = "确定" onClick = {this.clickButton} />
        </div>
      </WorkSpace>
    );
  }
}
  
//minHeight:'10rem',lineHeight:'100%',
export default connect(({payment,patient}) => ({payment,patient}))(CashPay);
