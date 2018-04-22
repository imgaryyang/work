import React,{ Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import WorkSpace from '../../components/WorkSpace';
import Steps from '../../components/Steps';
import Card  from '../../components/Card';
import config from '../../config';
import NeedPay  from './NeedPay';
import PaymentConfirm from  './PaymentConfirm';
import PayDone from  './PayDone';
import Consume from '../cashierDesk/DepositConsume';
import Recharge from '../cashierDesk/DepositRecharge';
import baseUtil from '../../utils/baseUtil';
class FeeMain extends Component {
	
  constructor (props) {
    super(props);
    this.preStep = this.preStep.bind(this);
    this.afterRecharge = this.afterRecharge.bind(this);
    this.afterConsume = this.afterConsume.bind(this);
    this.goHome = this.goHome.bind(this);
  }
  
  state = { paydone : false };
  
  componentWillMount () {//初始化，接管nav的返回按钮
	  const { nav } = this.props.frame;
	  
	  const newNav = { ...nav,onBack:this.preStep,onHome:this.goHome,title:"缴费"};
	  
	  this.props.dispatch({//接管返回按钮
		  type:'frame/setState',
		  payload:{nav:newNav},
	  });
//	  this.props.dispatch({//保证无残存订单信息 TODO 会堆栈溢出
//	      type: 'deposit/clearOrders',
//	  });
	  this.props.dispatch({//清空支付信息
	      type: 'payment/reset',
	  });
	  
  }
  componentWillReceiveProps(nextProps){
	  const { order:oldOrder } = this.props.deposit.consume;
	  const { order:newOrder} = nextProps.deposit.consume;
	  
	  if(oldOrder.status != newOrder.status ){//消费订单变化
		 if(newOrder.status == '0' ) this.afterConsume();//消费完毕
	  }
  }
  componentWillUnmount(){//销毁前，置空nav返回按钮
//	  const { nav } = this.props.frame;
//	  const newNav = { ...nav,onBack:null,title:''}
//	  this.props.dispatch({//清空订单信息
//	      type: 'deposit/clearOrders',
//	  });
//	  this.props.dispatch({//清空支付信息
//	      type: 'payment/reset',
//	  });
//	  this.props.dispatch({
//		  type:'frame/setState',
//		  payload:{nav:newNav},
//	  });
  }
  goHome(){
	const { payChannel } = this.props.payment;
	const { recharge,consume } = this.props.deposit;
	const { paydone }  = this.state;
    const needRecharge = !paydone && (consume.order.id && recharge.order.id) ;
    if( needRecharge && payChannel == '0000' ){
    	baseUtil.notice('请点击确定完成您缴费'); 
		return ;
    }
    this.props.dispatch( routerRedux.push('/homepage'));
  }
  preStep(){//步骤条+页面切换
	const { payChannel } = this.props.payment;
	const { recharge,consume } = this.props.deposit;
	const { paydone }  = this.state;
    
    const needPay =!paydone && (!consume.order.id && !consume.order.patientNo);
    const payConfirm = !paydone && (!consume.order.id && consume.order.patientNo);
    
    const needRecharge = !paydone && (consume.order.id && recharge.order.id) ;
    const needConsume = !paydone && (consume.order.id && !recharge.order.id);
    if( paydone || needPay ){
    	this.props.dispatch( routerRedux.push('/homepage'));
    	return ;
    }
    if( needRecharge && payChannel == '0000' ){
    	baseUtil.notice('请点击确定完成您缴费'); 
		return ;
    }
    if( payConfirm || needConsume || needRecharge ){//返回收费列表
    	this.props.dispatch({type:'deposit/reset',});
    	return ;
    }
  }
  afterRecharge(){
	  this.setState({rechargeDone:true})
  }
  afterConsume(){
	  this.setState({paydone:true})
  }
  render () {
	const { recharge,consume } = this.props.deposit;
	const { paydone }  = this.state;
    const height = config.getWS().height - 11 * config.remSize+ 'px';
    
    const needPay =!paydone && (!consume.order.id && !consume.order.patientNo);
    const payConfirm = !paydone && (!consume.order.id && consume.order.patientNo);
    
    const needRecharge = !paydone && (consume.order.id && recharge.order.id) ;
    const needConsume = !paydone && (consume.order.id && !recharge.order.id);
    
    return (
      <WorkSpace style = {{paddingTop: '4rem'}} >
      {
    	  needPay?<NeedPay />:null
      }
      {
    	  payConfirm ? <PaymentConfirm />:null
      }
      {
    	  needRecharge ? <Recharge afterPay={this.afterRecharge} />	:null
      }
      {
    	  needConsume ? <Consume />	:null
      }
      {
    	  paydone ? <PayDone />	:null
      }
      </WorkSpace>
    );	
  }
}  

export default  connect(({deposit,patient,payment,frame}) => ({deposit,patient,payment,frame}))(FeeMain);
