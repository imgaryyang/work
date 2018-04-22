import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Row, Col }         from 'antd';
import moment               from 'moment';

import config               from '../../config';
import styles               from './SignIn.css';

import WorkSpace            from '../../components/WorkSpace';
import Card                 from '../../components/Card';
import Button               from '../../components/Button';

class SignIn extends React.Component {

  static displayName = 'SignIn';
  static description = '预约签到';

  static propTypes = {
  };

  static defaultProps = {
  };

  constructor(props) {
    super(props);
    this.sign = this.sign.bind(this);
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'appointment/loadUnusedApptRecords',
      payload: {
      },
    });
  }

  sign() {
    this.props.dispatch({
      type: 'appointment/loadUnusedApptRecords',
      payload: {
      },
    });

    //if (this.props.appointment.signed)
      /*this.props.dispatch(routerRedux.push({
        pathname: '/signed',
        state: {
          nav: {
            title: '预约签到',
            backDisabled: true,
          },
        },
      }));*/

    this.props.dispatch({
      type: 'message/setInfo',
      payload: {
        info: (
          <font>签到成功<br/><font style = {{fontSize: '3rem'}} >请在诊室门口等待叫号</font></font>
        ),
        autoBack: true,
      }
    });
    this.props.dispatch(routerRedux.push({
      pathname: '/info',
      state: {
        nav: {
          title: '预约签到',
          backDisabled: true,
        },
      },
    }));
  }

  render() {
    let cardStyle = {
      /*width: '38rem', 
      height: '38rem', */
      padding: '2rem',
    };

    let btnStyle = {
      margin: '2rem auto',
      /*width: '34rem',*/
    };

    //console.log('in SignIn.render():', this.props.appointment);
    let appt = this.props.appointment.unusedAppt.length > 0 ? this.props.appointment.unusedAppt[0] : {};
    //console.log('in SignIn.render(): appt : ', appt)

    return (
      <WorkSpace width = '70%' height = '50rem' >
        <Card shadow = {true} style = {cardStyle} >
          
          <Row>
            <Col span = {8} className = {styles.label} >就诊序号：</Col>
            <Col span = {16} className = {styles.text} ><font>{appt['bookNum']}</font></Col>
          </Row>
          <Row>
            <Col span = {8} className = {styles.label} >预约时间：</Col>
            <Col span = {16} className = {styles.text} >
              {appt['apptDate'] ? moment(appt['apptDate']).format('Y年M月D日') : ''}&nbsp;
              {appt['dayPeriod'] ? (appt['dayPeriod'].toLowerCase() == 'am' ? '上午' : '下午') : ''}
            </Col>
          </Row>
          <Row>
            <Col span = {8} className = {styles.label} >预约科室：</Col>
            <Col span = {16} className = {styles.text} >{appt['deptName']}</Col>
          </Row>
          <Row>
            <Col span = {8} className = {styles.label} >预约医生：</Col>
            <Col span = {16} className = {styles.text} >{appt['doctorName']}</Col>
          </Row>
          <Row>
            <Col span = {8} className = {styles.label} >就诊地址：</Col>
            <Col span = {16} className = {styles.text} >{appt['address']}</Col>
          </Row>

        </Card>
        <Button text = '签到' style = {btnStyle} onClick = {this.sign} />
      </WorkSpace>
    );
  }
}
  

export default connect(({appointment, message}) => ({appointment, message}))(SignIn);



