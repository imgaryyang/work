import React,{ Component } from 'react';

import baseUtil from '../../utils/baseUtil.jsx';

import Card  from '../../components/Card.jsx';

import AppointDepts from './AppointDepts.jsx';
import AppointSchedules from './AppointSchedules.jsx';
import AppointSources from './AppointSources.jsx';
import AppointConfirm from './AppointConfirm.jsx';

class AppointMain extends Component {
  constructor (props) {
    super(props);
    this.selectDept = this.selectDept.bind(this);
    this.selectSchedule = this.selectSchedule.bind(this);
    this.onCancelSchedule = this.onCancelSchedule.bind(this);
    this.afterAppoint = this.afterAppoint.bind(this);
    this.onCancelAppoint = this.onCancelAppoint.bind(this);
    
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
	var patient = baseUtil.getCurrentPatient();
	const { step,limit } = this.state;
	if(patient.balance < limit ){
		baseUtil.error('为了不影响您的就医过程，请至少保证您的就诊卡账户余额大于'+limit+'元！');
		return null;
	}
  }
  selectDept(department){
	  this.setState({department,step:2});
  }
  selectSchedule(schedule){
	  this.setState({schedule:schedule,step:3});
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