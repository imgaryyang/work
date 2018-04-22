import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Row, Col }         from 'antd';
import moment               from 'moment';

import config               from '../../config';
import styles               from './ChooseTimePeriod.css';

import WorkSpace            from '../../components/WorkSpace';
import Card                 from '../../components/Card';
import Button               from '../../components/Button';
import ToolBar              from '../../components/ToolBar';

class ChooseTimePeriod extends React.Component {

  static displayName = 'ChooseTimePeriod';
  static description = '选择预约时段';

  static propTypes = {
  };

  static defaultProps = {
  };

  constructor(props) {
    super(props);
    this.chooseTimePeriod = this.chooseTimePeriod.bind(this);
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'arrange/loadTimePeriod',
      payload: {
        dept: this.props.location.state.dept,
        arrangeItem: this.props.location.state.arrangeItem,
      },
    });
  }

  chooseTimePeriod(timePeriod) {
    this.props.dispatch(routerRedux.push({
      pathname: '/appointmentConfirm',
      state: {
        dept: this.props.location.state.dept,
        arrangeItem: this.props.location.state.arrangeItem,
        arrangeTimePeriod: timePeriod,
        nav: {
          title: '预约成功',
          backDisabled: true,
        },
      },
    }));
  }

  render() {
    const { timePeriod } = this.props.arrange;
    return (
      <WorkSpace fullScreen = {true} >

        <ToolBar>
          <Card shadow = {true} style = {{fontSize: '2.6rem', lineHeight: '6rem', textAlign: 'center'}} >
            {this.props.location.state.arrangeItem.DeptName}&nbsp;>&nbsp;
            {this.props.location.state.arrangeItem.DoctorName}&nbsp;>&nbsp;
            {moment(this.props.location.state.arrangeItem.ArrangeDate).format('YYYY年M月D日')}&nbsp;
            {this.props.location.state.arrangeItem.DayPeriod.toLowerCase() == 'am' ? '上午' : '下午'}
          </Card>
        </ToolBar>

        <Row style = {{paddingLeft: config.navBar.padding + 'rem'}} >
        {
          timePeriod.map(
            (row, idx) => {
              let { PeriodId, ArrangeDate, DayPeriod, StartTime, EndTime, Index } = row;
              return (
                <Col span = {6} key = {'_tp_item_' + idx} onClick = {() => this.chooseTimePeriod(row)} style = {{paddingRight: config.navBar.padding + 'rem', paddingTop: config.navBar.padding + 'rem'}} >
                  <div className = {styles.tpItem} >
                    <span>{Index}</span>&nbsp;&nbsp;{StartTime}
                  </div>
                </Col>
              );
            }
          )
        }
        </Row>
      </WorkSpace>
    );
  }
}
  

export default connect(({arrange}) => ({arrange}))(ChooseTimePeriod);



