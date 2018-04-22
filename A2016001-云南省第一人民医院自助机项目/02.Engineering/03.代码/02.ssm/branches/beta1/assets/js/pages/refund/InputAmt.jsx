import React, { PropTypes } from 'react';
import { Row, Col, Icon }   from 'antd';
import moment               from 'moment';

import styles  from './InputAmt.css';
import Confirm  from '../../components/Confirm.jsx';
import NavContainer from '../../components/NavContainer.jsx';
import NumKeyboard from '../../components/keyboard/NumKeyboard.jsx';
import Input from '../../components/Input.jsx';
import Card from '../../components/Card.jsx';
import Button from '../../components/Button.jsx';
import baseUtil from '../../utils/baseUtil.jsx'
import PrintWin from '../../components/PrintWin.jsx';

class InputAmt extends React.Component {

  constructor(props) {
    super(props);
    this.onBack = this.onBack.bind(this);
    this.onHome = this.onHome.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.submit = this.submit.bind(this);
    this.getLimit = this.getLimit.bind(this);
    this.renderInfoConfirm = this.renderInfoConfirm.bind(this);
    this.frozen = this.frozen.bind(this);
    this.afterRefund = this.afterRefund.bind(this);
    this.error = this.error.bind(this);
    this.state = {
		amt: '',
		infoConfirm:false,
		buttonDisabled: true,
		keyConfig:{maxLength:10,stateName:'amt'},
		settlement:{},
		printMsg:'',
		showPrintWin:false,
    };
  }
  componentWillMount() {
  }
  componentDidMount() {
  }
  onBack(){
	if(this.props.cancelAmt)this.props.cancelAmt();
  }
  onHome(){
	  baseUtil.goHome('refundAmtHome');
  }
  onKeyDown(key,limit){
	  var {maxLength,stateName} = this.state.keyConfig;
	  var old = this.state[stateName];
	  
	  if( old.indexOf('.')!= -1 ){//小数点后
		  if('.' == key)return;//不可以再点小数点
		  var as = old.split('.');
		  if(as.length>0 && as[1].length>=2  && '删除' !=key){
			  return;//最多两位小数
		  }
	  } 
	  if('0' == key && (old.length == 0 || "0" == old))return;
	  if('清空'==key)this.state[stateName]="";
	  else if('删除'==key){
		  if(old.length > 1)this.state[stateName]=old.substr(0, old.length - 1);//删除
		  else this.state[stateName]="0";
	  }else if("0" == old){
		  this.state[stateName]=key;
	  }else if(old.length < maxLength){
		  var txt = old+key;
		  var value = 0;
		  if('.' != txt){
			  value = parseFloat(old+key);
		  }
		  if(limit < value){
			  //console.info('limit',limit,'value ',value,'超过限额')
			  baseUtil.warning('您最多可以退款'+limit+'元');
			  return;
		  }else{
			  this.state[stateName]=txt;
		  }
	  }
	  //console.info('value : ',this.state[stateName]);
	  this.setState(this.state);
  }
  submit (limit) {
	this.setState({showPrintWin:true,printMsg:'正在处理'},()=>{
		  this.frozen(limit);	
	});
  }
  error(msg){
	 this.setState({showPrintWin:false},()=>{
		 baseUtil.error(msg);
	 });
  }
  frozen(limit){
	const patient = baseUtil.getCurrentPatient();
	const { account , record } = this.props;
	const { amt } = this.state;
	var hisOrder = {
		amount:amt,
		allowRefund:limit,
		
		patientNo:patient.no,
		patientName:patient.name,
		balance:patient.balance,
		
		accountName:account.accName || patient.name,
		account:account.accId,
		cardType:account.cardType,
		cardBankCode:account.cardBank,
		paymentWay:account.accType,
		
		rechargeNumber:record.rechargeNumber||'0',
		recharge:record.recharge||'0',
		outTradeNo:record.outTradeNo||'',
	}
	console.info('冻结余额', hisOrder);
	
	let fetch = Ajax.post("/api/ssm/treat/deposit/preRefund",hisOrder,{catch: 3600});
	fetch.then(res => {
	  if(res && res.success){
		  var settlement =  res.result||{};
			console.info('冻结成功', settlement);
			this.setState({settlement},()=>{
				this.refund(settlement);
			});
	  }else{
		  var msg =(res && res.msg)?res.msg:"冻结账户金额失败，请联系运维人员或者到人工窗口处理！";
		  this.error(msg);
	  }
	}).catch((ex)=>{
		this.error("冻结账户金额失败，请联系运维人员或者到人工窗口处理！");
	});
  }
  refund(settlement){
    let fetch = Ajax.post("/api/ssm/payment/pay/refund",settlement,{catch: 3600});
	fetch.then(res => {
	  if(res && res.success){
		var order = res.result||{};
		console.info('退款返回order ',order);
		if(order.status == 'A' || order.status == '3' || order.status == '6' || order.status == '9'){
			//初始化，业务交易失败，退款失败状态，交易关闭提示退款失败。
			this.error('退款失败，请联系维护人员或者到人工窗口处理！');
		} else if(order.status == 'E'){//渠道异常
			this.error('退款渠道异常，请联系维护人员或者到人工窗口处理！', order);
		}else if(order.status == '5'){
			baseUtil.warning('退款已受理，请关注退款账户金额变化！ ');
			this.setState({order},()=>{
				this.afterRefund(order);
			})
		}else if(order.status == '0' || order.status == '7'){
			this.setState({order},()=>{
				this.afterRefund(order);
			})
		}else{
			this.error('退款失败，请联系维护人员或者到人工窗口处理！', order);
		}
	  }else{
		  console.info('退款返回失败 ');
		  var msg =(res && res.msg)?res.msg:"退款失败，请联系维护人员或者到人工窗口处理！";
		  this.error(msg);
	  }
	}).catch((ex)=>{
		this.error("退款异常，请联系维护人员或者到人工窗口处理！");
	});
  }
  afterRefund(){
	  const { order,settlement } = this.state;
	  this.setState({showPrintWin:false},()=>{
		  if(this.props.afterRefund){
			  this.props.afterRefund(order,settlement);
		  }
	  });
  }
  getLimit(){//可退金额
	  const patient   = baseUtil.getCurrentPatient();
	  const { record,creditAmt } = this.props;
	  if(record && record.rechargeNumber){ //可退金额取 余额和订单可退金额中最小值
		  return patient.balance > (record.recharge-record.refund) ? record.recharge-record.refund : patient.balance;
	  }else{
		  var limit = patient.balance - creditAmt ;
		  return limit > 0 ? limit : 0 ;
	  }
  }
  render() {
    const wsHeight  = document.body.clientHeight * 2 / 3;
    const cardStyle = {
            height: (wsHeight - 48) + 'px',
            padding: '4rem 2rem 4rem 2rem',
          };
    const  buttonStyle = {marginTop: '3rem', marginBottom: '3rem', };
    
    const patient  = baseUtil.getCurrentPatient();
    const limit = this.getLimit();
    var { amt }      = this.state;
    if(amt == '.' || amt == '' )amt = '0';
    return (
      <NavContainer title='退款金额' onBack={this.onBack} onHome={this.onHome} >
        <Row  style = {{margin: '10rem 0 10rem 0'}}>
          <Col span = {12} style = {{paddingRight: '1rem'}} >
            <Card  style = {cardStyle} >
              <span className = 're_amt_balance' >账户余额&nbsp;<font>{(patient.balance||0).formatMoney()}</font>&nbsp;元</span>
              <span className = 're_amt_balance' >最多可退款&nbsp;<font>{(limit||0).formatMoney()}</font>&nbsp;元</span>
              <Input focus = {true} value = {amt.formatMoney()} placeholder = "请输入您要退款的金额" />
              <Button text = "确定" disabled = {(parseFloat(amt)<=0)} style = {buttonStyle} 	onClick = {()=>{
            	  this.setState({infoConfirm:true});
              }}/>
              <span className = 're_amt_tip' >填写完金额后，请按“确定”键并按照引导提示完成退款。</span>
            </Card>
          </Col>
          <Col span = {12} style = {{paddingLeft: '1rem'}} >
            <NumKeyboard hasDot={true} onKeyDown = {(key)=>{this.onKeyDown(key,limit)}} maxLength={4} height = {wsHeight - 48} />
          </Col>
        </Row>
        <PrintWin msg={this.state.printMsg} visible={this.state.showPrintWin} />
        <Confirm   visible = {this.state.infoConfirm} 
	        buttons = {[
	          {text: '信息有误', outline: true, onClick:()=>{
	        	  this.setState({infoConfirm:false});
	          }},
	          {text: '确定', onClick: ()=>{
	        	  this.setState({infoConfirm:false},()=>{
	        	    this.submit(limit) ;
	        	  });	        	 
	          }},
	        ]}
	    info = {this.renderInfoConfirm()} />
     </NavContainer>
    );
  }
  renderInfoConfirm() {
    const patient = baseUtil.getCurrentPatient();
    const { account,creditAmt } = this.props;
    var accNo = account.accNo;
    var accountNo ="";
    if(accNo && accNo.length > 4)accountNo = accNo.substr(0,4)+"******"+accNo.substr(accNo.length-4,accNo.length)
	  
    let btnStyle = {marginTop: '2rem', /*width: '56rem',*/};
    return (
      <div style = {{padding: '1.5rem',marginTop:'-3rem'}} >
        <Card style = {{padding: '2rem'}} >
          <Row>
            <Col span = {12} className = 're_amt_label' >当前患者：</Col>
            <Col span = {12} className = 're_amt_text' >{patient.name}</Col>
          </Row>
          <Row>
	        <Col span = {12} className = 're_amt_label' >退款金额：</Col>
	        <Col span = {12} className = 're_amt_text' >{(this.state.amt||0).formatMoney()}</Col>
	      </Row>
          <Row>
            <Col span = {12} className = 're_amt_label' >接收退款账号：</Col>
            <Col span = {12} className = 're_amt_text' >{accountNo}</Col>
          </Row>
          {
        	  account.accName?(
        		  <Row>
        	          <Col span = {12} className = 're_amt_label'>银行卡户名：</Col>
        	          <Col span = {12} className = 're_amt_text' style = {{color: '#DB5A5A', fontSize: '4.5rem'}}>
        	          {account.accName}
        	          </Col>
        	      </Row>
        	  ):null
          }
          <Row>
            <Col span = {24} className ='re_amt_text' >请仔细核对以上信息，保证信息无误，否则将会影响您的退款，延误您的时间！</Col>
          </Row>
        </Card>
      </div>
    );
  }       
}
module.exports = InputAmt;
