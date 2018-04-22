import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Row, Col, Modal }  from 'antd';
import moment               from 'moment';

import config               from '../../config';
import styles               from './InpatientDailyBill.css';
import listStyles           from '../../components/List.css';

import WorkSpace            from '../../components/WorkSpace';
import Card                 from '../../components/Card';
import Button               from '../../components/Button';
import BackTimer            from '../../components/BackTimer';
import Empty                from '../../components/Empty';
import Confirm              from '../../components/Confirm';
import ToolBar              from '../../components/ToolBar';
import InpatientCalendar    from '../../components/InpatientCalendar';

import calendarIcon         from '../../assets/base/calendar.png';

class InpatientDailyBill extends React.Component {

  static displayName = 'InpatientDailyBill';
  static description = '住院日清单查询';

  weekWinWidth = config.getWS().width - config.navBar.padding * 2 * config.remSize;
  modalWinTop  = config.navBar.height + config.navBar.padding * 2 + 5;

  static propTypes = {
  };

  static defaultProps = {
  };

  /**
  * 初始化状态
  */
  state = {
    selectedDate: moment(new Date()).format('YYYY-MM-DD'),
    showCalendar: false,
  };

  componentWillMount () {
	  this.loadDailyBillDetail();
  }

  constructor(props) {
    super(props);
    this.loadDailyBillDetail = this.loadDailyBillDetail.bind(this);
    this.renderItems      = this.renderItems.bind(this);
    this.openCalendarWin  = this.openCalendarWin.bind(this);
    this.onSelectedDate   = this.onSelectedDate.bind(this);
    this.preDay           = this.preDay.bind(this);
    this.nextDay          = this.nextDay.bind(this);
    this.renderSelectDate = this.renderSelectDate.bind(this);
  }
  
  loadDailyBillDetail () {
    this.props.dispatch({
      type: 'inpatient/loadDailyBillDetail',
      payload: {
    	  billDate: this.state.selectedDate
      },
    });
  }

  openCalendarWin () {
    this.setState({showCalendar: true});
  }

  onSelectedDate (d) {
    this.setState({
      selectedDate: moment(d).format('YYYY-MM-DD'),
      showCalendar: false,
    }, () => this.loadDailyBillDetail());
  }

  preDay () {
    const {InpatientAdmissionDate} = this.props.inpatient;
    if (!InpatientAdmissionDate || moment(this.state.selectedDate).add(-1, 'd').format('YYYY-MM-DD') < moment(InpatientAdmissionDate).format('YYYY-MM-DD'))
      return;
    this.setState({selectedDate: moment(this.state.selectedDate).add(-1, 'd').format('YYYY-MM-DD')}, () => {
      this.loadDailyBillDetail();
    });
  }

  nextDay () {
    if (moment(this.state.selectedDate).add(1, 'd').format('YYYY-MM-DD') > moment(new Date()).format('YYYY-MM-DD'))
      return;
    this.setState({selectedDate: moment(this.state.selectedDate).add(1, 'd').format('YYYY-MM-DD')}, () => {
      this.loadDailyBillDetail();
    });
  }

  render() {
    
    const { InpatientInfo, InpatientInfoLoaded, InpatientAdmissionDate } = this.props.inpatient;
    if (InpatientInfoLoaded === true && !InpatientInfo.inpatientId)
      return (
        <Empty info = '暂无正在住院信息！' />
      );

    const { inpatientId, bedNo, inpatientName, admissionDate, billDate, feeType, feeTypeName } = InpatientInfo;
    
    let preBtnStyle = !InpatientAdmissionDate || moment(this.state.selectedDate).add(-1, 'd').format('YYYY-MM-DD') < moment(InpatientAdmissionDate).format('YYYY-MM-DD') ?
        {backgroundColor: '#999999', color: '#ffffff'} : {};
    let nextBtnStyle = moment(this.state.selectedDate).add(1, 'd').format('YYYY-MM-DD') > moment(new Date()).format('YYYY-MM-DD') ?
        {backgroundColor: '#999999', color: '#ffffff'} : {};

    return (
      <WorkSpace fullScreen = {true} style = {{paddingTop: '2rem'}} >

        <ToolBar style = {{paddingTop: '10px'}} >
          <Row className = {styles.toolBarItems} >
            <Col span = {8} className = {styles.toolBarItem} >
              <Card shadow = {true} onClick = {this.preDay} style = {preBtnStyle} >
                前一天
              </Card>
            </Col>
            <Col span = {8} className = {styles.toolBarItem + ' ' + styles.date} >
              <Card shadow = {true} onClick = {this.openCalendarWin} >
                <img src = {calendarIcon} />
                {this.state.selectedDate}
              </Card>
            </Col>
            <Col span = {8} className = {styles.toolBarItem} >
              <Card shadow = {true} onClick = {this.nextDay} style = {nextBtnStyle} >
                后一天
              </Card>
            </Col>
          </Row>
        </ToolBar>

        <Card shadow = {true} radius = {false} >
          <Row>
            <Col span = {4} className = {listStyles.title + ' ' + listStyles.amt} >姓名</Col>
            <Col span = {4} className = {listStyles.item} >{inpatientName}</Col>
            <Col span = {4} className = {listStyles.title + ' ' + listStyles.amt} >住院号</Col>
            <Col span = {4} className = {listStyles.item} >{inpatientId}</Col>
            <Col span = {4} className = {listStyles.title + ' ' + listStyles.amt} >床位号</Col>
            <Col span = {4} className = {listStyles.item} >{bedNo}</Col>
          </Row>
          <Row>
            <Col span = {4} className = {listStyles.title + ' ' + listStyles.amt} >入院日期</Col>
            <Col span = {4} className = {listStyles.item} >{moment(admissionDate).format('YYYY-MM-DD')}</Col>
            <Col span = {4} className = {listStyles.title + ' ' + listStyles.amt} >费用日期</Col>
            <Col span = {4} className = {listStyles.item} >{moment(billDate).format('YYYY-MM-DD')}</Col>
            <Col span = {4} className = {listStyles.title + ' ' + listStyles.amt} >费用类别</Col>
            <Col span = {4} className = {listStyles.item} >{feeTypeName}</Col>
          </Row>
        </Card>

        <Row>
          <Col span = {9} className = {listStyles.title} >医疗收费项目/序列号（规格）</Col>
          <Col span = {5} className = {listStyles.title + ' ' + listStyles.amt} >单价</Col>
          <Col span = {5} className = {listStyles.title + ' ' + listStyles.amt} >数量</Col>
          <Col span = {5} className = {listStyles.title + ' ' + listStyles.amt} >金额</Col>
        </Row>
        <Card shadow = {true} radius = {false} className = {styles.rows} >
          {this.renderItems()}
        </Card>

        <Modal visible = {this.state.showCalendar} closable = {false} footer = {null} width = {this.weekWinWidth + 'px'} style = {{top: this.modalWinTop + 'rem'}} >
          {this.renderSelectDate()}
        </Modal>

      </WorkSpace>
    );
  }

  renderSelectDate () {
    const { InpatientAdmissionDate } = this.props.inpatient;
    return (
      <InpatientCalendar width = {this.weekWinWidth - 32} initDate = {this.state.selectedDate} onSelectDay = {this.onSelectedDate} admissionDate = {InpatientAdmissionDate} />
    );
  }

  renderItems () {
    if (this.props.inpatient.DailyBillDetailLoaded === false && !this.props.inpatient.DailyBillDetail.itemId){
    	return null;
    }
    else{
    	return this.props.inpatient.DailyBillDetail.map (
	        (row, idx) => {
	          const { itemId, itemName, price, count, amt } = row;
	
	          return (
	            <div key = {'_daily_bill_items_' + idx} className = {styles.row} >
	              <Row type="flex" align="middle" >
	                <Col span = {9} className = {listStyles.item} >
	                  {itemName}
	                </Col>
	                <Col span = {5} className = {listStyles.item + ' ' + listStyles.amt} >
	                  {price ? price.formatMoney() : null}
	                </Col>
	                <Col span = {5} className = {listStyles.item + ' ' + listStyles.amt} >
	                  {count}
	                </Col>
	                <Col span = {5} className = {listStyles.item + ' ' + listStyles.amt} >
	                  {amt ? amt.formatMoney() : null}
	                </Col>
	              </Row>
	            </div>
	          );
	        }
      );
    }
  }
}

export default connect(({inpatient, message}) => ({inpatient, message}))(InpatientDailyBill);





