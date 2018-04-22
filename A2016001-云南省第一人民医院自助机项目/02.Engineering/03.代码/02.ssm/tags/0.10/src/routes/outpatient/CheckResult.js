import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Row, Col }         from 'antd';
import moment               from 'moment';

import config               from '../../config';
import styles               from './CheckResult.css';
import listStyles           from '../../components/List.css';

import WorkSpace            from '../../components/WorkSpace';
import Card                 from '../../components/Card';
import Button               from '../../components/Button';
import BackTimer            from '../../components/BackTimer';
import Empty                from '../../components/Empty';
import PrintWin             from '../../components/PrintWin';

import upImg                from '../../assets/base/up.png';
import downImg              from '../../assets/base/down.png';

class CheckResult extends React.Component {

  static displayName = 'CheckResult';
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
      type: 'outpatient/loadCheckInfo',
      payload: {
      },
    });
  }

  constructor(props) {
    super(props);
    this.print          = this.print.bind(this);
    this.renderItems    = this.renderItems.bind(this);
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

  render () {
    const { CheckId, PatientName, RequestDate, RequestDeptName, RequestDoctorName, ReceiveDate, SpecimenTypeName, CheckDoctorName, CheckDate } = this.props.outpatient.checkInfo;
    return (
      <WorkSpace fullScreen = {true} style = {{paddingTop: '2rem'}} >

        <Card shadow = {true} radius = {false} >
          <Row>
            <Col span = {4} className = {listStyles.title + ' ' + listStyles.amt} >检查单号</Col>
            <Col span = {4} className = {listStyles.item} >{CheckId}</Col>
            <Col span = {4} className = {listStyles.title + ' ' + listStyles.amt} >姓名</Col>
            <Col span = {4} className = {listStyles.item} >{PatientName}</Col>
            <Col span = {4} className = {listStyles.title + ' ' + listStyles.amt} >申请日期</Col>
            <Col span = {4} className = {listStyles.item} >{moment(RequestDate).format('YYYY-MM-DD')}</Col>
          </Row>
          <Row>
            <Col span = {4} className = {listStyles.title + ' ' + listStyles.amt} >申请科室</Col>
            <Col span = {4} className = {listStyles.item} >{RequestDeptName}</Col>
            <Col span = {4} className = {listStyles.title + ' ' + listStyles.amt} >申请医生</Col>
            <Col span = {4} className = {listStyles.item} >{RequestDoctorName}</Col>
            <Col span = {4} className = {listStyles.title + ' ' + listStyles.amt} >接收日期</Col>
            <Col span = {4} className = {listStyles.item} >{moment(ReceiveDate).format('YYYY-MM-DD')}</Col>
          </Row>
          <Row>
            <Col span = {4} className = {listStyles.title + ' ' + listStyles.amt} >样本类型</Col>
            <Col span = {4} className = {listStyles.item} >{SpecimenTypeName}</Col>
            <Col span = {4} className = {listStyles.title + ' ' + listStyles.amt} >审核医生</Col>
            <Col span = {4} className = {listStyles.item} >{CheckDoctorName}</Col>
            <Col span = {4} className = {listStyles.title + ' ' + listStyles.amt} >审核日期</Col>
            <Col span = {4} className = {listStyles.item} >{moment(CheckDate).format('YYYY-MM-DD')}</Col>
          </Row>
        </Card>

        <Card shadow = {true} radius = {false} style = {{marginTop: '2rem'}} >
          <Row>
            <Col span = {9} className = {listStyles.title} style = {{paddingLeft: '2rem'}} >项目</Col>
            <Col span = {5} className = {listStyles.title + ' ' + listStyles.center} >结果</Col>
            <Col span = {5} className = {listStyles.title + ' ' + listStyles.center} >参考范围</Col>
            <Col span = {5} className = {listStyles.title + ' ' + listStyles.center} >单位</Col>
          </Row>
          {this.renderItems()}
        </Card>

        <PrintWin visible = {this.state.printWinVisible} />
      </WorkSpace>
    );
  }

  renderItems () {
    if (this.props.outpatient.checkInfo.items) {
      return this.props.outpatient.checkInfo.items.map (
        (row, idx) => {
          const {Item, Result, State, Range, Unit} = row;
          return (
            <Row key = {'_cr_item_' + idx} >
              <Col span = {9} className = {listStyles.item} style = {{paddingLeft: '2rem'}} >{Item}</Col>
              <Col span = {5} className = {listStyles.item + ' ' + listStyles.center + ' ' + styles.resultCol} >
                {Result}
                {
                  State == '2' ? (
                    <img src = {upImg} />
                  ) : (
                    State == '3' ? (
                      <img src = {downImg} />
                    ) : null
                  )
                }
              </Col>
              <Col span = {5} className = {listStyles.item + ' ' + listStyles.center} >{Range}</Col>
              <Col span = {5} className = {listStyles.item + ' ' + listStyles.center} >{Unit}</Col>
            </Row>
          );
        }
      );
    }
  }

}

export default connect(({outpatient, message}) => ({outpatient, message}))(CheckResult);





