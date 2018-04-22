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
    	  id : this.props.location.state.checkRecords.id
      },
    });
  }

  constructor(props) {
    super(props);
    this.print          = this.print.bind(this);
    this.renderItems    = this.renderItems.bind(this);
  }

  print (row) {
    this.props.dispatch({
      type: 'outpatient/loadCheckInfoForPrint',
      payload: {
        printInfo : row 
      },
    });

    /*this.setState({printWinVisible: true});

    setTimeout(() => {
      this.setState({printWinVisible: false});

      this.props.dispatch({
        type: 'message/show',
        payload: {
          msg: '打印完成！',
        }
      });
    }, 3000);*/
  }

  render () {
    const { patientId, patientName, requestDate, requestDeptName, requestDoctorName, receiveDate, specimenTypeName, checkDoctorName, checkDate } = this.props.location.state.checkRecords;
    //this.props.location.state.checkRecords.id从页面传递过来的数据
    return (
      <WorkSpace fullScreen = {true} style = {{paddingTop: '2rem'}} >

        <Card  radius = {false} >
          <Row>
            <Col span = {4} className = {listStyles.title + ' ' + listStyles.amt} >检查单号</Col>
            <Col span = {4} className = {listStyles.item} >{patientId}</Col>
            <Col span = {4} className = {listStyles.title + ' ' + listStyles.amt} >姓名</Col>
            <Col span = {4} className = {listStyles.item} >{patientName}</Col>
            <Col span = {4} className = {listStyles.title + ' ' + listStyles.amt} >申请日期</Col>
            <Col span = {4} className = {listStyles.item} >{moment(requestDate).format('YYYY-MM-DD')}</Col>
          </Row>
          <Row>
            <Col span = {4} className = {listStyles.title + ' ' + listStyles.amt} >申请科室</Col>
            <Col span = {4} className = {listStyles.item} >{requestDeptName}</Col>
            <Col span = {4} className = {listStyles.title + ' ' + listStyles.amt} >申请医生</Col>
            <Col span = {4} className = {listStyles.item} >{requestDoctorName}</Col>
            <Col span = {4} className = {listStyles.title + ' ' + listStyles.amt} >接收日期</Col>
            <Col span = {4} className = {listStyles.item} >{moment(receiveDate).format('YYYY-MM-DD')}</Col>
          </Row>
          <Row>
            <Col span = {4} className = {listStyles.title + ' ' + listStyles.amt} >样本类型</Col>
            <Col span = {4} className = {listStyles.item} >{specimenTypeName}</Col>
            <Col span = {4} className = {listStyles.title + ' ' + listStyles.amt} >审核医生</Col>
            <Col span = {4} className = {listStyles.item} >{checkDoctorName}</Col>
            <Col span = {4} className = {listStyles.title + ' ' + listStyles.amt} >审核日期</Col>
            <Col span = {4} className = {listStyles.item} >{moment(checkDate).format('YYYY-MM-DD')}</Col>
          </Row>
        </Card>

        <Card  radius = {false} style = {{marginTop: '2rem'}} >
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
    if (this.props.outpatient.checkInfo) {
      return this.props.outpatient.checkInfo.map (
        (row, idx) => {
          const {item, result, state, range, unit} = row;
          return (
            <Row key = {'_cr_item_' + idx} >
              <Col span = {9} className = {listStyles.item} style = {{paddingLeft: '2rem'}} >{item}</Col>
              <Col span = {5} className = {listStyles.item + ' ' + listStyles.center + ' ' + styles.resultCol} >
                {result}
                {
                	state == '2' ? (
                    <img src = {upImg} />
                  ) : (
                	  state == '3' ? (
                      <img src = {downImg} />
                    ) : null
                  )
                }
              </Col>
              <Col span = {5} className = {listStyles.item + ' ' + listStyles.center} >{range}</Col>
              <Col span = {5} className = {listStyles.item + ' ' + listStyles.center} >{unit}</Col>
            </Row>
          );
        }
      );
    }
  }

}

export default connect(({outpatient, message}) => ({outpatient, message}))(CheckResult);





