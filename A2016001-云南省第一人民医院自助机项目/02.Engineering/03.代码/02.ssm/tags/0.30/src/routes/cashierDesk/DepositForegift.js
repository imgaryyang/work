import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import config from '../../config';
import { Row, Col, Button} from 'antd';
import PayChannels from './PayChannels';
import UnionPay from './UnionPay';
import AliPay from './AliPay';
import WeixinPay from './WeixinPay';
import BalancePay from './BalancePay';

import Card from '../../components/Card';
import WorkSpace            from '../../components/WorkSpace';
class DepositForegift extends Component {
	
  constructor(props){
	  super(props);
	  this.prePay = this.prePay.bind(this);
	  this.afterPay = this.afterPay.bind(this);
	  this.onSelectChannel =this.onSelectChannel.bind(this);
  }
  state = {
  };
  componentWillMount() {
	  const { payChannel,payType } = this.props.payment;
	  console.info('foregiftmain WillMount payChannel: ',payChannel,payType);
	  if(payChannel)this.prePay(payChannel,payType);
  }
  componentWillReceiveProps(nextProps) {
	  const { payChannel,payType} = nextProps.payment;
	  
	  if(!this.props.payment.payChannel && payChannel)this.prePay(payChannel,payType);
  }
  onSelectChannel(payChannelCode,payTypeCode){
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
//	if('balance' == payChannelCode){
//		return;// 现金预支付在现金页面中单独处理
//	}
	const { order } = this.props.foregift.foregift;
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
    const { settlement,payChannel } = this.props.payment;
    console.info('payment ',payChannel);
    const { order } = this.props.foregift.foregift;
    let height = config.getWS().height - (22 + config.navBar.height) * config.remSize;
    const cardChannel = machine.mngCode;
    return (
      <WorkSpace>
      <Card  style = {{margin: '2rem', padding: '2rem', fontSize: '3rem'}} >
	      <span>交易金额：<font style = {{color: '#BC1E1E', fontSize: '4.5rem'}} >{order.amt||0}</font>&nbsp;&nbsp;元</span>
	  </Card>
	  <Row>
      {
    	  payChannel?null :<PayChannels onSelect={this.onSelectChannel}/> 
      }
      {
    	  ( payChannel=='unionpay' || payChannel == cardChannel  )?<UnionPay afterPay={this.afterPay}/>:null 
      }
      {
    	  payChannel=='balance'?<BalancePay afterPay={this.afterPay}/>:null 
      }
      {
    	  payChannel=='9999'?<AliPay afterPay={this.afterPay} />:null 
      }
      {
    	  payChannel=='9998'?<WeixinPay afterPay={this.afterPay} />:null 
      }
      </Row>
      </WorkSpace>
    );
  }
}
  

export default connect(({patient,foregift,payment,frame}) => ({patient,foregift,payment,frame}))(DepositForegift);
//{
//	  channel=='9999'?<PayChannels onSelect={this.onSelectChannel}/>:null 
//}
//{
//	  channel=='9998'?<PayChannels onSelect={this.onSelectChannel}/>:null 
//}


