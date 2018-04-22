import React, { PropTypes } from 'react';
import { Row, Col }         from 'antd';
import moment               from 'moment';

import styles               from './AppointConfirm.css';

import Card                 from '../../components/Card.jsx';
import Button               from '../../components/Button.jsx';
import BackTimer            from '../../components/BackTimer.jsx';
import NavContainer from '../../components/NavContainer.jsx';
import baseUtil from '../../utils/baseUtil.jsx';

class AppointConfirm extends React.Component {

  constructor(props) {
    super(props);
    this.onBack = this.onBack.bind(this);
	this.onHome = this.onHome.bind(this);
  }
  onBack(){
	baseUtil.goHome('appointConfirmBack'); 
  }
  onHome(){
	baseUtil.goHome('appointConfirmHome'); 
  }
  render() {
    let btnStyle = {marginTop: '2rem', /*width: '56rem',*/};
    const { appointment } = this.props;
    return (
      <NavContainer  title='预约科室' onBack={this.onBack} onHome={this.onHome} >
        <Card style = {{padding: '2rem'}} >
          <Row>
            <Col span = {8} className = 'app_cfm_label' >预约科室：</Col>
            <Col span = {16} className = 'app_cfm_text' >{appointment.deptName}</Col>
          </Row>
          <Row>
            <Col span = {8} className = 'app_cfm_label' >预约医生：</Col>
            <Col span = {16} className = 'app_cfm_text' >{appointment.doctorName}</Col>
          </Row>
          <Row>
            <Col span = {8} className = 'app_cfm_label' >预约时间：</Col>
            <Col span = {16} className = 'app_cfm_text' >
              {moment(appointment.appointmentTime).format('Y年M月D日')}&nbsp;
              {appointment.clinicDurationName}&nbsp;
              {moment(appointment.appointmentTime).format('HH:mm:SS')}
            </Col>
          </Row>
          <Row>
            <Col span = {8} className = 'app_cfm_label' >就诊序号：</Col>
            <Col span = {16} className = 'app_cfm_text' ><font>{appointment.appointmentNo}</font></Col>
          </Row>
          <Row>
            <Col span = {8} className = 'app_cfm_label' >就诊地址：</Col>
            <Col span = {16} className = 'app_cfm_text' >{appointment.hospitalDistrictName}</Col>
          </Row>
          {
        	/*<Row>
              <Col span = {24} className = 'app_cfm_text' >{appointment.appointmentInfo}</Col>
            </Row>*/
          }
          {/* <Row>
            <Col span = {8} className = 'app_cfm_label' >挂号费：</Col>
            <Col span = {16} className = 'app_cfm_text' ><font>{appointment.amt||0}</font>&nbsp;元</Col>
          </Row>*/}
          {/* <Button text = '确定' style = {btnStyle} onClick = {this.ok} />*/}
        </Card>
        <BackTimer style = {{marginTop: '4rem'}} />
      </NavContainer>
    );
  }
}
module.exports = AppointConfirm;