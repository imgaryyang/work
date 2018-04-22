import React,{ Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import WorkSpace from '../../components/WorkSpace';
import Card  from '../../components/Card';
import config from '../../config';

import AppointDepts from './AppointDepts';
import AppointSchedules from './AppointSchedules';
import AppointSources from './AppointSources';
import AppointConfirm from './AppointConfirm';

class AppointMain extends Component {
  constructor (props) {
    super(props);
    this.preStep = this.preStep.bind(this);
    this.nextStep = this.nextStep.bind(this);
  }
  componentWillMount () {//初始化，接管nav的返回按钮
	  const { dispatch,frame } = this.props;
	  const { nav } = frame;
	  const newNav = { ...nav,onBack:this.preStep,title:'预约挂号'};
	  dispatch({
		  type:'frame/setState',
		  payload:{nav:newNav},
	  });
  }
  preStep(){
	  const {department, schedule, appointment } = this.props.appoint;
	  if(appointment.appointmentNo){
		  this.props.dispatch({ type:'appoint/setState', payload:{appointment:{}},});
		  return;
	  }
	  if(schedule.scheduleId){
		  this.props.dispatch({ type:'appoint/setState', payload:{appointment:{},schedule:{}},});
		  return;
	  }
	  if(department.code){
		  this.props.dispatch({ type:'appoint/setState', payload:{appointment:{},schedule:{},department:{}},});
		  return;
	  }
	  this.props.dispatch( routerRedux.push('/homepage'));
  }
  nextStep(){
	  
  }
  render () {
	const {department, schedule, appointment } = this.props.appoint;
    const height = config.getWS().height - 11 * config.remSize+ 'px';
    
    return (
      <WorkSpace style = {{paddingTop: '4rem'}} >
      {
    	department.code ? null : (
    	  <AppointDepts />
    	)  
      }
      {
    	(!department.code || schedule.scheduleId) ? null : (
    	  <AppointSchedules />
      	)  
      }
      {
	  	(!schedule.scheduleId || appointment.appointmentNo) ? null : (
	  	   <AppointSources />
	    )  
	  }
      {
  	  	(!appointment.appointmentNo) ? null : (
  	  	  <AppointConfirm />	
  	    )  
  	  }
      </WorkSpace>
    );	
  }
}  

export default  connect(({appoint,frame}) => ({appoint,frame}))(AppointMain);
