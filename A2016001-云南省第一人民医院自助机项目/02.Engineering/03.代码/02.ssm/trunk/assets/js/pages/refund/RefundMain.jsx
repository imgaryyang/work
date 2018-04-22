"use strict";

import { Component, PropTypes } from 'react';
import { Row,Col }   from 'antd'
import Confirm from '../../components/Confirm.jsx';
import PrintWin from '../../components/PrintWin.jsx';
import baseUtil from '../../utils/baseUtil.jsx';

import styles from './SelectAccount.css';
import SelectAccount from './SelectAccount.jsx';
import CheckPhone from './CheckPhone.jsx';
import RechargeRecords from './RechargeRecords.jsx';
import InputAmt from './InputAmt.jsx';
import RefundDone from './RefundDone.jsx';
import polyfill from 'babel-polyfill';
/**
 * 退款流程
 * --获取可退款账户列表，选择账户
 * --验证手机号码
 * --银行卡刷入身份证
 * ----信用卡获取充值记录列表
 * ------选择充值记录，进入输入金额界面，输入金额，冻结金额，退款。
 * ----储蓄卡获取信用卡金额
 * ------进入输入金额界面，输入金额，冻结金额，退款。
 * --微信、支付宝 展示充值记录列表
 * ----选择充值记录，进入输入金额界面，输入金额，冻结金额，退款。
 */
class Page extends Component {
	constructor (props) {
		super(props);
		this.go = this.go.bind(this);
		this.afterActSelect = this.afterActSelect.bind(this);
		this.afterVerfied = this.afterVerfied.bind(this);
		this.cancelVerfied = this.cancelVerfied.bind(this);
		
		this.refundBank = this.refundBank.bind(this);
		this.loadCreditAmt = this.loadCreditAmt.bind(this);
		this.selectRecord = this.selectRecord.bind(this);
		this.cancelAmt = this.cancelAmt.bind(this);
		this.cancelRecord = this.cancelRecord.bind(this);
		this.afterRefund = this.afterRefund.bind(this);
		this.state = {
		  step:1,
		  creditAmt:0,
		  account:{},
		  record:{},
		  order:{},
		  settlement:{},
		}
	}
	go(step){
	  this.setState({step:step});
	}
	afterActSelect(account){
	  console.info('当前退款账户['+account.accNo+']户名：'+account.accName);
	  this.setState({account,step:2});
	}
	afterVerfied(){
	  const { account } = this.state;
	  const {accType } = account;
	  if(accType=='0'){// 银行卡
		  this.refundBank();
		  return;
	  }else{
		  this.setState({step:3});
	  }
	}
	refundBank(){
	  const { account } = this.state;
	  const { accType, cardBank, cardType } = account;
	  /**
		 * accType  账户类型 0：银行卡，1：支付宝 ，2：微信
		 * cardBank 卡所属银行
		 * cardType 卡类型 0：信用卡 1：非信用卡
		 */
	  console.info(accType,cardType);
	  if(accType=='0' && cardType=='1'){//储蓄卡
		  this.loadCreditAmt()
	  }else{
		  this.setState({step:3});
	  }
	}
	loadCreditAmt(){
		var patient = baseUtil.getCurrentPatient();
		let fetch = Ajax.get("/api/ssm/treat/deposit/creditIn50",patient,{catch: 3600});
		fetch.then(res => {
		  if(res && res.success){
			  var creditAmt = res.result||0;
			  this.setState({step:4,creditAmt});
		  }else{
			  var msg =(res && res.msg)?res.msg:"无法获取信用卡充值金额";
			  baseUtil.error(msg);
		  }
		}).catch((ex)=>{
			baseUtil.error("无法获取信用卡充值金额");
		});
	}
	cancelVerfied(){
		this.setState({step:1,account:{}});
	}
	cancelAmt(){
		const { record } = this.state; 
		console.info(record);
		if(record.account){
			this.setState({step:3,record:{}});
		}else{
			this.setState({step:1,record:{},account:{}});
		}
	}
	selectRecord(record){
		this.setState({record,step:4});
	}
	cancelRecord(){
		this.setState({step:1,record:{},account:{}});
	}
	afterRefund(order,settlement){
		baseUtil.reloadPatient((patient)=>{
			this.setState({step:5,order,settlement});
		});
	}
	render () { 
		var patient = baseUtil.getCurrentPatient();
		if(!patient.no)return null;
		
		const { step } = this.state;
		return (
		  <div>
		  {
		  	step == 1?(
		  	  <SelectAccount 
		  	  	afterSelect = {this.afterActSelect}/>
		  	):null	
		  }
		  {
		  	step == 2?(
		  	  <CheckPhone 
		  	  	type = {'RFO'}
		  	  	afterVerfied={this.afterVerfied} 
		  	  	cancelVerfied={this.cancelVerfied}/>
		  	):null	
		  }
		  {
		  	step == 3?(
		  	  <RechargeRecords 
		  	  	cancel = {this.cancelRecord}
		  	  	account = {this.state.account} 
		  	    selectRecord = {this.selectRecord}/>	
		  	):null	
		  }
		  {
		  	step == 4?(
		  	  <InputAmt 
		  	  	cancelAmt  = {this.cancelAmt}
		  	    creditAmt = {this.state.creditAmt}
		  	  	account = {this.state.account}
		  	  	record = {this.state.record}
		  	   afterRefund = {this.afterRefund}/>
		  	):null	
		  }
		  {
		  	step == 5?(
		  			<RefundDone order={this.state.order } settlement = {this.state.settlement} />
		  	):null	
		  }
		  </div>
	    );
	}
}

module.exports = Page;





//const _API_ROOT = "/api/ssm/treat/deposit";
//
///**
//* 查询充值账户列表
//*/
//export async function loadAccounts (patient) {
//return ajax.GET(_API_ROOT + '/accounts',patient);
//}
///**
//* 查询充值明细
//*/
//export async function loadRechareDetails (param) {
//return ajax.GET(_API_ROOT + '/records/detail',param);
//}
///**
//* 查询信用卡金额
//*/
//export async function getCreditAmt (patient) {
//return ajax.GET(_API_ROOT + '/creditIn50',patient);
//}
///**
//* 预退款
//*/
//export async function preRefund (order) {
//return ajax.POST(_API_ROOT + '/preRefund',order);
//}
//
///**
//* 退款
//*/
//export async function refund (order) {
//return ajax.POST("/api/ssm/payment/pay" + '/refund',order);
//}

//const { account } = this.state;
//const {accType ,cardBank, cardType} = account;
//// 银行卡->储蓄卡
//if(accType=='0' && cardType=='1'){
//	this.props.dispatch({
//		type:'refund/getCreditAmt',
//		payload:{account}
//	}); 
//	return;
//}
//  this.props.dispatch({
//	  type:'refund/loadRechareDetails',
//	  payload:{account}
//  }); 