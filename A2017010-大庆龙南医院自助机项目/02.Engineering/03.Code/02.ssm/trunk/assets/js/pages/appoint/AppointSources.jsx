import React, { PropTypes } from 'react';
import { Row, Col }         from 'antd';
import moment               from 'moment';
import TimerPage from '../../TimerPage.jsx';
import styles from './AppointSources.css';
import Confirm from '../../components/Confirm.jsx';
import Empty from '../../components/Empty.jsx';
import Card from '../../components/Card.jsx';
import Button from '../../components/Button.jsx';
import ToolBar from '../../components/ToolBar.jsx';
import NavContainer from '../../components/NavContainer.jsx';
import printUtil from '../../utils/printUtil.jsx';
import baseUtil from '../../utils/baseUtil.jsx';

class AppointSources extends TimerPage {


  constructor(props) {
    super(props);
    this.onBack =   this.bind(this.onBack,this);
	this.onHome =   this.bind(this.onHome,this);
    this.selectAppoint =   this.bind(this.selectAppoint,this);
    this.afterAppoint =   this.bind(this.afterAppoint,this);
    this.signAppoint = this.bind(this.signAppoint,this);
    this.bookAppoint =   this.bind(this.bookAppoint,this);
    this.nextPage =   this.bind(this.nextPage,this);
    this.prePage =   this.bind(this.prePage,this);
    this.showBookConfirm =   this.bind(this.showBookConfirm,this);
    this.closeBookConfirm =   this.bind(this.closeBookConfirm,this);
    this.renderBookConfirm =   this.bind(this.renderBookConfirm,this);
    this.renderSignConfirm =   this.bind(this.renderSignConfirm,this);
    this.closeSignConfirm =   this.bind(this.closeSignConfirm,this);
    this.error =   this.bind(this.error,this);
    this.state = { pageNo:1,pageSize : 20,appointment:null,bookedAppoint:null }
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
  bookAppoint(appointment,registerAmount){
    const patient = baseUtil.getCurrentPatient();
    const appoint = {
	  	...appointment,
	  	patientNo:patient.no,
	  	patientName:patient.name,
	  	patientBirthday:patient.birthday,
	  	patientSex:patient.gender||"3",
	  	patientPhone:patient.mobile||patient.telephone||"",
	  	patientIdNo:patient.idNo || "",
	  	remarks:'',
	  	lhz:patient.lhz,
	  	registerAmount:registerAmount
    };
	let fetch = Ajax.post("/api/ssm/treat/appointment/book",appoint,{catch: 3600});
	fetch.then(res => {
		if(res && res.success){
			var result = res.result
			var newAppoint = {
		  	  ...appoint,
		  	  appointmentTime : result.appointmentTime,
		  	  verifyCode : result.verifyCode,
		  	  appointmentId : result.appointmentId,
		  	  appointmentNo : result.appointmentNo,
		  	  appointmentInfo : result.appointmentInfo,
		  	  patientName : result.patientName,
		  	  appointmentDate : result.appointmentDate,
		  	  deptName : result.deptName,
		  	  scheduleDeptName : result.scheduleDeptName,
		  	  clinicHouse : result.clinicHouse,
		  	  houseLocation : result.houseLocation,
		  	  hospitalDistrictName : result.hospitalDistrictName,
		  	  registerAmount : registerAmount,
		  	  //2018年2月5日修改 0预留，1预约，2等待，3已呼叫，4已刷卡，5完成，9放弃
		  	  appointmentState : '1'
        }
			
	    var today = moment().format('YYYY-MM-DD');
	    var appDay = moment(newAppoint.appointmentTime).format('YYYY-MM-DD');
			  
        if(today == appDay)this.setState({bookedAppoint:newAppoint});
        else{
          try{
            printUtil.printAppoint(newAppoint);
          }catch(e){
            baseUtil.warning("打印机异常，本错误不影响您的预约结果，您可以在“我的预约”菜单查看您的预约记录");
          }
          this.afterAppoint(newAppoint);
        }
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
    const { schedule} = this.props;
    var registerAmount = schedule.registerAmount;
    this.setState({appointment:null},()=>{
      this.bookAppoint(appointment,registerAmount); 
    });
  }
  signAppoint(){
	const bookedAppoint = this.state.bookedAppoint;
    const patient = baseUtil.getCurrentPatient();
    const appoint = {	
      ...bookedAppoint,	
      patientNo:patient.no,
      patientName:patient.name,
      patientBirthday:patient.birthday,
      patientSex:patient.gender||"3",
      patientPhone:patient.mobile||patient.telephone||"",
      patientIdNo:patient.idNo || "",
      remarks:'',
      lhz:patient.lhz,
      cardNo:""
    };
    let fetch = Ajax.post("/api/ssm/treat/appointment/sign",appoint,{catch: 3600});
	  fetch.then(res => {
		  if(res && res.success){
				//打印签到凭条
        var result = res.result		
        var newAppoint = {
            ...appoint,
            appointmentInfo : result.appointmentInfo,
            patientName : result.patientName,
            appointmentDate : result.appointmentDate,
            deptName : result.deptName,
            scheduleDeptName : result.scheduleDeptName,
            clinicHouse : result.clinicHouse,
            houseLocation : result.houseLocation,
            hospitalDistrictName : result.hospitalDistrictName,
            appointmentState : '2'
        }
        try{
          console.info("预约界面调用打印签到单方法");
          printUtil.printSign(newAppoint);
        }catch(e){
          baseUtil.notice("打印机异常，此异常不影响您的签到");
        }
        this.afterAppoint(newAppoint);
      }else if( res && res.msg ){
        baseUtil.error(res.msg);
      }else{
        baseUtil.error("预约签到失败");
      }
    }).catch((ex) =>{
      baseUtil.error("预约签到异常");
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
  closeSignConfirm(){
    const bookedAppoint = this.state.bookedAppoint;
    try{
      printUtil.printAppoint(bookedAppoint);
    }catch(e){
      baseUtil.warning("打印机异常，本错误不影响您的预约结果，您可以在“我的预约”菜单查看您的预约记录");
    }
    this.setState({bookedAppoint:null},()=>{
      this.afterAppoint(bookedAppoint);
    }); 
  }
  renderBookConfirm(appointment) {
	var patient = baseUtil.getCurrentPatient();
	var age = patient.age;
    let btnStyle = {marginTop: '2rem', /*width: '56rem',*/};
    return (
      <div style = {{padding: '1.5rem'}} >
        <Card style = {{padding: '2rem'}} >
          <Row>
            <Col span = {8} className = 'appoint_src_label' >预约科室：</Col>
            <Col span = {16} className = 'appoint_src_text' >{appointment.deptName}</Col>
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
          {
        	  age >= 70?(
        		<Row>
                      <Col span = {24} className = 'appoint_src_label' > 您的年龄超过70岁，将不收取您的挂号费</Col>
                </Row>
        	  ):null
          }
          {/*<Button text = '确定' style = {btnStyle} onClick = {this.ok} />*/}
        </Card>
      </div>
    );
  }
  renderSignConfirm(bookedAppoint) {
    var patient = baseUtil.getCurrentPatient();
    var age = patient.age;
      let btnStyle = {marginTop: '2rem', /*width: '56rem',*/};
      return (
        <div style = {{padding: '1.5rem'}} >
          <Card style = {{padding: '2rem'}} >
            <Row>
              <Col span = {24} className = 'appoint_src_label' > 您预约的是今天的号，签到后即可排队就诊，请问是否现在签到？</Col>
            </Row>
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
        <Confirm   visible = {this.state.bookedAppoint?true:false} 
		    buttons = {[
		       {text: '暂不签到', outline: true, onClick: this.closeSignConfirm},
		       {text: '我要签到', onClick: this.signAppoint},
		    ]}
		    info = {this.renderSignConfirm(this.state.bookedAppoint||{})} />
     </NavContainer>
    );
  }
}
module.exports =  AppointSources;