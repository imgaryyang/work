import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Row, Col }         from 'antd';
import moment               from 'moment';

import config               from '../../config';
import styles               from './AppointSources.css';
import Confirm              from '../../components/Confirm';
import {WorkSpace,Empty,Card,Button,ToolBar}          from '../../components';

class AppointSources extends React.Component {


  constructor(props) {
    super(props);
    this.selectAppoint = this.selectAppoint.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.prePage = this.prePage.bind(this);
    this.showBookConfirm = this.showBookConfirm.bind(this);
    this.closeBookConfirm = this.closeBookConfirm.bind(this);
    this.renderBookConfirm = this.renderBookConfirm.bind(this);
  }
  
  state = { pageNo:1,pageSize : 20,appointment:null  }
  
  componentWillMount() {
  }
  
  selectAppoint() {//预约请求 
	  const appointment = this.state.appointment;
	  this.setState({appointment:null},()=>{
		  this.props.dispatch({
			  type:"appoint/appointBook",
			  payload:{appointment:appointment}
		  });
	  }); 
//	  this.props.dispatch({//TODO 生产改为 appointBook 
//		  type:"appoint/setState",
//		  payload:{appointment:appointment}
//	  });
  }
  
  nextPage(){
	  const { pageNo } =this.state;
	  this.setState({pageNo:pageNo+1});
  }
  prePage(){
	  const { pageNo } =this.state;
	  this.setState({pageNo:pageNo-1});
  }
  showBookConfirm(appointment){
	 this.setState({appointment:appointment}); 
  }
  closeBookConfirm(){
	  this.setState({appointment:null}); 
  }
  renderBookConfirm(appointment) {
    let btnStyle = {marginTop: '2rem', /*width: '56rem',*/};
    return (
      <div style = {{padding: config.navBar.padding + 'rem'}} >
        <Card style = {{padding: '2rem'}} >
          <Row>
            <Col span = {8} className = {styles.label} >预约科室：</Col>
            <Col span = {16} className = {styles.text} >{appointment.deptName}</Col>
          </Row>
          <Row>
            <Col span = {8} className = {styles.label} >预约医生：</Col>
            <Col span = {16} className = {styles.text} >{appointment.doctorName}</Col>
          </Row>
          <Row>
            <Col span = {8} className = {styles.label} >预约时间：</Col>
            <Col span = {16} className = {styles.text} >
              {moment(appointment.appointmentTime).format('Y年M月D日')}&nbsp;
              {appointment.clinicDurationName}&nbsp;
              {moment(appointment.appointmentTime).format('HH:mm:SS')}
            </Col>
          </Row>
          <Row>
            <Col span = {8} className = {styles.label} >就诊序号：</Col>
            <Col span = {16} className = {styles.text} ><font>{appointment.appointmentNo}</font></Col>
          </Row>
          <Row>
            <Col span = {8} className = {styles.label} >就诊地址：</Col>
            <Col span = {16} className = {styles.text} >{appointment.hospitalDistrictName}</Col>
          </Row>
          {/*<Button text = '确定' style = {btnStyle} onClick = {this.ok} />*/}
        </Card>
      </div>
    );
  }
  render() {
    const { schedule,appointments} = this.props.appoint;
    const { pageNo,pageSize} = this.state;
    let { clinicDate,onDutyTime} = schedule;
    clinicDate = clinicDate?clinicDate: onDutyTime.split(" ")[0]; 
    let height = config.getWS().height - (config.navBar.padding + 6) * config.remSize;
    
    let start = pageSize*(pageNo-1);
    let limit = pageSize*pageNo;
    const appoints = appointments.slice(start,limit); // 输出：2
    
    return (
      <WorkSpace fullScreen = {true} >
        <ToolBar>
          <Card style = {{fontSize: '2.6rem', lineHeight: '6rem', textAlign: 'center'}} >
            {schedule.deptName}&nbsp;>&nbsp; {schedule.doctorName}&nbsp;>&nbsp;
            {moment(clinicDate).format('YYYY年M月D日')}&nbsp;
            {schedule.clinicDurationName}
          </Card>
        </ToolBar>

        <Row style = {{paddingLeft: config.navBar.padding + 'rem'}} >
        {
        	appoints.map((row, idx) => {
        		let { appointmentNo,appointmentTime } = row;
        		let timeText = moment(appointmentTime).format('HH:mm')
        		return (
        			<Col span = {6} key = {idx} onClick = {() => this.showBookConfirm(row)} style = {{paddingRight: config.navBar.padding + 'rem', paddingTop: config.navBar.padding + 'rem'}} >
	        			<div className = {styles.tpItem} ><span>{appointmentNo}</span>&nbsp;&nbsp;{timeText}</div>
        			</Col>
        		);
        	})
        }
        {
        	appoints.length == 0 ? (
        		<div style = {{height: height + 'px', position: 'relative'}} >
        		<Empty info = {(<span>暂无可选时间段<br/><font style = {{fontSize: '2.5rem'}} >请重新选择查询条件进行查询</font></span>)} />
        		</div>
        	) : null
        }
        </Row>
        {
        	appointments.length > pageSize ? (
	        	<Row style = {{padding : config.navBar.padding + 'rem'}} >
		            <Col span = {8}><Button text = "上一页" disabled={start== 0} onClick = {this.prePage} /></Col>
		            <Col span = {8}>&nbsp;</Col>
		            <Col span = {8} ><Button text = "下一页" disabled={limit >= appointments.length } onClick = {this.nextPage} /></Col>
	            </Row>
            ):null
        }
        <Confirm   visible = {this.state.appointment?true:false} 
        buttons = {[
          {text: '暂不预约', outline: true, onClick: this.closeBookConfirm},
          {text: '确定', onClick: this.selectAppoint},
        ]}
    info = {this.renderBookConfirm(this.state.appointment||{})} />
      </WorkSpace>
    );
  }
}
  

export default connect(({appoint}) => ({appoint}))(AppointSources);



