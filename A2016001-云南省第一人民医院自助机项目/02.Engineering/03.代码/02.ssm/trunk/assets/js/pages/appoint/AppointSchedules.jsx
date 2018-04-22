import React, { PropTypes } from 'react';
import {  Row, Col,  Icon, Modal,} from 'antd';
import moment               from 'moment';
import styles               from './AppointSchedules.css';

import Card from '../../components/Card.jsx';
import Button from '../../components/Button.jsx';
import ToolBar from '../../components/ToolBar.jsx';
import Week from '../../components/Week.jsx';
import Empty from '../../components/Empty.jsx';
import NavContainer from '../../components/NavContainer.jsx';

import baseUtil  from '../../utils/baseUtil.jsx';
import SearchDoctor from '../base/SearchDoctor.jsx';

const calendarIcon = './images/base/calendar.png';
const alltimeIcon = './images/base/alltime.png';
const searchIcon = './images/base/search.png';



class AppointSchedules extends React.Component {
	
	constructor (props) {
		super(props);
		this.onBack = this.onBack.bind(this);
		this.onHome = this.onHome.bind(this);
		this.loadScheduleList = this.loadScheduleList.bind(this);
		this.querySchedule = this.querySchedule.bind(this);
		this.showDatePicker      =  this.showDatePicker.bind(this);
		this.showDayPeriodPicker =  this.showDayPeriodPicker.bind(this);
		this.showDoctorPicker    =  this.showDoctorPicker.bind(this);
		this.onSelectDay         =  this.onSelectDay.bind(this);
		this.onSelectDoctor = this.onSelectDoctor.bind(this);
		this.nextPage         =  this.nextPage.bind(this);
		this.prePage         =  this.prePage.bind(this);
		
		window.ssmConfig = window.ssmConfig||{};
		var availableDaysLen =  window.ssmConfig['appointment.availableAppointDays'] || 14;
		var appointToday  = window.ssmConfig['appointment.appointToday'];
		if(this.appointToday !== false )var appointToday =  true;
		var startDate = moment().add(appointToday?0:1,'days').format('YYYY-MM-DD');
		var endDate = moment().add(availableDaysLen,'days').format('YYYY-MM-DD');
		//戒烟门诊特殊处理
		const { type  } = props.department;
		var specialDiseasesName = null;
		if('戒烟门诊' == type) specialDiseasesName ='戒烟门诊';
		//戒烟门诊特殊处理完毕
		
		this.state = {
			showDateModal : true, 
			showDayPeriodModal : false, 
			showDoctorModal : false,
			availableDaysLen,
			appointToday,
			startDate,
			endDate,
			
			schedules:[],
			filteredSchedules:[],
			doctors:[],
			
			query:{ 
				doctor:{},
				date:null, 
				durationName:null,
				specialDiseasesName,
			},
			
			pageNo:1,
			pageSize : 12
		}
	}
	componentDidMount () {
		this.loadScheduleList();
	}
	onBack(){
		if(this.props.onCancel)this.props.onCancel();
	}
	onHome(){
		baseUtil.goHome('appointSch'); 
	}
	loadScheduleList(){
		const { code,hisId,type } = this.props.department;
		const { startDate,endDate} = this.state;
		const query = {
			deptCode:code,
			deptId:hisId,
			deptType:type,
			startDate,
			endDate,
		}
		console.log('query',query);
		let fetch = Ajax.get("/api/ssm/treat/appointment/schedule/dept",query,{catch: 3600});
		fetch.then(res => {
			if(res && res.success){
				var schedules = res.result||[];
				var doctors = this.queryDoctors(schedules);
				this.setState({schedules,doctors});
			}else if( res && res.msg ){
				baseUtil.error(res.msg);
	    	}else{
	    		baseUtil.error("无法获取排班信息");
	    	}
		}).catch((ex) =>{
			baseUtil.error("获取排班信息异常");
		});
	}
	queryDoctors(schedules){
	  const doctors = [];
	  let map = {};
  	  for(var schedule of schedules){//抽取医生信息
  		if(!map[schedule.doctorCode]){
  			map[schedule.doctorCode] = true;
  			doctors.push({
  				code:schedule.doctorCode,
  				name:schedule.doctorName,
  				type:schedule.doctorType,
  				typeName:schedule.doctorTypeName,
  				pinyin:schedule.doctorPinyin,
  			});
  		}
  	  }
  	  return doctors;
	}
	querySchedule(schedules) {//前台查询
		const { query } = this.state;
		var filteredSchedules = schedules.filter(function(item){
			var result = true;
			if(query.doctor && query.doctor.code){
				result = result && item.doctorCode == query.doctor.code;
			}
			if(query.date){ 
				let clinicDate = item.clinicDate? item.clinicDate:item.onDutyTime.split(" ")[0];
				result = result && clinicDate == query.date;
			}
			if(query.durationName){
				result = result && item.clinicDurationName == query.durationName ;
			}
			if(query.specialDiseasesName) {
				result = result && item.specialDiseasesName == query.specialDiseasesName ;
			}
			return result; 
		});
		return filteredSchedules;
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
		const query = {...this.state.query,date};
		this.setState({showDateModal:false,pageNo:1,query});
	}
	onSelectDayPeriod(durationName){
		const query = {...this.state.query,durationName};
		this.setState({showDayPeriodModal:false,pageNo:1,query});
	}
	onSelectDoctor(doctor){
		const query = {...this.state.query,doctor};
		this.setState({showDoctorModal:false,pageNo:1,query});
	}
	onSelectSchedule(schedule){
	  if(this.props.onSelect)this.props.onSelect(schedule);
	}
	
	render () {
		const weekWinWidth = document.body.clientWidth - 36;
		const modalWinTop  = 18;
		const { 
			showDateModal,
			showDayPeriodModal, 
			showDoctorModal,
			query ,
			doctors,
			pageNo,
			pageSize,
		} = this.state;
		
		const { date, doctor ,durationName } = query;
		var filteredSchedules = this.querySchedule(this.state.schedules); 
		
		let start = pageSize * (pageNo-1);
		let limit = pageSize * pageNo;
		
		const schedules = filteredSchedules.slice(start,limit); 
		
		const dateText        =  date      ?  moment(date).format('Y年M月D日'):'全部日期';
		const durationText    =  durationName ? durationName : '所有';
		const doctorText      =  doctor&&doctor.name ? doctor.name : '全部医生';
		
		let iconStyle = { color: '#5D5D5D',  }
		let height = document.body.clientHeight - 138;
		const dayPeriod = null;
		return (
		<NavContainer  title='排班列表' onBack={this.onBack} onHome={this.onHome}  >
			<ToolBar style = {{paddingTop: '10px'}} >
			<Row>
				<Col span = {8} className = 'appoint_sch_toolBarItem' style = {{paddingRight: '.5rem'}} >
					<Card onClick = {this.showDatePicker} ><img src = {calendarIcon} />{dateText} </Card>
				</Col>
				<Col span = {8} className = 'appoint_sch_toolBarItem' style = {{paddingRight: '.5rem', paddingLeft: '.5rem'}} >
					<Card onClick = {this.showDayPeriodPicker} ><img src = {alltimeIcon} />{durationText}</Card>
				</Col>
				<Col span = {8} className = 'appoint_sch_toolBarItem' style = {{paddingLeft: '.5rem'}} >
					<Card onClick = {this.showDoctorPicker} ><img src = {searchIcon} />{doctorText}</Card>
				</Col>
			</Row>
			</ToolBar>
			<Row style = {{height: (height-230) + 'px'}} >
			{
				schedules.map((schedule, index) => {
					let {deptCode,scheduleId,doctorName,doctorTypeName,deptName,clinicDurationName,clinicDate,onDutyTime,clinicTypeName,appointments,amt,specialDiseasesName} = schedule;
					console.log('schedule',schedule);
					clinicDate = clinicDate? clinicDate:onDutyTime.split(" ")[0];
					let unusedBookNum = appointments?appointments.length:0;
					var ctn  = '普通';
//					if(clinicTypeName == '专家门诊' )ctn = '专家';
//					if(clinicTypeName == '普通门诊' )ctn = '普通';
					
					ctn = clinicTypeName;
					//if(index==1)specialDiseasesName="微创拔牙+颌面部血管瘤门诊"//测试
					if( !specialDiseasesName && deptCode == '39' ){
						specialDiseasesName = "肿瘤门诊";
					}
					var specialDiseases =  specialDiseasesName.replace(')','').split('(');
					var name = specialDiseasesName?specialDiseasesName:deptName;
					var sp = (<span style={{float:'right',marginTop:'0.8rem',fontSize: "2rem"}}>{name}</span>);
					var specials =  specialDiseasesName.split('+');
					if(specialDiseases.length > 1){
						sp = (<span style={{float:'right'}}>{specialDiseases[0]}<br/>{specialDiseases[1]}</span>);
					} 
					if(specials.length == 2){
						sp = (<span style={{float:'right'}}>{specials[0]}<br/>{specials[1]}</span>);
					} else if(specials.length == 3){
						sp = (<span style={{float:'right'}}>{specials[0] + "/"+ specials[1]}<br/>{specials[2]}</span>);
					} else if(specials.length == 4){
						sp = (<span style={{float:'right'}}>{specials[0] + "/"+ specials[1]}<br/>{specials[2]+ "/" + specials[3]}</span>);
					} else if(specials.length > 4){
						sp = (<span style={{float:'right'}}>{specials[0] + "/"+ specials[1]}<br/>{specials[2]+ "/..." }</span>);
					}
					if(doctorName && doctorName.indexOf("门诊") != -1){
						sp = (<span style={{float:'right'}}></span>);
					}
						
//					var specials =  specialDiseasesName.split('+');
//					var name = specialDiseasesName?specialDiseasesName:deptName;
//					var sp = (<span style={{float:'right',marginTop:'0.8rem',fontSize: "2rem"}}>{name}</span>);
//					if(specials.length > 1){
//						var _special = specials[0]
//						sp = (<span style={{float:'right',fontSize: "1.5rem"}}>{name+'门诊'}<br/>{specials[1]}</span>);
//					}
					var dayStyle = (moment().format('YYYY-MM-DD') == clinicDate)?'appoint_sch_today':'appoint_sch_notoday';
					if(unusedBookNum <=0 )dayStyle = 'appoint_sch_none';
					return (
						<Col span = {8} key = {index} style = {{paddingRight: '1.5rem', paddingTop: '1.5rem'}} >
						<div className = 'appoint_sch_arrangeItem'  onClick = {() => this.onSelectSchedule(schedule)} >
							<div className = {'appoint_sch_doctor '+dayStyle} >
								{sp}
								{doctorName}
								<font>&nbsp;{doctorTypeName}</font> 
							</div>
							<Row>
								<Col span = {4} className = {'appoint_sch_info2 '+dayStyle} style = {{paddingTop: '1.0rem', paddingBottom: '1.0rem',fontSize: '3rem',borderLeft: '0',color:'#ffffff'}} ><font>{ctn}</font></Col>
								<Col span = {9} className = 'appoint_sch_info2' style = {{borderLeft: '0'}}>{clinicDurationName}<font>{clinicDate}</font></Col>
								<Col span = {6} className = 'appoint_sch_info2' ><font>剩余</font>{unusedBookNum}</Col>
								<Col span = {5} className = 'appoint_sch_info2' ><font>诊费</font><span style = {{color: '#BC1E1E'}} >{amt||'0'}</span></Col>
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
		        	<Row style = {{padding : '1.5rem'}} >
			            <Col span = {8}><Button text = "上一页" disabled={start== 0} onClick = {this.prePage} /></Col>
			            <Col span = {8}>&nbsp;</Col>
			            <Col span = {8} ><Button text = "下一页" disabled={limit >= filteredSchedules.length } onClick = {this.nextPage} /></Col>
		            </Row>
	            ):null
	        }
			<Modal visible = {showDoctorModal} closable = {false} footer = {null} width = {weekWinWidth + 'px'} style = {{top: this.modalWinTop + 'rem'}} >
				<SearchDoctor doctors ={doctors} onChoose={this.onSelectDoctor} />
			</Modal>
			<Modal visible = {showDateModal} closable = {false} footer = {null} width = {weekWinWidth + 'px'} style = {{top: (this.modalWinTop-7)+ 'rem'}} >
				<div>
					<Week width = {weekWinWidth - 32} initDate = {date == 'all' ? null : date} onSelectDay = {this.onSelectDay} />
					<Button text = "全部日期" style = {{marginTop: '1rem'}} onClick = {this.onSelectDay} />
				</div>
			</Modal>
			<Modal visible = {showDayPeriodModal} closable = {false} footer = {null} style = {{top: this.modalWinTop + 'rem', padding: 0}} >
				<div className = 'appoint_sch_dayPeriod' >
					<span onClick = {() => this.onSelectDayPeriod(null)} className = {durationName == null ? 'appoint_sch_selectedDayPeriod' : ''} >所有</span>
					<span onClick = {() => this.onSelectDayPeriod('全天')} className = {durationName == '全天' ? 'appoint_sch_selectedDayPeriod' : ''} >全天</span>
					<span onClick = {() => this.onSelectDayPeriod('上午')} className = {durationName == '上午' ? 'appoint_sch_selectedDayPeriod' : ''} >上午</span>
					<span onClick = {() => this.onSelectDayPeriod('下午')} className = {durationName == '下午' ? 'appoint_sch_selectedDayPeriod' : ''} >下午</span>
					<span onClick = {() => this.onSelectDayPeriod('晚班')} className = {durationName == '晚班' ? 'appoint_sch_selectedDayPeriod' : ''} >晚班</span>
				</div>
			</Modal>
		</NavContainer>
		);
  }
}
module.exports = AppointSchedules;