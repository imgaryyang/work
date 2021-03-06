import React, { PropTypes }     from 'react';
import { Row, Col }             from 'antd';
import styles                   from './Week.css';
import moment                   from 'moment';

class Week extends React.Component {
 
  constructor (props) {
    super(props);
    this.onSelectDay = this.onSelectDay.bind(this);
    
    this.weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    this.days = [];
  }

  onSelectDay (row) {
    if (!row.available) return;
    if (typeof this.props.onSelectDay == 'function')
      this.props.onSelectDay(row.day);
  }

  componentWillMount () {
    window.ssmConfig = window.ssmConfig||{};
    var availableDaysLen =  window.ssmConfig['appointment.availableAppointDays'] || 14;
    var appointToday = window.ssmConfig['appointment.appointToday'];
    if(appointToday !== false )appointToday = true;
    //今天
    let firstAvailableDay = moment(new Date());
    firstAvailableDay = appointToday ? firstAvailableDay : moment(firstAvailableDay).add(1, 'd');
    //最后有效日期
    let lastAvailableDay = moment(firstAvailableDay).add(availableDaysLen, 'd');
    //日历显示初始日期
    let start = moment(firstAvailableDay).weekday() == 0 ? moment(firstAvailableDay).weekday(-6) : moment(firstAvailableDay).weekday(1);
    //日历显示结束日期
    let end = moment(lastAvailableDay).weekday() == 0 ? lastAvailableDay : moment(lastAvailableDay).weekday(6).add(1, 'd');

    let available = false;
    for (let i = 0 ; i <= end.diff(start, 'days') ; i++) {
      let d = moment(start).add(i, 'd');
      if (!available && moment(d).format('YYYYMMDD') == moment(firstAvailableDay).format('YYYYMMDD')) available = true;
      this.days.push({
        day: d, 
        available: available, 
        isWeekend: (moment(d).weekday() == 0 || moment(d).weekday() == 6)/* ? true : false*/,
        isSunday: moment(d).weekday() == 0,
      });
      if (available && moment(d).format('YYYYMMDD') == moment(lastAvailableDay).format('YYYYMMDD')) available = false;
    }
  }
 
  render () {

    let {width, style, initDate, onSelectDay, dispatch, ...otherProps} = this.props;
    width = width ||800;
    style = style ? style : {};
    style['width'] = width + 'px';

    let innerCtnStyle = {
      width: (width + (width / 7)) + 'px',
    };

    return (
      <div className = 'week_container' style = {style} {...otherProps} >
        <div className = 'week_innerContainer' style = {innerCtnStyle} >
          <Row className = 'week_weekdaysRow' >
            {
              this.weekDays.map((row, idx) => {
                  let className = idx == 5 || idx == 6 ? ' week_w_weekend' : '';
                  className +=    idx == 6 ? ' week_w_sun' : '';

                  return (
                    <Col key = {'_weekdays_' + idx} span = {idx == 6 ? 6 : 3} style = {{padding: '2px'}} >
                      <div className = {'week_weekday' + className} >{row}</div>
                    </Col>
                  );
                }
              )
            }
          </Row>
          <Row>
            {
              this.days.map((row, idx) => {
                  let {day, available, isWeekend, isSunday} = row;

                  //不可用日期指定不同样式
                  let style = available ? {} : {backgroundColor: '#E4E4E4', color: '#ffffff', border: 0};
                  if (available && isWeekend) style['color'] = '#828282';
                  //周末指定不同样式
                  let className = isWeekend ? ' week_d_weekend' : '';
                  className +=    isSunday  ? ' week_d_sun' : '';
                  //被选中日期样式
                  let selectedClassName = this.props.initDate && moment(this.props.initDate).format('YYYYMMDD') == moment(day).format('YYYYMMDD') ? ' week_selectedDay' : '';
                  //每月第一天或最后一天显示月份
                  let firstDayOfMonth = moment(day).startOf('month').format('D'),
                  lastDayOfMonth = moment(day).endOf('month').format('D');

                  let FOLMonthDayClassName = moment(day).date() + '' == firstDayOfMonth ? ' week_firstDayOfMonth' : ' week_lastDayOfMonth' ;
                  let monthComp = moment(day).date() + '' == firstDayOfMonth || moment(day).date() + '' == lastDayOfMonth ? 
                    (<h1 className = {'week_firstOrLastMonthDay' + FOLMonthDayClassName} >{moment(day).format('Y年M月')}</h1>) 
                    : null;
                    
                  if( moment().format('YYYYMMDD') == moment(day).format('YYYYMMDD') ){
                	  monthComp = (<h1 className = 'week_firstOrLastMonthDay week_firstDayOfMonth' >{'今天'}</h1>)
                  }
                  return (
                    <Col key = {'_days_' + idx} span = {(idx + 1) % 7 == 0 ? 6 : 3} style = {{padding: '2px'}} >
                      <div className = {'week_day' + className + selectedClassName} style = {style} onClick = {() => this.onSelectDay(row)} >
                        {monthComp}
                        <span>{moment(day).format('D')}</span>
                      </div>
                    </Col>
                  );
                }
              )
            }
          </Row>
        </div>
      </div>
    );
  }

}
module.exports = Week;