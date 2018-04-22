import React, { PropTypes } from 'react';
import { Row, Col ,Modal} from 'antd';
import moment from 'moment';
import styles from './AppointHistory.css';
import listStyles from '../../components/List.css';
import Card from '../../components/Card.jsx';
import Button from '../../components/Button.jsx';
import Empty from '../../components/Empty.jsx';
import Confirm from '../../components/Confirm.jsx';
import NavContainer from '../../components/NavContainer.jsx';

import printUtil from '../../utils/printUtil.jsx';
import baseUtil from '../../utils/baseUtil.jsx';


class AppointHistory extends React.Component {

  constructor(props) {
    super(props);
    this.onBack = this.onBack.bind(this);
	this.onHome = this.onHome.bind(this);
	
    this.loadHistory = this.loadHistory.bind(this);
    this.renderItems    = this.renderItems.bind(this);
    
    this.showSignConfirm  = this.showSignConfirm.bind(this);
    this.closeSignConfirm  = this.closeSignConfirm.bind(this);
    
    this.showCancelConfirm  = this.showCancelConfirm.bind(this);
    this.closeCancelConfirm  = this.closeCancelConfirm.bind(this);
    
    this.showConfirm = this.showConfirm.bind(this);
    
    this.doCancel  = this.doCancel.bind(this);
    this.requestCancel = this.requestCancel.bind(this);
    this.doSign  = this.doSign.bind(this);
    this.requestSign = this.requestSign.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.prePage = this.prePage.bind(this);
    
    var limit  = baseUtil.getSysConfig('appoint.balance.limit',10);
    
    this.state = { 
	  pageNo:1,
	  limit,
	  pageSize : 7,
	  signAppoint:null,
	  cancelAppoint:null,
	  showConfirm:false,
	  showWarning:false,
	  warnInfo:'',
	  confirmInfo:'',
	  history:[],
    };
    this.status = { '0':'预留','1':'预约','2':'等待','3':'已呼叫','4':'已刷卡','5':'完成','9':'放弃','Z':'已过期' };
  }
  
  componentDidMount () {
    this.loadHistory();
  }
  onBack(){
	baseUtil.goHome('appointHis'); 
  }
  onHome(){
	baseUtil.goHome('appointHis'); 
  }
  loadHistory(){
	var patient = baseUtil.getCurrentPatient();
    if(!patient.no)return;
	var query= {
	  patientName:patient.name,
	  patientNo:patient.no,
	  patientPhone:patient.mobile||"",
   	  appointmentTime:moment().format('YYYY-MM-DD'),
	}
	let fetch = Ajax.get("/api/ssm/treat/appointment/appointment/list",query,{catch: 3600});
	fetch.then(res => {
		if(res && res.success){
			var history = res.result||[]
			this.setState({history});
		}else if( res && res.msg ){
			baseUtil.error(res.msg);
    	}else{
    		baseUtil.error("查询预约记录失败");
    	}
	}).catch((ex) =>{
		baseUtil.error("查询预约记录异常");
	});
  }
  nextPage(){
	  const { pageNo } =this.state;
	  this.setState({pageNo:pageNo+1});
  }
  prePage(){
	  const { pageNo } =this.state;
	  this.setState({pageNo:pageNo-1});
  }
  showSignConfirm (appoint) {
	  var patient = baseUtil.getCurrentPatient();
	  const { limit } = this.state;
	  if(patient.balance < limit ){
		baseUtil.error('为了不影响您就医过程中扣除您的挂号费用，请至少保证您的卡内余额大于'+limit+'元');
		return null;
	  }
	  var noon =  moment(moment().format('YYYY-MM-DD')+' 12:00:00').toDate();
	  var now  = new Date();
	  var appTime = moment(appoint.appointmentTime).toDate();
	  if(now.getTime() - noon.getTime()<=0 && appTime.getTime() - noon.getTime()>0){
		  this.setState({warnInfo : "上午不能签到下午的号,请下午再来！",showWarning:true });
		  return false;
	  }
	  if( (new Date()).getTime() - moment(appoint.appointmentTime).toDate().getTime() > 15*60*1000 ){//晚于时间一小时
		 this.setState({warnInfo : "您已迟到超过15分钟，请自行到"+appoint.deptName+"科分诊台处理",showWarning:true });
	  } else{
		 this.setState({signAppoint : appoint });
	  }
  }
  showCancelConfirm (appoint) {
    this.setState({cancelAppoint : appoint });
  }
  closeSignConfirm () {
    this.setState({signAppoint : null });
  }
  closeCancelConfirm () {
    this.setState({cancelAppoint : null });
  }
  doCancel(){
	  if(this.cancelFlag)return;//防止重复提交 
	  this.cancelFlag = true;
	  const { cancelAppoint } = this.state;
	  this.setState({cancelAppoint:null},()=>{
		  this.requestCancel(cancelAppoint);
	  });
  }
  requestCancel(appoint){
	let fetch = Ajax.post("/api/ssm/treat/appointment/cancel",appoint,{catch: 3600});
	fetch.then(res => {
		if(res && res.success){
			//this.loadHistory();
			baseUtil.error("取消成功");
		}else if( res && res.msg ){
			baseUtil.error(res.msg);
    	}else{
    		baseUtil.error("取消预约失败");
    	}
	}).catch((ex) =>{
		baseUtil.error("取消预约异常");
	});  
  }
  doSign(){
	  if(this.signFlag)return;//防止重复提交 
	  this.signFlag = true;
	  const { signAppoint } = this.state;
	  this.setState({signAppoint:null},()=>{
		  this.requestSign(signAppoint);
	  });
  }
  requestSign(appointment){
    const patient = baseUtil.getCurrentPatient();
    const appoint = {	...appointment,	patientNo:patient.no,cardNo:"",};
    let fetch = Ajax.post("/api/ssm/treat/appointment/sign",appoint,{catch: 3600});
	fetch.then(res => {
		if(res && res.success){
					//打印签到凭条
		  var result = res.result		
		  var newAppoint = {
		   	  ...appoint,
		   	  appointmentInfo : result.appointmentInfo,
		   	  patientName : result.patientName,
		   	  appointmentDate : result.appointmentDate,
		   	  deptName : result.deptName,
		   	  scheduleDeptName : result.scheduleDeptName,
		   	  clinicHouse : result.clinicHouse,
		   	  houseLocation : result.houseLocation,
		   	  hospitalDistrictName : result.hospitalDistrictName
		  }
		  try{
			printUtil.printSign(newAppoint);
		  }catch(e){
			baseUtil.notice("打印机异常，此异常不影响您的签到");
		  }
		  // this.loadHistory();
		  baseUtil.error("签到成功");
		}else if( res && res.msg ){
			baseUtil.error(res.msg);
    	}else{
    		baseUtil.error("预约签到失败");
    	}
	}).catch((ex) =>{
		baseUtil.error("预约签到异常");
	});
  }
  showConfirm(info){
	  info=info||"操作"
	  this.setState({ showConfirm : true,confirmInfo:info,});
  }
  render() {
    var patient = baseUtil.getCurrentPatient();
    if(!patient.no)return null;
    
    const { pageNo,pageSize,history} = this.state;
	let start = pageSize*(pageNo-1);
    let limit = pageSize*pageNo;
    
    return (
      (!history || history.length <= 0 ) ? ( 
		  <NavContainer  title='预约记录' onBack={this.onBack} onHome={this.onHome} >
		  	<Empty info = '暂无预约记录' />
		  </NavContainer>  
      ):(
      <NavContainer  title='预约记录' onBack={this.onBack} onHome={this.onHome} >
          <Row>
            <Col span = {4} className = 'list_title' >预约时间</Col>
            <Col span = {3} className = 'list_title list_center' >就诊序号</Col>
            <Col span = {5} className = 'list_title' >预约科室</Col>
            <Col span = {4} className = 'list_title' >预约医生</Col>
            <Col span = {2} className = 'list_title list_center' >状态</Col>
            <Col span = {3} className = 'list_title list_center' >取消</Col>
            <Col span = {3} className = 'list_title list_center' >签到</Col>
          </Row>
          <Card radius = {false} className = 'appoint_his_rows' >
            {this.renderItems(history)}
          </Card>
          {
        	history.length > pageSize ? (
	        	<Row style = {{padding : '1.5rem'}} >
		            <Col span = {8}><Button text = "上一页" disabled={start== 0} onClick = {this.prePage} /></Col>
		            <Col span = {8}>&nbsp;</Col>
		            <Col span = {8} ><Button text = "下一页" disabled={limit >= history.length } onClick = {this.nextPage} /></Col>
	            </Row>
            ):null
          }
          <Confirm   visible = {this.state.cancelAppoint?true:false} 
            buttons = {[
              {text: '暂不取消', outline: true, onClick: this.closeCancelConfirm},
              {text: '确定', onClick: this.doCancel},
            ]}
            info = {'您确定要取消预约吗？'} />
          <Confirm   visible = {this.state.signAppoint?true:false} 
	          buttons = {[
	            {text: '暂不签到', outline: true, onClick: this.closeSignConfirm},
	            {text: '确定', onClick: this.doSign},
	          ]}
          info = {this.renderSignConfirm(this.state.signAppoint||{})} />
          <Confirm info = {this.state.confirmInfo} visible = {this.state.showConfirm} 
            buttons = {[{text: '确定', onClick: () => this.setState({showConfirm: false}) },]}
          />
          <Confirm info = {this.state.warnInfo} visible = {this.state.showWarning} 
          	buttons = {[{text: '确定', onClick: () => this.setState({showWarning: false}) },]}
          />
         </NavContainer>
      )
    );
  }

  renderItems (history) {
	const scope =this;
	const { pageNo,pageSize} = this.state;
	let start = pageSize*(pageNo-1);
    let limit = pageSize*pageNo;
    const appoints = history.slice(start,limit); 
    
	const rowStyle = {color: '#999999'} ;//: {};
	
	
    return appoints.map (function(row,index){
    	const isToday = moment(row.appointmentTime).format('YYYYMMDD') == moment().format('YYYYMMDD');
    	const canCancle = row.appointmentState == '1' || row.appointmentState == '2' ;
    	const canSign = row.appointmentState == '1'|| row.appointmentState == 'Z';
      return (
        <div key = {index} className = 'appoint_his_row' >
          <Row type="flex" align="middle" style = {rowStyle} >
            <Col span = {4} className = 'list_item' >
              {moment(row.appointmentTime).format('Y年M月D日')}<br/> {row.clinicDurationName}&nbsp;{moment(row.appointmentTime).format('HH:mm:SS')}
            </Col>
            <Col span = {3} className = 'list_item list_center' >
              {row.appointmentNo}
            </Col>
	        <Col span = {5} className = 'list_item' >
	          {row.deptName}
	        </Col>
	        <Col span = {4} className = 'list_item' >
	          {row.doctorName}<br/><font style = {{fontSize: '1.8rem'}} >{row.doctorTypeName}</font>
	        </Col>
            <Col span = {2} className = 'list_item list_center list_nowrap' >
              {scope.status[row.appointmentState]||''}
            </Col>
            <Col span = {3} className = 'list_item list_center' >
            	<Button text = "取消" disabled ={!canCancle} style = {{fontSize: '2.5rem'}} onClick = {() => scope.showCancelConfirm(row)} />
            </Col>
            <Col span = {3} className = 'list_item list_center' >
            {
      			canSign && isToday?(
      				<Button text = "签到" style = {{fontSize: '2.5rem'}} onClick = {() => scope.showSignConfirm(row)} />	
      			):null
      		}
      		{
      			canSign && !isToday?(
      				<Button text = "非本日" disabled={true} style = {{fontSize: '2.5rem'}} />	
      			):null
      		}
      		{
      			!canSign ?(
      				<Button text = {scope.status[row.appointmentState]||''} disabled={true} style = {{fontSize: '2.5rem'}} />	
      			):null
      		}
            </Col>
          </Row>
    	</div>
      )
    });
  }
  renderSignConfirm(appointment) {
	    let btnStyle = {marginTop: '2rem', /*width: '56rem',*/};
	    return (
	      <div style = {{padding:  '1.5rem'}} >
	        <Card style = {{padding: '2rem'}} >
	          <Row>
	            <Col span = {8} className = 'appoint_his_label' >预约科室：</Col>
	            <Col span = {16} className = 'appoint_his_text' >{appointment.deptName}</Col>
	          </Row>
	          <Row>
	            <Col span = {8} className = 'appoint_his_label' >预约医生：</Col>
	            <Col span = {16} className = 'appoint_his_text' >{appointment.doctorName}</Col>
	          </Row>
	          <Row>
	            <Col span = {8} className = 'appoint_his_label' >预约时间：</Col>
	            <Col span = {16} className = 'appoint_his_text' >
	              {moment(appointment.appointmentTime).format('Y年M月D日')}&nbsp;
	              {appointment.clinicDurationName}&nbsp;
	              {moment(appointment.appointmentTime).format('HH:mm:SS')}
	            </Col>
	          </Row>
	          <Row>
	            <Col span = {8} className = 'appoint_his_label' >就诊序号：</Col>
	            <Col span = {16} className = 'appoint_his_text' ><font>{appointment.appointmentNo}</font></Col>
	          </Row>
	          <Row>
	            <Col span = {8} className = 'appoint_his_label' >就诊地址：</Col>
	            <Col span = {16} className = 'appoint_his_text' >{appointment.hospitalDistrictName}</Col>
	          </Row>
	          <Row>
	            <Col span = {8} className = 'appoint_his_label' >挂号费：</Col>
	            <Col span = {16} className = 'appoint_his_text' ><font>{appointment.amt||0}</font>&nbsp;元</Col>
	          </Row>
	          {/*<Button text = '确定' style = {btnStyle} onClick = {this.ok} />*/}
	        </Card>
	      </div>
	    );
	  }
}
module.exports = AppointHistory;