import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Row, Col }         from 'antd';
import moment               from 'moment';

import config               from '../../config';
import styles               from './CheckRecords.css';
import listStyles           from '../../components/List.css';

import WorkSpace            from '../../components/WorkSpace';
import Card                 from '../../components/Card';
import Button               from '../../components/Button';
import BackTimer            from '../../components/BackTimer';
import Empty                from '../../components/Empty';
import PrintWin             from '../../components/PrintWin';

class CheckRecords extends React.Component {

  static displayName = 'CheckRecords';
  static description = '检查检验记录查询';

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
      type: 'outpatient/loadCheckRecords',
      payload: {
      },
    });
  }

  constructor(props) {
    super(props);
    this.renderItems    = this.renderItems.bind(this);
    this.showCheckResult = this.showCheckResult.bind(this);
    this.print          = this.print.bind(this);
    this.goToPay        = this.goToPay.bind(this);
  }

  showCheckResult (row) {
    this.props.dispatch(routerRedux.push({
      pathname: '/checkResult',
      state: {
        nav: {
          title: '检查结果',
        },
      },
    }));
  }

  print (row) {
    //TODO: 载入供打印的检查单详情
    this.props.dispatch({
      type: 'outpatient/loadCheckInfo',
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

  goToPay (row) {
    this.props.dispatch(routerRedux.push({
      pathname: '/needPay',
      state: {
        nav: {
          title: '缴费',
        },
      },
    }));
  }

  render() {
    return (
      this.props.outpatient.checkRecordsLoaded === true && this.props.outpatient.checkRecords.length == 0 ? (
        <Empty info = '暂无检查记录' />
      ) : (
        <WorkSpace fullScreen = {true} style = {{paddingTop: '2rem'}} >
          <Row>
            <Col span = {3} className = {listStyles.title} >申请时间</Col>
            <Col span = {3} className = {listStyles.title} >检查类型</Col>
            <Col span = {4} className = {listStyles.title} >申请科室</Col>
            <Col span = {4} className = {listStyles.title} >申请医生</Col>
            <Col span = {3} className = {listStyles.title + ' ' + listStyles.center} >状态</Col>
            <Col span = {7} className = {listStyles.title + ' ' + listStyles.center} >操作</Col>
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
    return this.props.outpatient.checkRecords.map (
      (row, idx) => {
        const { RequestDate, CheckType, CheckTypeName, DeptName, DoctorName, JobTitle, State, PrintTimes } = row;

        return (
          <div key = {'_appt_items_' + idx} className = {styles.row} >
            <Row type="flex" align="middle" >
              <Col span = {3} className = {listStyles.item + ' ' + listStyles.nowrap} style = {{fontSize: '1.8rem'}} >
                {moment(RequestDate).format('YYYY-MM-DD')}<br/>{moment(RequestDate).format('HH:mm')}
              </Col>
              <Col span = {3} className = {listStyles.item} >
                {CheckTypeName}
              </Col>
              <Col span = {4} className = {listStyles.item} >
                {DeptName}
              </Col>
              <Col span = {4} className = {listStyles.item} >
                {DoctorName}<br/><font style = {{fontSize: '1.8rem', color: '#999999'}} >{JobTitle}</font>
              </Col>
              <Col span = {3} className = {listStyles.item + ' ' + listStyles.center + ' ' + listStyles.nowrap} >
                {State == '0' ? '未缴费' : (State == '1' ? '未出结果' : '已出结果')}
              </Col>
              <Col span = {7} className = {listStyles.item + ' ' + listStyles.center} >
                {
                  State == '2' ? (
                    <Row>
                      <Col span = {16} style = {{paddingRight: '.5rem'}} >
                        <Button text = "查看结果" style = {{fontSize: '2.5rem'}} onClick = {() => this.showCheckResult(row)} />
                      </Col>
                      <Col span = {8} style = {{paddingLeft: '.5rem'}} >
                        <Button text = "打印" style = {{fontSize: '2.5rem'}} onClick = {() => this.print(row)} />
                      </Col>
                    </Row>
                  ) : null
                }
                {
                  State == '0' ? (
                    <Row>
                      <Col span = {16} style = {{paddingRight: '.5rem'}} >
                        
                      </Col>
                      <Col span = {8} style = {{paddingLeft: '.5rem'}} >
                        <Button text = "缴费" style = {{fontSize: '2.5rem'}} onClick = {() => this.goToPay(row)} />
                      </Col>
                    </Row>
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

export default connect(({outpatient, message}) => ({outpatient, message}))(CheckRecords);





