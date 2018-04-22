import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Row, Col }         from 'antd';
import moment               from 'moment';

import config               from '../../config';
import styles               from './AppointmentRecords.css';
import listStyles           from '../../components/List.css';

import WorkSpace            from '../../components/WorkSpace';
import Card                 from '../../components/Card';
import Button               from '../../components/Button';
import BackTimer            from '../../components/BackTimer';
import Empty                from '../../components/Empty';
import Confirm              from '../../components/Confirm';

class AppointmentRecords extends React.Component {

  static displayName = 'AppointmentRecords';
  static description = '预约记录查询';

  static propTypes = {
  };

  static defaultProps = {
  };

  componentWillMount () {
    this.props.dispatch({
      type: 'appointment/loadAllApptRecords',
      payload: {
      },
    });
  }

  constructor(props) {
    super(props);
    this.renderItems    = this.renderItems.bind(this);
    this.confirmCancel  = this.confirmCancel.bind(this);
    this.close          = this.close.bind(this);
    this.cancel         = this.cancel.bind(this);
  }

  confirmCancel (record) {
    this.props.dispatch({
      type: 'appointment/setState',
      payload: {
        cancelConfirmVisible: true,
        cancelRecord: record,
      },
    });
  }

  close () {
    this.props.dispatch({
      type: 'appointment/setState',
      payload: {
        cancelConfirmVisible: false,
      },
    });
  }

  cancel () {
    this.props.dispatch({
      type: 'appointment/cancel',
      payload: {
        cancelConfirmVisible: false,
      },
    });

    this.props.dispatch({
      type: 'message/show',
      payload: {
        msg: '取消预约成功！',
      }
    });
    
  }

  render() {
    const { cancelConfirmVisible } = this.props.appointment;
    return (
      this.props.appointment.loaded && this.props.appointment.apptRecords.length == 0 ? (
        <Empty info = '暂无预约记录' />
      ) : (
        <WorkSpace fullScreen = {true} style = {{paddingTop: '2rem'}} >
          <Row>
            <Col span = {4} className = {listStyles.title} >预约时间</Col>
            <Col span = {3} className = {listStyles.title + ' ' + listStyles.center} >就诊序号</Col>
            <Col span = {5} className = {listStyles.title} >预约科室</Col>
            <Col span = {4} className = {listStyles.title} >预约医生</Col>
            <Col span = {3} className = {listStyles.title + ' ' + listStyles.center} >状态</Col>
            <Col span = {5} className = {listStyles.title + ' ' + listStyles.center} >操作</Col>
          </Row>
          <Card shadow = {true} radius = {false} >
            {this.renderItems()}
          </Card>
          <Confirm 
            visible = {cancelConfirmVisible} 
            buttons = {[
              {text: '暂不取消', outline: true, onClick: this.close},
              {text: '确定', onClick: this.cancel},
            ]}
            info = '您确定要取消本次预约吗？' />
        </WorkSpace>
      )
    );
  }

  renderItems () {
    return this.props.appointment.apptRecords.map (
      (row, idx) => {
        const { ApptId, ApptDate, ApptTime, DayPeriod, DeptId, DeptName, DiagnosisType, DoctorId, DoctorName, JobTitleId, JobTitle, RegisteredAmount, BookNum, Address, State } = row;

        const rowStyle = State != '1' ? {color: '#999999'} : {};

        return (
          <div key = {'_appt_items_' + idx} >
            <Row type="flex" align="middle" style = {rowStyle} >
              <Col span = {4} className = {listStyles.item} >
                {ApptDate}<br/>{DayPeriod.toLowerCase() == 'am' ? '上午' : '下午'} {ApptTime}
              </Col>
              <Col span = {3} className = {listStyles.item + ' ' + listStyles.center} >
                {BookNum}
              </Col>
              <Col span = {5} className = {listStyles.item} >
                {DeptName}
              </Col>
              <Col span = {4} className = {listStyles.item} >
                {DoctorName}<br/><font style = {{fontSize: '1.8rem'}} >{JobTitle}</font>
              </Col>
              <Col span = {3} className = {listStyles.item + ' ' + listStyles.center + ' ' + listStyles.nowrap} >
                {State == '1' ? '未就诊' : (State == '0' ? '已取消' : '已就诊')}
              </Col>
              <Col span = {5} className = {listStyles.item + ' ' + listStyles.center} >
                {
                  State == '1' ? (
                    <Button text = "取消预约" style = {{fontSize: '2.5rem'}} onClick = {() => this.confirmCancel(row)} />
                  ) : null
                }
              </Col>
            </Row>
          </div>
        );
      }
    );
  }
}

export default connect(({appointment, message}) => ({appointment, message}))(AppointmentRecords);





