import React, { PropTypes }     from 'react';
import { Row, Col }             from 'antd';
import styles                   from './Month.css';
import moment                   from 'moment';
import Button               from './Button.jsx';
class Month extends React.Component {


  constructor (props) {
    super(props);
    this.onSelectDay = this.onSelectDay.bind(this);
    this.preMonth = this.preMonth.bind(this);
    this.nextMonth = this.nextMonth.bind(this);
    this.init = this.init.bind(this);
    this.weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

    this.state={
  	days : [],
  	firstDay : new Date(),
    }
  }

  onSelectDay (day) {
    if (typeof this.props.onSelectDay == 'function')
      this.props.onSelectDay(day);
  }

  componentWillMount () {
	const now = new Date();
	this.init(now)
  }
  init(value){
	const first = new Date(value.getFullYear(),value.getMonth(),1);
	const last = new Date(value.getFullYear(),value.getMonth()+1,0);
	
	const start = new Date(first.getFullYear(),first.getMonth(),first.getDate()-first.getDay()+1);
	const days = [];
	var day = start;
	while(day.getTime() <= last.getTime()){
		for(var i=1;i<=7;i++){
			days.push(day);
			day = new Date(day.getFullYear(),day.getMonth(),day.getDate()+1);
		}
	}
	for(var day of days){
		var f = moment(day).format('YYYY-MM-DD')
	}
	this.setState({days,firstDay:first});
  }
  preMonth(){
	const { firstDay }   = this.state;
	const pre = new Date(firstDay.getFullYear(),firstDay.getMonth()-1,1); 
	this.init(pre)
  }
  nextMonth(){
	const { firstDay }   = this.state;
	const next = new Date(firstDay.getFullYear(),firstDay.getMonth()+1,1); 
	this.init(next)
  }
  render () {
    let {width, style, initDate, onSelectDay, dispatch, ...otherProps} = this.props;
    width = width ||800;
    const { firstDay } = this.state;
	return(
	  <div className = 'month_container' >
	    <div className = 'month_innerContainer' >
	      <Row className = 'month_weekdaysRow' >
	      {
	    	  this.weekDays.map((row, idx) => {
                  let className = idx == 5 || idx == 6 ? ' month_w_weekend': '';
                  className +=    idx == 6 ? ' month_w_sun' : '';
                  return (
                    <Col key = {'_weekdays_' + idx} span = {idx == 6 ? 6 : 3} style = {{padding: '2px'}} >
                      <div className = {'month_weekday ' + className} >{row}</div>
                    </Col>
                  );
	    	  })
	      }
	      </Row>
	      <Row>
	      {
	    	  this.state.days.map((day, idx) => {
	    		var style = {},className = 'month_day';
	    		var currentMonth = (firstDay.getMonth() != day.getMonth());
                if(currentMonth) style = {...style,backgroundColor: '#E4E4E4', color: '#ffffff', border: 0};
                if(moment(this.props.initDate).format('YYYYMMDD')== moment(day).format('YYYYMMDD')){
                	className+=" "+'month_selectedDay';
                }
                
                return (
	              <Col key = {'_days_' + idx} span = {(idx + 1) % 7 == 0 ? 6 : 3} style = {{padding: '2px'}} >
	                <div className = {className} style={style}
	                	onClick = { currentMonth? ()=>{} : () => this.onSelectDay(day)  } >
	                  <span>{moment(day).format('D')}</span>
	                </div>
	              </Col>
		    	)
		      })
	      }
	      </Row>
	      <Row>
		      <Col span = {8} style = {{padding: '2px'}} >
		      	<Button  text = "上月" onClick = {this.preMonth} />
	          </Col>
	          <Col span = {8} style = {{padding: '2px'}} >
		        <div style={{fontSize: '4rem',fontWeight: 500,lineHeight:'6rem',height:'6rem',textAlign: 'center',border: 0}} >
	        	  <span>{moment(firstDay).format('YYYY年MM月')}</span>
	         	</div>
	          </Col>
	          <Col span = {8} style = {{padding: '2px'}} >
	          	<Button  text = "下月" onClick = {this.nextMonth} />
	          </Col>
	      </Row>
	    </div>
	  </div>
    );
  }
}
module.exports = Month;