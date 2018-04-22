import React, { PropTypes }     from 'react';
import { connect }              from 'dva';
import { Row, Col }             from 'antd';
import config                   from '../config';
import styles                   from './Month.css';
import moment                   from 'moment';
import Button               from './Button';
class Month extends React.Component {

  constructor (props) {
    super(props);
    this.onSelect = this.onSelect.bind(this);
    this.prePage = this.prePage.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.init = this.init.bind(this);
  }

  onSelect (doctor) {
    if (typeof this.props.onSelect == 'function')
      this.props.onSelect(doctor);
  }
  state = { pageNo:1,pageSize : 20  }
  componentWillMount () {
  }
  prePage(){
  }
  nextPage(){
  }
  render () {
    let { doctors } = this.props;
	return(
	  <div className = {styles.container} >
	    <div className = {styles.innerContainer} >
	      <Row className = {styles.weekdaysRow} >
	      {
	    	  this.weekDays.map((row, idx) => {
                  let className = idx == 5 || idx == 6 ? ' ' + styles.w_weekend : '';
                  className +=    idx == 6 ? ' ' + styles.w_sun : '';
                  return (
                    <Col key = {'_weekdays_' + idx} span = {idx == 6 ? 6 : 3} style = {{padding: '2px'}} >
                      <div className = {styles.weekday + className} >{row}</div>
                    </Col>
                  );
	    	  })
	      }
	      </Row>
	      <Row>
	      {
	    	  this.state.days.map((day, idx) => {
	    		var style = {},className = styles.day;
	    		var currentMonth = (firstDay.getMonth() != day.getMonth());
                if(currentMonth) style = {...style,backgroundColor: '#E4E4E4', color: '#ffffff', border: 0};
                if(moment(this.props.initDate).format('YYYYMMDD')== moment(day).format('YYYYMMDD')){
                	className+=" "+styles.selectedDay;
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
		      	<Button  text = "上一页" onClick = {this.preMonth} />
	          </Col>
	          <Col span = {8} style = {{padding: '2px'}} >
	          	<Button  text = "全部医生" onClick = {this.preMonth} />
	          </Col>
	          <Col span = {8} style = {{padding: '2px'}} >
	          	<Button  text = "下一页" onClick = {this.nextMonth} />
	          </Col>
	      </Row>
	    </div>
	  </div>
    );
  }
}

export default connect()(Month);


