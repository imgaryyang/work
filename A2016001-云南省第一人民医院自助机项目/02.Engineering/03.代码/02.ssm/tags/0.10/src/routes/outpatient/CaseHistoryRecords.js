import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Row, Col }         from 'antd';
import moment               from 'moment';

import config               from '../../config';
import styles               from './CaseHistoryRecords.css';
import listStyles           from '../../components/List.css';

import WorkSpace            from '../../components/WorkSpace';
import Card                 from '../../components/Card';
import Button               from '../../components/Button';
import BackTimer            from '../../components/BackTimer';
import Empty                from '../../components/Empty';
import PrintWin             from '../../components/PrintWin';

class CaseHistoryRecords extends React.Component {

  static displayName = 'CaseHistoryRecords';
  static description = '门诊病历查询';

  static propTypes = {
  };

  static defaultProps = {
  };

  /**
  * 初始化状态
  */
  state = {
    printWinVisible: false
  };

  componentWillMount () {
    this.props.dispatch({
      type: 'outpatient/loadCaseHistoryRecords',
      payload: {
      },
    });
  }

  constructor(props) {
    super(props);
    this.renderItems    = this.renderItems.bind(this);
    this.print          = this.print.bind(this);
  }

  print (row) {
    //TODO: 载入供打印的病历详情
    this.props.dispatch({
      type: 'outpatient/loadCaseHistory',
      payload: {
        Id: row.Id
      },
    });

    this.setState({printWinVisible: true});

    setTimeout(() => {
      this.setState({printWinVisible: false});

      this.props.dispatch({
        type: 'message/show',
        payload: {
          msg: '打印完成！',
        }
      });
    }, 3000);
  }

  render() {
    return (
      this.props.outpatient.caseHistoryLoaded === true && this.props.outpatient.caseHistoryRecords.length == 0 ? (
        <Empty info = '暂无可打印的门诊病历记录' />
      ) : (
        <WorkSpace fullScreen = {true} style = {{paddingTop: '2rem'}} >
          <Row>
            <Col span = {4} className = {listStyles.title} >就诊时间</Col>
            <Col span = {7} className = {listStyles.title} >科室</Col>
            <Col span = {4} className = {listStyles.title} >医生</Col>
            <Col span = {4} className = {listStyles.title + ' ' + listStyles.center} >已打印次数</Col>
            <Col span = {5} className = {listStyles.title + ' ' + listStyles.center} >操作</Col>
          </Row>
          <Card shadow = {true} radius = {false} className = {styles.rows} >
            {this.renderItems()}
          </Card>
          <PrintWin visible = {this.state.printWinVisible} />
        </WorkSpace>
      )
    );
  }

  renderItems () {
    return this.props.outpatient.caseHistoryRecords.map (
      (row, idx) => {
        const { TreatmentDate, DeptName, DoctorName, JobTitle, PrintTimes } = row;

        return (
          <div key = {'_case_his_items_' + idx} className = {styles.row} >
            <Row type="flex" align="middle" >
              <Col span = {4} className = {listStyles.item} >
                {moment(TreatmentDate).format('YYYY-MM-DD')}<br/>{moment(TreatmentDate).format('HH:mm')}
              </Col>
              <Col span = {7} className = {listStyles.item} >
                {DeptName}
              </Col>
              <Col span = {4} className = {listStyles.item} >
                {DoctorName}<br/><font style = {{fontSize: '1.8rem'}} >{JobTitle}</font>
              </Col>
              <Col span = {4} className = {listStyles.item + ' ' + listStyles.center} >
                {PrintTimes}
              </Col>
              <Col span = {5} className = {listStyles.item + ' ' + listStyles.center} >
                {
                  PrintTimes == '0' ? (
                    <Button text = "打印" style = {{fontSize: '2.5rem'}} onClick = {() => this.print(row)} />
                  ) : (
                    <Button text = "打印" style = {{fontSize: '2.5rem'}} disabled = {true} />
                  )
                }
              </Col>
            </Row>
          </div>
        );
      }
    );
  }
}

export default connect(({outpatient, message}) => ({outpatient, message}))(CaseHistoryRecords);





