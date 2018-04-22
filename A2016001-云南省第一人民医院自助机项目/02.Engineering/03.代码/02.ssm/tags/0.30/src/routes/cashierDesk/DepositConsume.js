import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Row, Col } from 'antd';

import config               from '../../config';
import styles               from './DepositConsume.css';

import WorkSpace            from '../../components/WorkSpace';
import Card                 from '../../components/Card';
import Button               from '../../components/Button';
import Input                from '../../components/Input';
import NumKeyboard          from '../../components/keyboard/NumKeyboard';

class DepositConsume extends Component {
	
  constructor(props){
	  super(props);
	  this.submit = this.submit.bind(this);
	  this.clickButton = this.clickButton.bind(this);
	  this.afterPay = this.afterPay.bind(this);
  }
  state = {
  };
  
  componentDidMount() {
  }
  afterPay(){//支付成功
  }
  submit(){
   
  }
  clickButton(){
	  console.info( '充值结束，调用消费接口');
	  const { baseInfo } = this.props.patient;
	  const { order } = this.props.deposit.consume;
	  this.props.dispatch({
	      type: 'deposit/consume',
	      payload:{order,patient:baseInfo}
	  }); 
  }
  render() {// 预存消费只扣除selfAmt金额
	const { baseInfo } = this.props.patient;
	const { order } = this.props.deposit.consume;
	let height = (config.getWS().height - (22 + config.navBar.height) * config.remSize)/2;
    return (
      <WorkSpace fullScreen = {true} style = {{padding: '1.5rem 1.5rem 3rem 1.5rem'}} >
        <div style = {{ padding: '6rem 0 3rem 0'}} >
          <Card  style = {{height: height+'px', textAlign: 'center'}} >
            <div className = {styles.payAmt} >
            	您的账户余额&nbsp;<font>{baseInfo.balance ? baseInfo.balance : 0}</font>&nbsp;元,
            	将被扣除&nbsp;<font>{order.selfAmt ? order.selfAmt : 0}</font>&nbsp;元
            </div>
          </Card>
        </div>
        <div style = {{ padding: '0 0 0 0'}} >
          <Button text = "确定" onClick = {this.clickButton} />
        </div>
      </WorkSpace>
    );
  }
}

export default connect(({patient,deposit}) => ({patient,deposit}))(DepositConsume);