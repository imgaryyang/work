import React,{ Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import WorkSpace from '../../components/WorkSpace';
import Steps from '../../components/Steps';
import Card  from '../../components/Card';
import config from '../../config';
import ForegiftOrder  from './ForegiftOrder';
import ForegiftDone  from './ForegiftDone';
import Foregift from '../cashierDesk/DepositForegift';
class ForegiftMain extends Component {
  constructor (props) {
    super(props);
    this.preStep = this.preStep.bind(this);
    this.afterForegift = this.afterForegift.bind(this);
  }
  state = { paydone : false ,verfied:false,showConfirm:false};
  componentWillMount () {//初始化，接管nav的返回按钮
	  const { baseInfo }  = this.props.patient;
	  if(!baseInfo.no)return;
	  const { nav } = this.props.frame;
	  const newNav = { ...nav,onBack:this.preStep,title:'住院预缴'};
	  //const { channel } = this.props.params;
	  this.props.dispatch({//清空支付信息
	      type: 'inpatient/loadInpatient',
	      payload:{param:{patientNo:baseInfo.no}}
	  });
	  
	  this.props.dispatch({
		  type:'frame/setState',
		  payload:{nav:newNav},
	  });
	  this.props.dispatch({//保证无残存订单信息
	      type: 'foregift/clearOrders',
	  });
	  this.props.dispatch({//清空支付信息
	      type: 'payment/reset',
	      
	  });
  }
  componentWillReceiveProps(nextProps){
	  const { order:old } = this.props.foregift.foregift;
	  const { order:now } = nextProps.foregift.foregift;
	  if(now.id != old.id){//订单已经生成
		 console.info("已生成预缴订单");
		 const { channel } = this.props.params;
		 this.selectPayChannel(channel);
	  }
  }
  selectPayChannel(channel){
	  var payload;
	  if('0000' == channel){
		  payload = {payChannel:channel, payType:'balance'};
  	  }else if('balance' == channel){
		  payload = {payChannel:channel, payType:'cash'};
  	  }else if('unionpay' == channel){
		  var { machine } = this.props.frame;
		  payload = {payChannel:machine.mngCode, payType:'ssm'}; 
	  }else if('9998' == channel || '9999' == channel){
		  payload = {payChannel:channel, payType:'scan'}; 
	  }
	  console.info("确认结算方式",channel);
	  this.props.dispatch({//确认结算方式
		  type:'payment/setState',
		  payload:payload
	  });
  }
  componentWillUnmount(){//销毁前，置空nav返回按钮
	  const { nav } = this.props.frame;
	  const newNav = { ...nav,onBack:null,title:''};
	 
	  this.props.dispatch({//清空订单信息
	      type: 'foregift/clearOrders',
	  });
	  this.props.dispatch({//清空支付信息
	      type: 'payment/reset',
	  });
	  this.props.dispatch({
		  type:'frame/setState',
		  payload:{nav:newNav},
	  });
  }
  
  preStep(){//步骤条+页面切换
	  const { paydone } = this.state;
	  if(paydone){
		  this.props.dispatch( routerRedux.push('/homepage'));
		  return;
	  }
	  const { foregift } = this.props.foregift;
	  const { order } = foregift;
	  if(!order || !order.id){//订单不存在 
		  this.props.dispatch( routerRedux.push('/homepage'));
		  return;
	  }
	  this.props.dispatch({//订单存在，清空订单信息，页面返回充值金额
	      type: 'foregift/clearOrders',
	  });
	  
  }
  afterForegift(){
	  this.setState({paydone:true})
  }
  render () {
	const { channel } = this.props.params;
	const { order } = this.props.foregift.foregift;
	const { paydone } = this.state;console.info('foregift order ',order);
    const height = config.getWS().height - 11 * config.remSize+ 'px';
    return (
      <WorkSpace style = {{paddingTop: '4rem'}} >
      {
    	  (order.id)?null:<ForegiftOrder channel={channel} />
      }
      {
    	  (order.id && !paydone)?<Foregift afterPay={this.afterForegift} />	:null
      }
      {
    	   paydone ? <ForegiftDone /> : null
      }
      </WorkSpace>
    );	
  }
}  

export default  connect(({foregift,patient,payment,frame,inpatient}) => ({foregift,patient,payment,frame,inpatient}))(ForegiftMain);
