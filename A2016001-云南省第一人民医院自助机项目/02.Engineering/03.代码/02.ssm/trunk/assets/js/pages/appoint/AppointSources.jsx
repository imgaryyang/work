import React, { PropTypes } from 'react';
import { Row, Col }         from 'antd';
import moment               from 'moment';

import styles from './AppointSources.css';
import Confirm from '../../components/Confirm.jsx';
import Empty from '../../components/Empty.jsx';
import Card from '../../components/Card.jsx';
import Button from '../../components/Button.jsx';
import ToolBar from '../../components/ToolBar.jsx';
import NavContainer from '../../components/NavContainer.jsx';
import printUtil from '../../utils/printUtil.jsx';
import baseUtil from '../../utils/baseUtil.jsx';
import logUtil,{ log } from '../../utils/logUtil.jsx';
class AppointSources extends React.Component {


  constructor(props) {
    super(props);
    this.onBack = this.onBack.bind(this);
	this.onHome = this.onHome.bind(this);
    this.selectAppoint = this.selectAppoint.bind(this);
    this.afterAppoint = this.afterAppoint.bind(this);
    this.bookAppoint = this.bookAppoint.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.prePage = this.prePage.bind(this);
    this.showBookConfirm = this.showBookConfirm.bind(this);
    this.closeBookConfirm = this.closeBookConfirm.bind(this);
    this.renderBookConfirm = this.renderBookConfirm.bind(this);
    this.error = this.error.bind(this);
    this.state = { pageNo:1,pageSize : 20,appointment:null  }
  }
  
  componentWillMount() {
  }
  onBack(){
	if(this.props.onCancel)this.props.onCancel();
  }
  onHome(){
	baseUtil.goHome('appointSource'); 
  }
  error(msg){
	  this.setState({appointment:null},()=>{
		  baseUtil.error(msg);
	  });
  }
  bookAppoint(appointment){
    const patient = baseUtil.getCurrentPatient();
    const appoint = {
	  	...appointment,
	  	patientNo:patient.no,
	  	patientName:patient.name,
	  	patientSex:patient.gender||"3",
	  	patientPhone:patient.mobile||patient.telephone||"",
	  	patientIdNo:patient.idNo || "",
	  	remarks:''
    };
    log('预约-预约',appoint);
	let fetch = Ajax.post("/api/ssm/treat/appointment/book",appoint,{catch: 3600});
	fetch.then(res => {
		log('预约-预约返回',res);
		if(res && res.success){
			var result = res.result;
			console.log('预约返回',result);
			var newAppoint = {
		  	  ...appoint,
		  	  appointmentTime : result.appointmentTime,
		  	  verifyCode : result.verifyCode,
		  	  appointmentNo : result.appointmentNo,
		  	  appointmentInfo : result.appointmentInfo,
		  	  patientName : result.patientName,
		  	  appointmentDate : result.appointmentDate,
		  	  deptName : result.deptName,
		  	  scheduleDeptName : result.scheduleDeptName?result.scheduleDeptName:"",
		  	  clinicHouse : result.clinicHouse,
		  	  houseLocation : result.houseLocation,
		  	  hospitalDistrictName : result.hospitalDistrictName
		  	}
			try{
				printUtil.printAppoint(newAppoint);
			}catch(e){
				baseUtil.warning("打印机异常，本错误不影响您的预约结果，您可以在“我的预约”菜单查看您的预约记录");
			}
			this.afterAppoint(newAppoint);
		}else if( res && res.msg ){
			this.error(res.msg);
    	}else{
    		this.error("预约失败，请稍后再试");
    	}
	}).catch((ex) =>{
		this.error("预约异常，请稍后再试");
	});
  }
  selectAppoint() {//预约请求 
	const { appointment } = this.state;
	this.setState({appointment:null},()=>{
	  this.bookAppoint(appointment); 
	});
  }
  afterAppoint(newAppoint){
	 if(this.props.afterAppoint)this.props.afterAppoint(newAppoint); 
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
    console.log('appointment',appointment);
    const name = appointment.scheduleDeptName?appointment.scheduleDeptName:appointment.deptName;
    return (
      <div style = {{padding: '1.5rem'}} >
        <Card style = {{padding: '2rem'}} >
          <Row>
            <Col span = {8} className = 'appoint_src_label' >预约科室：</Col>
            <Col span = {16} className = 'appoint_src_text' >{name}</Col>
          </Row>
          <Row>
            <Col span = {8} className = 'appoint_src_label' >预约医生：</Col>
            <Col span = {16} className = 'appoint_src_text' >{appointment.doctorName}</Col>
          </Row>
          <Row>
            <Col span = {8} className = 'appoint_src_label' >预约时间：</Col>
            <Col span = {16} className = 'appoint_src_text' >
              {moment(appointment.appointmentTime).format('Y年M月D日')}&nbsp;
              {appointment.clinicDurationName}&nbsp;
              {moment(appointment.appointmentTime).format('HH:mm:SS')}
            </Col>
          </Row>
          <Row>
            <Col span = {8} className = 'appoint_src_label' >就诊序号：</Col>
            <Col span = {16} className = 'appoint_src_text' ><font>{appointment.appointmentNo}</font></Col>
          </Row>
          <Row>
            <Col span = {8} className = 'appoint_src_label' >就诊地址：</Col>
            <Col span = {16} className = 'appoint_src_text' >{appointment.hospitalDistrictName}</Col>
          </Row>
          {/*<Button text = '确定' style = {btnStyle} onClick = {this.ok} />*/}
        </Card>
      </div>
    );
  }
  render() {
    const { schedule} = this.props;
    const { pageNo,pageSize} = this.state;
    let { clinicDate,onDutyTime,appointments} = schedule;
    clinicDate = clinicDate?clinicDate: onDutyTime.split(" ")[0]; 
    let height = document.body.clientHeight - 90;
    
    let start = pageSize*(pageNo-1);
    let limit = pageSize*pageNo;
    const appoints = appointments.slice(start,limit); // 输出：2
    
    return (
      <NavContainer  title='预约科室' onBack={this.onBack} onHome={this.onHome} >
        <ToolBar>
          <Card style = {{fontSize: '2.6rem', lineHeight: '6rem', textAlign: 'center'}} >
            {schedule.deptName}&nbsp;>&nbsp; {schedule.doctorName}&nbsp;>&nbsp;
            {moment(clinicDate).format('YYYY年M月D日')}&nbsp;
            {schedule.clinicDurationName}
          </Card>
        </ToolBar>

        <Row style = {{paddingLeft: '1.5rem'}} >
        {
        	appoints.map((row, idx) => {
        		let { appointmentNo,appointmentTime } = row;
        		let timeText = moment(appointmentTime).format('HH:mm')
        		return (
        			<Col span = {6} key = {idx} onClick = {() => this.showBookConfirm(row)} style = {{paddingRight: '1.5rem', paddingTop:  '1.5rem'}} >
	        			<div className = 'appoint_src_tpItem' ><span>{appointmentNo}</span>&nbsp;&nbsp;{timeText}</div>
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
	        	<Row style = {{padding : '1.5rem'}} >
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
     </NavContainer>
    );
  }
}
module.exports =  AppointSources;