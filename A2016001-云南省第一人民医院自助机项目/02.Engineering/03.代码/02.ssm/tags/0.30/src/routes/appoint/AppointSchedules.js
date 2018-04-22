import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { 
  Row, Col, 
  Icon, Modal,
}                           from 'antd';
import moment               from 'moment';

import config               from '../../config';
import styles               from './AppointSchedules.css';

import {
	WorkSpace,Card,
	Button,ToolBar,
	Week,Empty}             from '../../components';

import calendarIcon         from '../../assets/base/calendar.png';
import alltimeIcon          from '../../assets/base/alltime.png';
import searchIcon           from '../../assets/base/search.png';

import SearchDoctor           from '../base/SearchDoctor';


class AppointSchedules extends React.Component {
	
	constructor (props) {
		super(props);
		this.showDatePicker      =  this.showDatePicker.bind(this);
		this.showDayPeriodPicker =  this.showDayPeriodPicker.bind(this);
		this.showDoctorPicker    =  this.showDoctorPicker.bind(this);
		this.setSearchParam      =  this.setSearchParam.bind(this);
		this.onSelectDay         =  this.onSelectDay.bind(this);
		this.onSelectDoctor = this.onSelectDoctor.bind(this);
		this.nextPage         =  this.nextPage.bind(this);
		this.prePage         =  this.prePage.bind(this);
	}
	state = {
			showDateModal : true, 
			showDayPeriodModal : false, 
			showDoctorModal : false,
			query:{ 
				doctor:{},
				date:null, 
				durationName:null,
			},
			pageNo:1,
			pageSize : 12
	}
	
	weekWinWidth = config.getWS().width - config.navBar.padding * 2 * config.remSize;
	modalWinTop  = config.navBar.height + config.navBar.padding * 2 + 5;
	/**
	 *初始化数据
	 */
	componentDidMount () {
		var availableDaysLen = 14;
		var appointToday = true;
		if(window.ssmConfig){
			  availableDaysLen =  window.ssmConfig['appointment.availableAppointDays'] || 14;
			  appointToday = window.ssmConfig['appointment.appointToday'];
		}
		const { code:deptCode,hisId:deptId } = this.props.appoint.department;
		var startDate = moment().add(appointToday?0:1,'days').format('YYYY-MM-DD');
		var endDate = moment().add(availableDaysLen,'days').format('YYYY-MM-DD');
		this.props.dispatch({
			type: 'appoint/loadScheduleList',
			payload:{
				query:{deptCode,deptId,startDate,endDate}
			}
		});
	}
	setSearchParam(param){
		const query = {...this.state.query,...param};
		this.setState({query},()=>{
			this.props.dispatch({
				type: 'appoint/querySchedule',
				payload:{query}
			});
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
	nextPage(){
	  const { pageNo } =this.state;
	  this.setState({pageNo:pageNo+1});
	}
	prePage(){
	  const { pageNo } =this.state;
	  this.setState({pageNo:pageNo-1});
	}
	onSelectDay(day){
		var date = day ? moment(day).format('YYYY-MM-DD') : null;
		this.setState({showDateModal:false},()=>{
			this.setSearchParam({date:date});
		});
	}
	
	onSelectDayPeriod(durationName){
		this.setState({showDayPeriodModal:false},()=>{
			this.setSearchParam({durationName:durationName});
		});
	}
	
	onSelectDoctor(doctor){
		this.setState({showDoctorModal:false},()=>{
			this.setSearchParam({doctor:doctor});
		});
	}
	
	onSelectSchedule(schedule){
	  this.props.dispatch({
        type:'appoint/setState',
        payload : { 
        	schedule : schedule,
        	appointments : schedule.appointments||[]
        }
      });
	}
	
	render () {
		const { showDateModal, showDayPeriodModal, showDoctorModal,query } = this.state;
		var { filteredSchedules,doctors } = this.props.appoint;
		const { date, doctor ,durationName } = query;
		const { pageNo,pageSize} = this.state;
		let start = pageSize * (pageNo-1);
		let limit = pageSize * pageNo;
		//戒烟门诊特殊处理
		const { type  } = this.props.appoint.department;
		if('戒烟门诊' == type) {
			var temp = filteredSchedules.filter(function(item){
	    		return item.specialDiseasesName ==  type;
	    	});
			filteredSchedules= temp;
		}
		//戒烟门诊特殊处理完毕
		
		const schedules = filteredSchedules.slice(start,limit); 
		
		const dateText        =  date      ?  moment(date).format('Y年M月D日'):'全部日期';
		const durationText    =  durationName ? durationName : '所有';
		const doctorText      =  doctor&&doctor.name ? doctor.name : '全部医生';
		
		let iconStyle = { color: '#5D5D5D',  }
		let height = config.getWS().height - (config.navBar.padding + 10) * config.remSize;
		const dayPeriod = null;
		return (
		<WorkSpace fullScreen = {true} >
			<ToolBar style = {{paddingTop: '10px'}} >
			<Row>
				<Col span = {8} className = {styles.toolBarItem} style = {{paddingRight: '.5rem'}} >
					<Card onClick = {this.showDatePicker} ><img src = {calendarIcon} />{dateText} </Card>
				</Col>
				<Col span = {8} className = {styles.toolBarItem} style = {{paddingRight: '.5rem', paddingLeft: '.5rem'}} >
					<Card onClick = {this.showDayPeriodPicker} ><img src = {alltimeIcon} />{durationText}</Card>
				</Col>
				<Col span = {8} className = {styles.toolBarItem} style = {{paddingLeft: '.5rem'}} >
					<Card onClick = {this.showDoctorPicker} ><img src = {searchIcon} />{doctorText}</Card>
				</Col>
			</Row>
			</ToolBar>
			<Row style = {{height: (height-100) + 'px', paddingLeft: config.navBar.padding + 'rem'}} >
			{
				schedules.map((schedule, index) => {
					let {deptCode,scheduleId,doctorName,doctorTypeName,clinicDurationName,clinicDate,onDutyTime,clinicTypeName,appointments,amt,specialDiseasesName} = schedule;
					clinicDate = clinicDate? clinicDate:onDutyTime.split(" ")[0];
					let unusedBookNum = appointments?appointments.length:0;
					console.info(schedule);
					var ctn  = '普通';
					if(clinicTypeName == '专家门诊' )ctn = '专家';
					if(clinicTypeName == '普通门诊' )ctn = '普通';
					
					ctn = clinicTypeName;
					//if(index==1)specialDiseasesName="微创拔牙+颌面部血管瘤门诊"//测试
					if( !specialDiseasesName && deptCode == '39' ){
						specialDiseasesName = "肿瘤门诊";
					}
					specialDiseasesName =  specialDiseasesName.replace('）','').split('（')[0];
//					var sp = (<span style={{float:'right',marginTop:'0.8rem',fontSize: "2rem"}}>{specials[0]}</span>);
//					if(specials.length > 1){
//						sp = (<span style={{float:'right',fontSize: "1.5rem"}}>{specials[0]}<br/>{specials[1]+'门诊'}</span>);
//					}
					var specials =  specialDiseasesName.split('+');
					var sp = (<span style={{float:'right',marginTop:'0.8rem',fontSize: "2rem"}}>{specials[0]}</span>);
					if(specials.length > 1){
						sp = (<span style={{float:'right',fontSize: "1.5rem"}}>{specials[0]+'门诊'}<br/>{specials[1]}</span>);
					}
					return (
						<Col span = {8} key = {'schedule' + scheduleId} style = {{paddingRight: config.navBar.padding + 'rem', paddingTop: config.navBar.padding + 'rem'}} >
						<div className = {styles.arrangeItem}  onClick = {() => this.onSelectSchedule(schedule)} >
							<div className = {styles.doctor} >
								{sp}
								{doctorName}
								<font>&nbsp;{doctorTypeName}</font> 
							</div>
							<Row>
								<Col span = {4} className = {styles.info2} style = {{height:'100%',fontSize: '3rem',borderLeft: '0',backgroundColor: '#BC1E1E',color:'#ffffff'}} ><font>{ctn}</font></Col>
								<Col span = {9} className = {styles.info2} style = {{borderLeft: '0'}}>{clinicDurationName}<font>{clinicDate}</font></Col>
								<Col span = {6} className = {styles.info2} ><font>剩余</font>{unusedBookNum}</Col>
								<Col span = {5} className = {styles.info2} ><font>诊费</font><span style = {{color: '#BC1E1E'}} >{amt||'0'}</span></Col>
							</Row>
						</div>
						</Col>
					);
				})
			}
			{
				schedules.length<=0?(
					<div style = {{height: height + 'px', position: 'relative'}} >
		        		<Empty info = {(<span>暂无可选排班<br/><font style = {{fontSize: '2.5rem'}} >请重新选择查询条件进行查询</font></span>)} />
		        	</div>
				):null
			}
			</Row>
			{
				filteredSchedules.length > pageSize ? (
		        	<Row style = {{padding : config.navBar.padding + 'rem'}} >
			            <Col span = {8}><Button text = "上一页" disabled={start== 0} onClick = {this.prePage} /></Col>
			            <Col span = {8}>&nbsp;</Col>
			            <Col span = {8} ><Button text = "下一页" disabled={limit >= filteredSchedules.length } onClick = {this.nextPage} /></Col>
		            </Row>
	            ):null
	        }
			<Modal visible = {showDateModal} closable = {false} footer = {null} width = {this.weekWinWidth + 'px'} style = {{top: (this.modalWinTop-7)+ 'rem'}} >
				<div>
					<Week width = {this.weekWinWidth - 32} initDate = {date == 'all' ? null : date} onSelectDay = {this.onSelectDay} />
					<Button text = "全部日期" style = {{marginTop: '1rem'}} onClick = {this.onSelectDay} />
				</div>
			</Modal>
			<Modal visible = {showDoctorModal} closable = {false} footer = {null} width = {this.weekWinWidth + 'px'} style = {{top: this.modalWinTop + 'rem'}} >
				<SearchDoctor doctors ={doctors} onChoose={this.onSelectDoctor} />
			</Modal>
			<Modal visible = {showDayPeriodModal} closable = {false} footer = {null} style = {{top: this.modalWinTop + 'rem', padding: 0}} >
				<div className = {styles.dayPeriod} >
					<span onClick = {() => this.onSelectDayPeriod(null)} className = {durationName == null ? styles.selectedDayPeriod : ''} >所有</span>
					<span onClick = {() => this.onSelectDayPeriod('全天')} className = {durationName == '全天' ? styles.selectedDayPeriod : ''} >全天</span>
					<span onClick = {() => this.onSelectDayPeriod('上午')} className = {durationName == '上午' ? styles.selectedDayPeriod : ''} >上午</span>
					<span onClick = {() => this.onSelectDayPeriod('下午')} className = {durationName == '下午' ? styles.selectedDayPeriod : ''} >下午</span>
					<span onClick = {() => this.onSelectDayPeriod('晚班')} className = {durationName == '晚班' ? styles.selectedDayPeriod : ''} >晚班</span>
				</div>
			</Modal>
		</WorkSpace>
		);
  }
}
  

export default connect(({appoint}) => ({appoint}))(AppointSchedules);


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








