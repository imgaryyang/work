import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import { Row, Col, Button} from 'antd';

import config from '../../config';
import WorkSpace from '../../components/WorkSpace';
import Card from '../../components/Card';

import PayChannels from './PayChannels';
import UnionPay from './UnionPay';
import AliPay from './AliPay';
import CashPay from './CashPay';
import WeixinPay from './WeixinPay';

class DepositRecharge extends Component {
	
  constructor(props){
	  super(props);
	  this.prePay = this.prePay.bind(this);
	  this.afterPay = this.afterPay.bind(this);
	  this.onSelectChannel = this.onSelectChannel.bind(this);
  }
  state = {
  };
  componentWillMount() {
	  const { payChannel,payType } = this.props.payment;
	  if(payChannel) this.prePay(payChannel, payType);
  }
  componentWillReceiveProps(nextProps) {
	  const { payChannel,payType } = nextProps.payment; 
	  if(!this.props.payment.payChannel && payChannel)this.prePay(payChannel,payType);
  }
  onSelectChannel(payChannelCode,payTypeCode){
	  console.info('onSelectChannel ',payChannelCode,payTypeCode);
	  this.props.dispatch({
		  type:'payment/setState',
		  payload:{
			  payChannel:payChannelCode,
			  payType:payTypeCode,
		  },
		  //callback:()=>{this.prePay(payChannelCode)}
	  })
  }
  prePay(payChannelCode,payTypeCode){console.info('DepositRecharge prePay : 预支付,结算方式'+payChannelCode+'创建结算单');///预支付
  	if('0000' == payChannelCode){
		return;// 现金预支付在现金页面中单独处理
  	}
	const { order } = this.props.deposit.recharge;
	const settlement = {
	  order,
	  amt:order.amt,
	  payChannelCode,
	  payTypeCode,
	}
	this.props.dispatch({
		type:'payment/preCreate',
		payload:{settlement,},
	});
  }
  afterPay(success){console.info('预存 支付成功');//支付成功
	  if(this.props.afterPay)this.props.afterPay(success);
  }
  render() {
	const { machine } = this.props.frame;
    const { baseInfo } = this.props.patient;
    const { settlement, payChannel } = this.props.payment;
    console.info("payChannel ",payChannel,settlement.id );
    const { order } = this.props.deposit.recharge;
    let height = config.getWS().height - (22 + config.navBar.height) * config.remSize;
    const cardChannel = machine.mngCode;
    return (
      <WorkSpace style={{paddingTop: '4rem'}}>
      <Card  style = {{margin: '1rem 2rem 0.5rem 2rem', padding: '2rem 2rem 0 2rem', fontSize: '3rem'}} >
      <span>当前患者<font style = {{color: '#DB5A5A', fontSize: '4.5rem'}} >{baseInfo.name}</font>,请在充值前确认身份，以免您的财产损失！！</span>
      {
    	  ('0000' == payChannel && order.amt == 0)? null:(
    			  <span><br/>交易金额：<font style = {{color: '#BC1E1E', fontSize: '4.5rem'}} >{order.amt||0}</font>&nbsp;&nbsp;元</span>
    	  )
      }
	      
	  </Card>
	  <Row style = {{marginTop: '-4rem'}}>
      {
    	  payChannel?null :<PayChannels onSelect={this.onSelectChannel}/> 
      }
      {
    	  ( (payChannel=='unionpay' || payChannel == cardChannel) && settlement.id  )?<UnionPay afterPay={this.afterPay}/>:null 
      }
      {
    	  ( payChannel=='9999' && settlement.id )?<AliPay afterPay={this.afterPay} />:null 
      }
      {
    	  ( payChannel=='9998' && settlement.id )?<WeixinPay afterPay={this.afterPay} />:null 
      }
      {
    	  ( payChannel=='0000' )?<CashPay afterPay={this.afterPay} />:null 
      }
      </Row>
      </WorkSpace>
    );
  }
}
  

export default connect(({patient,deposit,payment,frame}) => ({patient,deposit,payment,frame}))(DepositRecharge);