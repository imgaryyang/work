import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Row, Col, Icon ,Modal }   from 'antd';
import moment               from 'moment';

import config               from '../../config';
import styles               from './CashPay.css';

import WorkSpace            from '../../components/WorkSpace';
import Card                 from '../../components/Card';
import Button               from '../../components/Button';
import Input                from '../../components/Input';
import NumKeyboard          from '../../components/keyboard/NumKeyboard';
import baseUtil          from '../../utils/baseUtil';

const config_time_total = 70;
const config_time_limit = 10;
class CashPay extends React.Component {

  state = {
		  showModal:false
  };
  
  timer = config_time_total ; //70s无操作，自动提交
  
  constructor(props) {
    super(props);
    this.checkTimer= this.checkTimer.bind(this);
    this.submit = this.submit.bind(this);
    this.clickButton = this.clickButton.bind(this);
    this.startPay= this.startPay.bind(this);
    this.delaySubmit = this.delaySubmit.bind(this);
  }
  componentWillReceiveProps(nextProps){ 
	  const { limit,order } = nextProps.payment;
	  if(order.realAmt >= limit ){
		  this.timer = config_time_limit;//达到限额
		  console.info('达到限额，时间耗尽');
	  }else {
		  console.info('重置时间',config_time_total);
		  this.timer = config_time_total;
	  }
  }
  componentDidMount(){
	  if(this.props.patient.baseInfo.no){
		  this.startPay();
	  }
  }
  startPay(){
	  if(! baseUtil.isTodayCanCash()){console.info('cash closed ');
		  return;
	  }
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
		  this.timer = config_time_limit;
		  //this.submit();//注销时提交
	  }
  }
  checkTimer(){
	  const { error,busy } = this.props.payment.cash;
	  if(this.timer > config_time_limit && !error ){
		  this.timer = this.timer-1;
		  console.info(this.timer);
		  setTimeout(this.checkTimer,1000);
	  }else{
		  if(busy){
			  this.timer = this.timer-1;
			  setTimeout(this.checkTimer,1000);
			  return;
		  }
		  if(error){
			  console.info('钱箱出现错误，自动提交订单');
		  }else{
			  console.info('时间到，自动提交订单');
		  }
		  this.props.dispatch({
			 type: "payment/closeCashBox",
		  });
		  this.setState({showModal:true},()=>{
			  console.info('延时三秒');
			  setTimeout(this.delaySubmit,3000); 
		  });
	  }
  }
  delaySubmit(){
	  this.setState({showModal:false},()=>{
		  console.info('延时完毕，提交代码');
		  this.submit();//时间到提交
	  });
  }
  afterPay(){
	  console.info('现金支付完毕,调用回调函数');
	  if(this.props.afterPay)this.props.afterPay();
  }
  submit(){console.info('提交订单');
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
  	this.props.dispatch({
		 type: "payment/submitCashOrder",
		 payload:{settlement},
		 callback:(success)=>{
			 if(success)this.afterPay();
		 }
	});
  }
  clickButton(){
//	  this.timer =30;
//	  this.submit();
	  this.timer = config_time_limit;
  }
  render() {
	const { busy } = this.props.payment.cash; 
    if(! baseUtil.isTodayCanCash()){
	  return (
		<WorkSpace fullScreen = {true} style = {{padding: '6rem 6rem 6rem 6rem'}} >
	        <div style = {{ padding: '0 0 3rem 0'}} >
	          <Card  style = {{height: '100%'}} >
	            <Row className = {styles.tip} >
	              <Col span = {3} >提示</Col>
	              <Col span = {21} >
	                <li><Icon type="caret-right" />&nbsp;&nbsp;本机器现金功能已关闭，如果您需要现金充值,可以到收费窗口办理</li>
	              </Col>
	            </Row>
	          </Card>
	        </div>
        </WorkSpace>  
	  )
	}
	var  careerWidth = config.getWS().width - config.navBar.padding * 2 * config.remSize;
	var  modalWinTop  = config.navBar.height + config.navBar.padding * 6 + 5;
    const { order,settlement } = this.props.payment;
    console.info('order.bizType :' ,order.bizType);
    const disableSubmit = order.amt > order.realAmt;//如果未达到订单金额，不允许手动提交
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
              	<li><Icon type="caret-right" />&nbsp;&nbsp;本机支持面额&nbsp;100、50、20、10&nbsp;元的人民币纸币</li>
                <li><Icon type="caret-right" />&nbsp;&nbsp;请将纸币整理平整按提示逐张放入现金入钞口</li>
              </Col>
            </Row>
          </Card>
        </div>
        <div style = {{ padding: '0 0 0 0'}} >
          <Button disabled={disableSubmit} text = "确定" onClick = {this.clickButton} />
        </div>
		  <Modal visible = {this.state.showModal} closable = {false} footer = {null} width = {careerWidth + 'px'} style = {{top: modalWinTop + 'rem'}} >
		  	<div  style = {{ fontSize:'3rem'}} > 现金检查中.... </div>
		  </Modal>
		  <Modal visible = {busy} closable = {false} footer = {null} width = {careerWidth + 'px'} style = {{top: modalWinTop + 'rem'}} >
		  	<div  style = {{ fontSize:'3rem'}} > 正在进钞.... </div>
		  </Modal>
      </WorkSpace>
    );
  }
}
  
//minHeight:'10rem',lineHeight:'100%',
export default connect(({payment,patient}) => ({payment,patient}))(CashPay);
