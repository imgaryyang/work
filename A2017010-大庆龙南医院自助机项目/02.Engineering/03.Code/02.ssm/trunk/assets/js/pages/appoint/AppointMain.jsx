import React,{ Component } from 'react';

import baseUtil from '../../utils/baseUtil.jsx';
import TimerModule from '../../TimerModule.jsx';
import Card  from '../../components/Card.jsx';

import AppointDepts from './AppointDepts.jsx';
import AppointSchedules from './AppointSchedules.jsx';
import AppointSources from './AppointSources.jsx';
import AppointConfirm from './AppointConfirm.jsx';
import moment from 'moment';
class AppointMain extends TimerModule {
  constructor (props) {
    super(props);
    this.selectDept = this.bind(this.selectDept,this);
    this.selectSchedule = this.bind(this.selectSchedule,this);
    this.onCancelSchedule = this.bind(this.onCancelSchedule,this);
    this.afterAppoint = this.bind(this.afterAppoint,this);
    this.onCancelAppoint = this.bind(this.onCancelAppoint,this);
    
    var limit  = baseUtil.getSysConfig('appoint.balance.limit',10);
	
    this.state = {
    	step:1,
    	limit,
    	department:{},
    	schedule:{},
    	appointment:{}
    }
  }
  componentWillMount(){
//	var patient = baseUtil.getCurrentPatient();
//	const { step,limit } = this.state;
//	if(patient.balance < limit ){
//		baseUtil.error('为了不影响您的就医过程，请至少保证您的卡内余额大于'+limit+'元');
//		return null;
//	}
  }
  selectDept(department){
	  const { type,code,name } = department;
	  const patient = baseUtil.getCurrentPatient();
	  const { gender,birthday } = patient;
	  var isChild = moment().subtract(15, "years").isBefore(birthday);
	  
	  if((type == '4' ||  code == '35' || code == '36' || code == '38' ||code == '39' ||code == '92' || code == '96' ) && gender == '1' ){//妇科
		  baseUtil.error('男士不允许预约妇科！');
		  return;
	  }
	  if((type == '5' ||  code == '40' || code == '41' ) && gender == '1'){//产科
		  baseUtil.error('男士不允许预约产科！');
		  return;
	  }
	  if((type == '6' ||  code == '42' || code == '43' || code == '44' ) && !isChild ){//儿科
		  baseUtil.error('14岁以上不允许预约儿科');
		  return;
	  }
	  
	  this.setState({department,step:2});
  }
  selectSchedule(schedule){
	  //2017年12月12日添加
	  var registerAmount = schedule.registerAmount;//挂号费
	  const patient = baseUtil.getCurrentPatient();
	  var balance = patient.balance;//就诊卡余额
	  const medicalCardNo = patient.medicalCardNo;
	  if((medicalCardNo.substring(0,3) != '01^') && (medicalCardNo.substring(0,3) != '02^')){//自费患者
    	if(balance < registerAmount){//就诊卡内余额低于挂号费
    		baseUtil.error('您的就诊卡内余额为'+balance+'元，您的挂号费为'+registerAmount+'元，请您充值后再进行预约！');
  		  	return;
    	}
    	else{
    		this.setState({schedule:schedule,step:3});
    	}
	  }
	  else{
		this.setState({schedule:schedule,step:3}); 
	  }
  }
  onCancelSchedule(){
	  this.setState({department:{},step:1});
  }
  afterAppoint(appointment){
	  this.setState({appointment,step:4});
  }
  onCancelAppoint(){
	  this.setState({schedule:{},step:2});
  }
  render () {
	var patient = baseUtil.getCurrentPatient();
	if(!patient.no)return null;
	const { step,limit } = this.state;
    const height =( document.body.clientHeight -  132)+'px';
  
	return (
	  <div>
		  {
		  	step == 1?(
		  		<AppointDepts
		  		  afterSelect={this.selectDept}/>
		  	):null	
		  }
		  {
		  	step == 2?(
		  		<AppointSchedules 
		  		  department = {this.state.department}
		  		  onSelect={this.selectSchedule}
		  		  onCancel={this.onCancelSchedule}/>
		  	):null	
		  }
		  {
		  	step == 3?(
	  			<AppointSources
	  			  onCancel = {this.onCancelAppoint}
	  			  afterAppoint = {this.afterAppoint}
	  			  schedule = {this.state.schedule}/>
		  	):null	
		  }
		  {
		  	step == 4?(
		  		<AppointConfirm 
		  		  appointment = {this.state.appointment}/>
		  	):null	
		  }
	  </div>
    );	
  }  
}
module.exports = AppointMain;

//const _API_ROOT = "/api/ssm/treat/appointment";
//
///**
//* 获取排班科室 所有
//*/
//export async function loadDeptList (payload) {//暂无查询条件
//return ajax.GET(_API_ROOT + '/department/list', {});
//}
///**
//* 获取排班信息
//*/
//export async function loadScheduleList ( query ) {
//return ajax.GET(_API_ROOT + '/schedule/dept', query);
//}
//
///**
//* 获取号源信息
//*/
//export async function loadAppointSources (query) {//分页
//return ajax.GET(_API_ROOT + '/appointment/sources', query);
//}
///**
//* 预约登记
//*/
//export async function appointBook (appoint) {
//return ajax.POST(_API_ROOT + '/book', appoint);
//}
///**
//* 预约历史
//*/
//export async function loadAppointHistory (query) {
//return ajax.GET(_API_ROOT + '/appointment/list', query);
//}
///**
//* 预约签到
//*/
//export async function appointSign (appoint) {
//return ajax.POST(_API_ROOT + '/sign', appoint);
//}
///**
//* 取消预约
//*/
//export async function appointCancel (appoint) {
//return ajax.POST(_API_ROOT + '/cancel', appoint);
//}