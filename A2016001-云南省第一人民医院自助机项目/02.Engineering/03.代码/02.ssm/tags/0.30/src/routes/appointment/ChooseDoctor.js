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

import {
	WorkSpace,Card,
	Button,ToolBar,
	Week,Empty}             from '../../components';

import calendarIcon         from '../../assets/base/calendar.png';
import alltimeIcon          from '../../assets/base/alltime.png';
import searchIcon           from '../../assets/base/search.png';

class ChooseDoctor extends React.Component {
	
	static displayName = 'ChooseDoctor';
	static description = '选择医生';
	
	static propTypes = { };
	
	static defaultProps = { };
	
	state = {
			showDateModal : false, 
			showDayPeriodModal : false, 
			showDoctorModal : false,
	}
	
	
	weekWinWidth = config.getWS().width - config.navBar.padding * 2 * config.remSize;
	modalWinTop  = config.navBar.height + config.navBar.padding * 2 + 5;
	
	constructor (props) {
		super(props);
		
		this.showDatePicker      =  this.showDatePicker.bind(this);
		this.showDayPeriodPicker =  this.showDayPeriodPicker.bind(this);
		this.showDoctorPicker    =  this.showDoctorPicker.bind(this);
		this.setSearchParam      =  this.setSearchParam.bind(this);
		this.onSelectDay         =  this.onSelectDay.bind(this);
		
//		this.chooseSchedule = this.chooseSchedule.bind(this);
//		this.showSelectDate         = this.showSelectDate.bind(this);
//		this.onSelectDay            = this.onSelectDay.bind(this);
//		this.selectAllDays          = this.selectAllDays.bind(this);
//		this.showSelectDayPeriod    = this.showSelectDayPeriod.bind(this);
//		this.onSelectDayPeriod      = this.onSelectDayPeriod.bind(this);
//		this.showSearchDoctor       = this.showSearchDoctor.bind(this);
//		this.chooseDoc              = this.chooseDoc.bind(this);
//		
//		this.renderSelectDate       = this.renderSelectDate.bind(this);
//		this.renderSelectDayPeriod  = this.renderSelectDayPeriod.bind(this);
	}
	/**
	 *初始化数据
	 */
	componentWillMount () {
		this.props.dispatch({
			type: 'schedule/loadSchedules',
		});
	}
	setSearchParam(param){
		this.props.dispatch({
			type: 'schedule/setSearchParam',
			payload:param
		});
	}
	showDatePicker () {
		this.setState({showDateModal:true});
	}
	
	showDayPeriodPicker () {
		this.setState({showDayPeriodModal:true});
	}
	
	showDoctorPicker () {
		this.setState({showDoctorModal:true});
	}
	
	onSelectDay(day){
		var date = day ? moment(day).format('YYYY-MM-DD') : null;
		this.setState({showDateModal:false},()=>{
			this.setSearchParam({date:date});
		});
	}
	
	onSelectDayPeriod(dayPeriod){
		this.setState({showDayPeriodModal:false},()=>{
			this.setSearchParam({dayPeriod:dayPeriod});
		});
	}
	
	onSelectDoctor(doctor){
		this.setState({showDoctorModal:false},()=>{
			this.setSearchParam({doctor:doctor});
		});
	}
	
	onSelectSchedule(schedule){
		this.props.dispatch(routerRedux.push({
			pathname: '/chooseTimePeriod',
			state: {
				schedule: schedule,
				nav: {
					title: '选择预约时段',
					backDisabled: false,
				},
			},
		}));
	}
	
	render () {console.info(this.props);
		const { showDateModal, showDayPeriodModal, showDoctorModal } = this.state;
		const { schedules, searchParam }                    = this.props.schedule;
		const { department, doctor,date, dayPeriod }        = searchParam;
		
		
		const dateText        =  date      ?  moment(date).format('Y年M月D日'):'全部日期';
		const dayPeriodText   =  dayPeriod ?  (dayPeriod.toLowerCase() == 'am' ? '上午' : '下午'):'全天';
		const doctorText      =  doctor    ?  doctor.name: '全部医生';
		
		let iconStyle = { color: '#5D5D5D',  }
		let height = config.getWS().height - (config.navBar.padding + 6) * config.remSize;
		
		return (
		<WorkSpace fullScreen = {true} >
			<ToolBar style = {{paddingTop: '10px'}} >
			<Row>
				<Col span = {8} className = {styles.toolBarItem} style = {{paddingRight: '.5rem'}} >
					<Card onClick = {this.showDatePicker} ><img src = {calendarIcon} />{dateText} </Card>
				</Col>
				<Col span = {8} className = {styles.toolBarItem} style = {{paddingRight: '.5rem', paddingLeft: '.5rem'}} >
					<Card onClick = {this.showDayPeriodPicker} ><img src = {alltimeIcon} />{dayPeriodText}</Card>
				</Col>
				<Col span = {8} className = {styles.toolBarItem} style = {{paddingLeft: '.5rem'}} >
					<Card onClick = {this.showDoctorPicker} ><img src = {searchIcon} />{doctorText}</Card>
				</Col>
			</Row>
			</ToolBar>
			<Row style = {{height: height + 'px', paddingLeft: config.navBar.padding + 'rem'}} >
			{
				schedules.map((schedule, index) => {
					let {id,doctorName,doctorJobTitle,dayPeriod,date,unusedBookNum,amt} = schedule;
					let dayPeriodText  =  dayPeriod.toLowerCase() == 'am' ? '上午' : '下午';
					let dateText       =  moment(date).format('M月D日');
					return (
						<Col span = {6} key = {'schedule' + id} style = {{paddingRight: config.navBar.padding + 'rem', paddingTop: config.navBar.padding + 'rem'}} >
						<div className = {styles.arrangeItem}  onClick = {() => this.onSelectSchedule(schedule)} >
							<div className = {styles.doctor} >{doctorName}<font>&nbsp;{doctorJobTitle}</font></div>
							<Row>
								<Col span = {8} className = {styles.info2} style = {{borderLeft: '0'}} >{dayPeriodText}<font>{dateText}</font></Col>
								<Col span = {8} className = {styles.info2} >{unusedBookNum}<font>剩余</font></Col>
								<Col span = {8} className = {styles.info2} ><span style = {{color: '#BC1E1E'}} >{amt}</span><font>诊疗费</font></Col>
							</Row>
						</div>
						</Col>
					);
				})
			}
			</Row>
			<Modal visible = {showDateModal} closable = {false} footer = {null} width = {this.weekWinWidth + 'px'} style = {{top: this.modalWinTop + 'rem'}} >
				<div>
					<Week width = {this.weekWinWidth - 32} initDate = {date == 'all' ? null : date} onSelectDay = {this.onSelectDay} />
					<Button text = "全部日期" style = {{marginTop: '1rem'}} onClick = {this.onSelectDay} />
				</div>
			</Modal>
			<Modal visible = {showDayPeriodModal} closable = {false} footer = {null} style = {{top: this.modalWinTop + 'rem', padding: 0}} >
				<div className = {styles.dayPeriod} >
					<span onClick = {() => this.onSelectDayPeriod(null)} className = {dayPeriod == null ? styles.selectedDayPeriod : ''} >全天</span>
					<span onClick = {() => this.onSelectDayPeriod('am')} className = {dayPeriod == 'am' ? styles.selectedDayPeriod : ''} >上午</span>
					<span onClick = {() => this.onSelectDayPeriod('pm')} className = {dayPeriod == 'pm' ? styles.selectedDayPeriod : ''} >下午</span>
				</div>
			</Modal>
		</WorkSpace>
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
  

export default connect(({schedule}) => ({schedule}))(ChooseDoctor);


///**
// * 选择日期后按日期查询数据
// */
//onSelectDay (day) {
//  this.props.dispatch({
//    type: 'arrange/load',
//    payload: {
//      selectedDate: moment(day).format('YYYY-MM-DD'),
//      showDateModal: false,
//    },
//  });
//}
//
///**
// * 选择所有日期，清空日期查询条件显示所有可预约号源
// */
//selectAllDays () {
//  this.props.dispatch({
//    type: 'arrange/load',
//    payload: {
//      selectedDate: 'all',
//      showDateModal: false,
//    },
//  });
//}
//
///**
// * 显示选择上/下午界面
// */
//showSelectDayPeriod () {
//  this.props.dispatch({
//    type: 'arrange/setState',
//    payload: {
//      showDayPeriodModal: true,
//    },
//  });
//}
//
///**
// * 选择完上/下午后按条件重新发起查询
// */
//onSelectDayPeriod (dp) {
//  this.props.dispatch({
//    type: 'arrange/load',
//    payload: {
//      selectedDayPeriod: dp,
//      showDayPeriodModal: false,
//    },
//  });
//}
//
///**
// * 显示搜索医生界面
// */
//showSearchDoctor () {
//  this.props.dispatch(routerRedux.push({
//    pathname: '/searchDoctor',
//    state: {
//      onChoose: 'arrange/load',
//      nav: {
//        title: '搜索医生',
//        backDisabled: false,
//      },
//    },
//  }));
//}
//
///**
// * 选择医生
// */
//chooseDoc (arrangeItem) {
//  this.props.dispatch(routerRedux.push({
//    pathname: '/chooseTimePeriod',
//    state: {
//      dept: this.props.location.state.dept,
//      arrangeItem: arrangeItem,
//      nav: {
//        title: '选择预约时段',
//        backDisabled: false,
//      },
//    },
//  }));
//}
//chooseSchedule(){
//	  
//}


//{
//loaded && arranges.length == 0 ? (
//<div style = {{height: height + 'px', position: 'relative'}} >
//  <Empty info = {(<span>暂无可预约医生<br/><font style = {{fontSize: '2.5rem'}} >请重新选择查询条件进行查询</font></span>)} />
//</div>
//) : null
//}








