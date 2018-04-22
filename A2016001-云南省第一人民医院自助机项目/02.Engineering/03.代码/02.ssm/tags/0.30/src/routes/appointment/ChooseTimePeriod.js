import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Row, Col }         from 'antd';
import moment               from 'moment';

import config               from '../../config';
import styles               from './ChooseTimePeriod.css';

import {WorkSpace,Empty,Card,Button,ToolBar}          from '../../components';

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
    this.next = this.next.bind(this);
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'schedule/loadTimePeriod',
      payload: {
    	  schedule: this.props.location.state.schedule,
      },
    });
  }
  
  chooseTimePeriod(timePeriod) {//预约请求 
	  var schedule = this.props.location.state.schedule;
	  var tp =  {...timePeriod,...schedule};//TODO 未来删掉
	  tp.id = timePeriod.apptId;
	  tp.scheduleId = schedule.id;
	  
	  this.props.dispatch({
	      type: 'schedule/book',
	      payload: {
	    	  timePeriod:tp ,
	    	  callback:this.next//成功后跳转页面
	      },
	    });
  }
  
  next(timePeriod){
	  //console.info('next : ',timePeriod);
	  this.props.dispatch(
		  routerRedux.push({
			  pathname: '/appointmentConfirm',
			  state: {
				  timePeriod: timePeriod,
		    	  nav: {
		    		  title: '预约成功',
			          backDisabled: true,
			      },
			  },
		  })
	  ); 
  }
  render() {
    const { departmentName,doctorName,date,dayPeriod} = this.props.location.state.schedule;
    const { timePeriods} = this.props.schedule;
    let height = config.getWS().height - (config.navBar.padding + 6) * config.remSize;
    
    return (
      <WorkSpace fullScreen = {true} >
        <ToolBar>
          <Card style = {{fontSize: '2.6rem', lineHeight: '6rem', textAlign: 'center'}} >
            {departmentName}&nbsp;>&nbsp; {doctorName}&nbsp;>&nbsp;
            {moment(date).format('YYYY年M月D日')}&nbsp;
            {dayPeriod.toLowerCase() == 'am' ? '上午' : '下午'}
          </Card>
        </ToolBar>

        <Row style = {{paddingLeft: config.navBar.padding + 'rem'}} >
        {
        	timePeriods.map((row, idx) => {
        		let { apptId, apptDate, apptTime, dayPeriod, startTime, endTime, bookNum, registeredAmount } = row;
        		return (
        			<Col span = {6} key = {'_tp_item_' + idx} onClick = {() => this.chooseTimePeriod(row)} style = {{paddingRight: config.navBar.padding + 'rem', paddingTop: config.navBar.padding + 'rem'}} >
	        			<div className = {styles.tpItem} ><span>{bookNum}</span>&nbsp;&nbsp;{startTime}</div>
        			</Col>
        		);
        	})
        }
        {
        	timePeriods.length == 0 ? (
        		<div style = {{height: height + 'px', position: 'relative'}} >
        		<Empty info = {(<span>暂无可选时间段<br/><font style = {{fontSize: '2.5rem'}} >请重新选择查询条件进行查询</font></span>)} />
        		</div>
        	) : null
        }
        </Row>
      </WorkSpace>
    );
  }
}
  

export default connect(({schedule}) => ({schedule}))(ChooseTimePeriod);



