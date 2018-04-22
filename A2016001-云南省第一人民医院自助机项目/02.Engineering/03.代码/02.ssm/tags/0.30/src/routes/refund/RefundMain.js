import React,{ Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import WorkSpace from '../../components/WorkSpace';
import config from '../../config';
import SelectAccount from './SelectAccount';
import RechargeRecords from './RechargeRecords';
import InputAmt from './InputAmt';
import RefundDone from './RefundDone';
class RefundMain extends Component {
	
  constructor (props) {
    super(props);
    this.preStep = this.preStep.bind(this);
  }
  componentWillMount () {//初始化，接管nav的返回按钮
	  if(!this.props.patient.baseInfo.no){
		  return;
	  }
	  const { nav } = this.props.frame;
	  
	  const newNav = { ...nav,onBack:this.preStep,title:"退款"};
	  this.props.dispatch({//接管返回按钮
		  type:'frame/setState',
		  payload:{nav:newNav},
	  });
  }
  componentWillReceiveProps(nextProps){
  }
  componentWillUnmount(){//销毁前，置空nav返回按钮
	  const { nav } = this.props.frame;
	  const newNav = { ...nav,onBack:null,title:''}
	  this.props.dispatch({
		  type:'frame/setState',
		  payload:{nav:newNav},
	  }); 
  }
  
  preStep(){
	  let { accounts,account,records,record } = this.props.refund;
	  console.info('refund prestep ',accounts,account,records,record);
	  if(record.rechargeNumber){
		  record={};
	  }else if(records && records.length>0){
		  record={};
		  records=[];
		  account={};
	  }else{
		  this.props.dispatch(routerRedux.push({pathname: '/homepage',}));
		  return;
	  }
	  this.props.dispatch({
		  type:'refund/setState',
		  payload:{
			  accounts,account,records,record 
		  },
	  }); 
  }
  afterRecharge(){
	  this.setState({paydone:true})
  }
  render () {
    //const height = config.getWS().height - 11 * config.remSize+ 'px';
	  const { account,record,order } =this.props.refund;
	  let refundDone=false;
	  if(  order.status == '0' || order.status == '5' || order.status == '7'  ){
		  refundDone = true;
	  }
	  console.info("order :", order);
    return (
      <WorkSpace style = {{paddingTop: '4rem'}} >
      {
    	  !refundDone && !(account.accNo)?  <SelectAccount/> :null
      }
      {
    	  !refundDone && ((account.accType == '0' && account.cardType == '1') || record.rechargeNumber)?  <InputAmt/> :null
	  }
      {
    	  !refundDone && (account.accNo && (account.accType != '0' || account.cardType == '0') && !record.rechargeNumber)?  <RechargeRecords/> :null
  	  }
      {
    	  refundDone? <RefundDone /> : null
      }
      </WorkSpace>
    );	
  }
}  

export default  connect(({refund,patient,frame}) => ({refund,patient,frame}))(RefundMain);
