import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Row, Col }         from 'antd';
import moment               from 'moment';

import config               from '../../config';
import styles               from './AppointmentConfirm.css';

import WorkSpace            from '../../components/WorkSpace';
import Card                 from '../../components/Card';
import Button               from '../../components/Button';
import BackTimer            from '../../components/BackTimer';

class AppointmentConfirm extends React.Component {

  static displayName = 'AppointmentConfirm';
  static description = '预约确认';

  static propTypes = {
  };

  static defaultProps = {
  };

  constructor(props) {
    super(props);
    this.ok = this.ok.bind(this);
  }

  ok () {

  }

  render() {
	//console.info();
    let btnStyle = {marginTop: '2rem', /*width: '56rem',*/};
    const timePeriod = this.props.location.state.timePeriod;
    return (
      <WorkSpace fullScreen = {true} style = {{padding: config.navBar.padding + 'rem'}} >
        <Card style = {{padding: '2rem'}} >
          <Row>
            <Col span = {8} className = {styles.label} >预约科室：</Col>
            <Col span = {16} className = {styles.text} >{timePeriod.departmentName}</Col>
          </Row>
          <Row>
            <Col span = {8} className = {styles.label} >预约医生：</Col>
            <Col span = {16} className = {styles.text} >{timePeriod.doctorName}</Col>
          </Row>
          <Row>
            <Col span = {8} className = {styles.label} >预约时间：</Col>
            <Col span = {16} className = {styles.text} >
              {moment(timePeriod.date).format('Y年M月D日')}&nbsp;
              {timePeriod.dayPeriod.toLowerCase() == 'am' ? '上午' : '下午'}&nbsp;
              {timePeriod.startTime}
            </Col>
          </Row>
          <Row>
            <Col span = {8} className = {styles.label} >就诊序号：</Col>
            <Col span = {16} className = {styles.text} ><font>{timePeriod.bookNum}</font></Col>
          </Row>
          <Row>
            <Col span = {8} className = {styles.label} >就诊地址：</Col>
            <Col span = {16} className = {styles.text} >{timePeriod.address}</Col>
          </Row>
          <Row>
            <Col span = {8} className = {styles.label} >挂号费：</Col>
            <Col span = {16} className = {styles.text} ><font>{timePeriod.registeredAmount}</font>&nbsp;元</Col>
          </Row>
          {/*<Button text = '确定' style = {btnStyle} onClick = {this.ok} />*/}
        </Card>
        <BackTimer style = {{marginTop: '4rem'}} />
      </WorkSpace>
    );
  }
}

export default connect()(AppointmentConfirm);





