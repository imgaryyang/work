import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Row, Col, Icon }   from 'antd';
import moment               from 'moment';

import config               from '../../config';
import styles               from './InputAmt.css';
import Confirm from '../../components/Confirm';

import {WorkSpace, Card, Button, Input, NumKeyboard} from '../../components';

class InputAmt extends React.Component {

  /**
  * 初始化状态
  */
  state = {amt: '',showConfirm:false, infoConfirm:false,buttonDisabled: true,keyConfig:{maxLength:8,stateName:'amt'}};

  constructor(props) {
    super(props);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.submit = this.submit.bind(this);
    this.getLimit = this.getLimit.bind(this);
   this.renderInfoConfirm = this.renderInfoConfirm.bind(this);
  }
  componentWillMount() {
  }
  componentDidMount() {
  }
  onKeyDown(key,limit){
	  var {maxLength,stateName} = this.state.keyConfig;
	  var old = this.state[stateName];
	  if('0' == key && old.length == 0 )return;
	  if('清空'==key)this.state[stateName]="";
	  else if('删除'==key)this.state[stateName]=old.substr(0, old.length - 1);//删除
	  else if(old.length < maxLength){
		  var value = parseFloat(old+key);
		  if(limit < value){
			  console.info('limit',limit,'value ',value,'超过限额')
			  this.setState({showConfirm:true});
			  return;
		  }else{
			  this.state[stateName]=old+key;
		  }
	  }
	  this.setState(this.state);
  }
  submit (limit) {
	const { amt } = this.state;
	this.props.dispatch({//点击保存，生成订单
      type: 'refund/refund',
      payload: {amt,limit}
    });
  }
  showMessage(){
	  
  }
  renderInfoConfirm() {
    const { baseInfo } = this.props.patient;
    const { account } = this.props.refund;
    var accNo = account.accNo;
    var accountNo = accNo.substr(0,4)+"******"+accNo.substr(accNo.length-4,accNo.length)
	  
    let btnStyle = {marginTop: '2rem', /*width: '56rem',*/};
    return (
      <div style = {{padding: config.navBar.padding + 'rem',marginTop:'-3rem'}} >
        <Card style = {{padding: '2rem'}} >
          <Row>
            <Col span = {12} className = {styles.label} >当前患者：</Col>
            <Col span = {12} className = {styles.text} >{baseInfo.name}</Col>
          </Row>
          <Row>
	        <Col span = {12} className = {styles.label} >退款金额：</Col>
	        <Col span = {12} className = {styles.text} >{this.state.amt}</Col>
	      </Row>
          <Row>
            <Col span = {12} className = {styles.label} >接收退款账号：</Col>
            <Col span = {12} className = {styles.text} >{accountNo}</Col>
          </Row>
          {
        	  account.accName?(
        		  <Row>
        	          <Col span = {12} className = {styles.label} >接收退款账户户名：</Col>
        	          <Col span = {12} className = {styles.text} >
        	          	<font style = {{color: '#DB5A5A', fontSize: '4.5rem'}} >{account.accName}</font>
        	          </Col>
        	      </Row>
        	  ):null
          }
          <Row>
            <Col span = {24} className = {styles.text} >请仔细核对以上信息，保证信息无误，否则将会影响您的退款，延误您的时间！</Col>
          </Row>
        </Card>
      </div>
    );
  }
  getLimit(){//计算限额
	  const { baseInfo}   = this.props.patient;
	  const { records,record,creditAmt } = this.props.refund;
	  if(record.rechargeNumber){
		  //可退金额取 余额和订单可退金额中最小值
		  return baseInfo.balance > (record.recharge-record.refund) ? record.recharge-record.refund : baseInfo.balance;
	  }else{
		  console.info("信用卡金额 ：",'creditAmt ： ',creditAmt);
		  var limit = baseInfo.balance - creditAmt ;
		  return limit > 0 ? limit : 0 ;
	  }
  }
  render() {
    const wsHeight  = config.getWS().height * 2 / 3;
    const cardStyle = {
            height: (wsHeight - 4 * config.remSize) + 'px',
            padding: '4rem 2rem 4rem 2rem',
          };
    const  buttonStyle = {marginTop: '3rem', marginBottom: '3rem', };
    
    const { baseInfo }   = this.props.patient;
    const limit = this.getLimit();
    const { amt }      = this.state;
    
    console.info('this.state.showConfirm ',this.state.showConfirm);
    return (
      <WorkSpace height = {wsHeight + 'px'} style = {{padding: '2rem'}} >
        <Row>
          <Col span = {12} style = {{paddingRight: '1rem'}} >
            <Card  style = {cardStyle} >
              <span className = {styles.balance} >账户余额&nbsp;<font>{(baseInfo.balance||0).formatMoney()}</font>&nbsp;元</span>
              <span className = {styles.balance} >最多可退款&nbsp;<font>{(limit||0).formatMoney()}</font>&nbsp;元</span>
              <Input focus = {true} value = {amt} placeholder = "请输入您要退款的金额" />
              <Button text = "确定" disabled = {(amt.length<=0)} style = {buttonStyle} 
              	onClick = {()=>{
              	 this.setState({infoConfirm:true});
              	}} />
              <span className = {styles.tip} >填写完金额后，请按“确定”键并按照引导提示完成退款。</span>
            </Card>
          </Col>
          <Col span = {12} style = {{paddingLeft: '1rem'}} >
            <NumKeyboard onKeyDown = {(key)=>{this.onKeyDown(key,limit)}} maxLength={4} height = {wsHeight - 4 * config.remSize} />
          </Col>
        </Row>
        <Confirm info = {'您最多可以退款'+limit.formatMoney()+'元'} visible = {this.state.showConfirm} 
	        buttons = {[{text: '确定', onClick: () =>{
	       	 this.setState({showConfirm: false});
	        }},]}
	       />
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
      </WorkSpace>
    );
  }
}
  

export default connect(({patient,refund}) => ({patient,refund}))(InputAmt);

//<Card  style = {{margin: '0 2rem 0 2rem', padding: '2rem 2rem 0 2rem', fontSize: '3rem'}} >
//<span>
//	账户余额：
//	<font style = {{color: '#BC1E1E', fontSize: '4rem'}} >{(baseInfo.balance||0).formatMoney()}</font>&nbsp;&nbsp;元，
//	请选择您的退款账户
//</span>
//</Card>