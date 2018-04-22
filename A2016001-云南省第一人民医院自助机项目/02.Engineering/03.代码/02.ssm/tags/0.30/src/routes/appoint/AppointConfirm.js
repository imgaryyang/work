import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Row, Col }         from 'antd';
import moment               from 'moment';

import config               from '../../config';
import styles               from './AppointConfirm.css';

import WorkSpace            from '../../components/WorkSpace';
import Card                 from '../../components/Card';
import Button               from '../../components/Button';
import BackTimer            from '../../components/BackTimer';

class AppointConfirm extends React.Component {

  constructor(props) {
    super(props);
    this.ok = this.ok.bind(this);
  }

  ok () {

  }

  render() {
    let btnStyle = {marginTop: '2rem', /*width: '56rem',*/};
    const { appointment } = this.props.appoint;
    return (
      <WorkSpace fullScreen = {true} style = {{padding: config.navBar.padding + 'rem'}} >
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
          {
        	/*<Row>
              <Col span = {24} className = {styles.text} >{appointment.appointmentInfo}</Col>
            </Row>*/
          }
          {/* <Row>
            <Col span = {8} className = {styles.label} >挂号费：</Col>
            <Col span = {16} className = {styles.text} ><font>{appointment.amt||0}</font>&nbsp;元</Col>
          </Row>*/}
          {/* <Button text = '确定' style = {btnStyle} onClick = {this.ok} />*/}
        </Card>
        <BackTimer style = {{marginTop: '4rem'}} />
      </WorkSpace>
    );
  }
}

export default connect(({appoint}) => ({appoint}))(AppointConfirm);





