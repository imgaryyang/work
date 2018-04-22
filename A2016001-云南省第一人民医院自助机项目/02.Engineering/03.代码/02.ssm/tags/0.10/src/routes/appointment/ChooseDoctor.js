import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { 
  Row, Col, 
  Icon, Modal,
}                           from 'antd';
import moment               from 'moment';

import config               from '../../config';
import styles               from './ChooseDoctor.css';

import WorkSpace            from '../../components/WorkSpace';
import Card                 from '../../components/Card';
import Button               from '../../components/Button';
import ToolBar              from '../../components/ToolBar';
import Week                 from '../../components/Week';
import Empty                from '../../components/Empty';

import calendarIcon         from '../../assets/base/calendar.png';
import alltimeIcon          from '../../assets/base/alltime.png';
import searchIcon           from '../../assets/base/search.png';

class ChooseDoctor extends React.Component {

  static displayName = 'ChooseDoctor';
  static description = '选择医生';

  static propTypes = {
  };

  static defaultProps = {
  };

  weekWinWidth = config.getWS().width - config.navBar.padding * 2 * config.remSize;
  modalWinTop  = config.navBar.height + config.navBar.padding * 2 + 5;

  constructor (props) {
    super(props);

    this.showSelectDate         = this.showSelectDate.bind(this);
    this.onSelectDay            = this.onSelectDay.bind(this);
    this.selectAllDays          = this.selectAllDays.bind(this);

    this.showSelectDayPeriod    = this.showSelectDayPeriod.bind(this);
    this.onSelectDayPeriod      = this.onSelectDayPeriod.bind(this);

    this.showSearchDoctor       = this.showSearchDoctor.bind(this);
    this.chooseDoc              = this.chooseDoc.bind(this);

    this.renderSelectDate       = this.renderSelectDate.bind(this);
    this.renderSelectDayPeriod  = this.renderSelectDayPeriod.bind(this);
  }

  /**
   * 初始化数据
   */
  componentWillMount () {
    this.props.dispatch({
      type: 'arrange/load',
      payload: {
        selectedDept: this.props.location.state.dept,
        /*showDateModal: true,*/
      },
    });
  }

  /**
   * 显示选择日期界面
   */
  showSelectDate () {
    this.props.dispatch({
      type: 'arrange/setState',
      payload: {
        showDateModal: true,
      },
    });
  }

  /**
   * 选择日期后按日期查询数据
   */
  onSelectDay (day) {
    this.props.dispatch({
      type: 'arrange/load',
      payload: {
        selectedDate: moment(day).format('YYYY-MM-DD'),
        showDateModal: false,
      },
    });
  }

  /**
   * 选择所有日期，清空日期查询条件显示所有可预约号源
   */
  selectAllDays () {
    this.props.dispatch({
      type: 'arrange/load',
      payload: {
        selectedDate: 'all',
        showDateModal: false,
      },
    });
  }

  /**
   * 显示选择上/下午界面
   */
  showSelectDayPeriod () {
    this.props.dispatch({
      type: 'arrange/setState',
      payload: {
        showDayPeriodModal: true,
      },
    });
  }

  /**
   * 选择完上/下午后按条件重新发起查询
   */
  onSelectDayPeriod (dp) {
    this.props.dispatch({
      type: 'arrange/load',
      payload: {
        selectedDayPeriod: dp,
        showDayPeriodModal: false,
      },
    });
  }

  /**
   * 显示搜索医生界面
   */
  showSearchDoctor () {
    this.props.dispatch(routerRedux.push({
      pathname: '/searchDoctor',
      state: {
        onChoose: 'arrange/load',
        nav: {
          title: '搜索医生',
          backDisabled: false,
        },
      },
    }));
  }

  /**
   * 选择医生
   */
  chooseDoc (arrangeItem) {
    this.props.dispatch(routerRedux.push({
      pathname: '/chooseTimePeriod',
      state: {
        dept: this.props.location.state.dept,
        arrangeItem: arrangeItem,
        nav: {
          title: '选择预约时段',
          backDisabled: false,
        },
      },
    }));
  }

  render () {

    const { loaded, arranges, selectedDate, selectedDayPeriod, selectedDoctor, showDateModal, showDayPeriodModal } = this.props.arrange;

    let iconStyle = {
      color: '#5D5D5D',
    }

    let height = config.getWS().height - (config.navBar.padding + 6) * config.remSize;

    return (
      <WorkSpace fullScreen = {true} >

        <ToolBar style = {{paddingTop: '10px'}} >
          <Row>
            <Col span = {8} className = {styles.toolBarItem} style = {{paddingRight: '.5rem'}} >
              <Card shadow = {true} onClick = {this.showSelectDate} >
                <img src = {calendarIcon} />
                {selectedDate == 'all' ? '全部日期' : moment(selectedDate).format('Y年M月D日')}
              </Card>
            </Col>
            <Col span = {8} className = {styles.toolBarItem} style = {{paddingRight: '.5rem', paddingLeft: '.5rem'}} >
              <Card shadow = {true} onClick = {this.showSelectDayPeriod} >
                <img src = {alltimeIcon} />
                {selectedDayPeriod == 'all' ? '全天' : (selectedDayPeriod.toLowerCase() == 'am' ? '上午' : '下午')}
              </Card>
            </Col>
            <Col span = {8} className = {styles.toolBarItem} style = {{paddingLeft: '.5rem'}} >
              <Card shadow = {true} onClick = {this.showSearchDoctor} >
                <img src = {searchIcon} />
                {selectedDoctor['DoctorName'] ? selectedDoctor['DoctorName'] : '全部医生' }
              </Card>
            </Col>
          </Row>
        </ToolBar>

        {
          loaded && arranges.length == 0 ? (
            <div style = {{height: height + 'px', position: 'relative'}} >
              <Empty info = {(<span>暂无可预约医生<br/><font style = {{fontSize: '2.5rem'}} >请重新选择查询条件进行查询</font></span>)} />
            </div>
          ) : null
        }

        <Row style = {{height: height + 'px', paddingLeft: config.navBar.padding + 'rem'}} >
        {
          arranges.map(
            (row, idx) => {
              let { ArrangeId, ArrangeDate, DayPeriod, DiagnosisType, DocotorId, DoctorName, JobTitleId, JobTitle, RegisteredAmount, UnusedBookNum } = row;
              return (
                <Col span = {6} key = {'_arrange_item_' + idx} style = {{paddingRight: config.navBar.padding + 'rem', paddingTop: config.navBar.padding + 'rem'}} >
                  <div className = {styles.arrangeItem} onClick = {() => this.chooseDoc(row)} >
                    <div className = {styles.doctor} >{DoctorName}<font>&nbsp;{JobTitle}</font></div>
                    <Row>
                      <Col span = {8} className = {styles.info2} style = {{borderLeft: '0'}} >{DayPeriod.toLowerCase() == 'am' ? '上午' : '下午'}<font>{moment(ArrangeDate).format('M月D日')}</font></Col>
                      <Col span = {8} className = {styles.info2} >{UnusedBookNum}<font>剩余</font></Col>
                      <Col span = {8} className = {styles.info2} ><span style = {{color: '#BC1E1E'}} >{RegisteredAmount}</span><font>诊疗费</font></Col>
                    </Row>
                  </div>
                </Col>
              );
            }
          )
        }
        </Row>

        <Modal visible = {showDateModal} closable = {false} footer = {null} width = {this.weekWinWidth + 'px'} style = {{top: this.modalWinTop + 'rem'}} >
          {this.renderSelectDate()}
        </Modal>
        <Modal visible = {showDayPeriodModal} closable = {false} footer = {null} style = {{top: this.modalWinTop + 'rem', padding: 0}} >
          {this.renderSelectDayPeriod()}
        </Modal>
      </WorkSpace>
    );
  }

  renderSelectDate () {
    const { selectedDate } = this.props.arrange;
    return (
      <div>
        <Week width = {this.weekWinWidth - 32} initDate = {selectedDate == 'all' ? null : selectedDate} onSelectDay = {this.onSelectDay} />
        <Button text = "全部日期" style = {{marginTop: '1rem'}} onClick = {this.selectAllDays} />
      </div>
    );
  }

  renderSelectDayPeriod () {
    const { selectedDayPeriod } = this.props.arrange;
    return (
      <div className = {styles.dayPeriod} >
        <span onClick = {() => this.onSelectDayPeriod('all')} className = {selectedDayPeriod == 'all' ? styles.selectedDayPeriod : ''} >全天</span>
        <span onClick = {() => this.onSelectDayPeriod('am')} className = {selectedDayPeriod == 'am' ? styles.selectedDayPeriod : ''} >上午</span>
        <span onClick = {() => this.onSelectDayPeriod('pm')} className = {selectedDayPeriod == 'pm' ? styles.selectedDayPeriod : ''} >下午</span>
      </div>
    );
  }

}
  

export default connect(({arrange}) => ({arrange}))(ChooseDoctor);



