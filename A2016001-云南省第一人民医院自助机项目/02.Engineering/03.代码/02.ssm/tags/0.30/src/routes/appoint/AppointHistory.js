import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Row, Col ,Modal}         from 'antd';
import moment               from 'moment';
import config               from '../../config';
import styles               from './AppointHistory.css';
import listStyles           from '../../components/List.css';

import WorkSpace            from '../../components/WorkSpace';
import Card                 from '../../components/Card';
import Button               from '../../components/Button';
import BackTimer            from '../../components/BackTimer';
import Empty                from '../../components/Empty';
import Confirm              from '../../components/Confirm';

class AppointHistory extends React.Component {

  constructor(props) {
    super(props);
    this.renderItems    = this.renderItems.bind(this);
    
    this.showSignConfirm  = this.showSignConfirm.bind(this);
    this.closeSignConfirm  = this.closeSignConfirm.bind(this);
    
    this.showCancelConfirm  = this.showCancelConfirm.bind(this);
    this.closeCancelConfirm  = this.closeCancelConfirm.bind(this);
    
    this.showConfirm = this.showConfirm.bind(this);
    
    this.doCancel  = this.doCancel.bind(this);
    this.doSign  = this.doSign.bind(this);
    
    this.nextPage = this.nextPage.bind(this);
    this.prePage = this.prePage.bind(this);
  }
  
  state = { 
	  pageNo:1,
	  pageSize : 7,
	  signAppoint:null,
	  cancelAppoint:null,
	  showConfirm:false,
	  showWarning:false,
	  warnInfo:'',
	  confirmInfo:'',
  };
  
  status = { '0':'预留','1':'预约','2':'等待','3':'已呼叫','4':'已刷卡','5':'完成','9':'放弃','Z':'已过期' };
  
  componentDidMount () {
    if(!this.props.patient.baseInfo.no)return;
    this.props.dispatch({
      type: 'appoint/loadAppointHistory',
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
	const { cancelAppoint } = this.state;
	this.setState({cancelAppoint:null},()=>{
		this.props.dispatch({
	      type: 'appoint/appointCancel',
	      payload: {
	        appointment: cancelAppoint,
	      }
	    });
	});
  }
  doSign(){
    const { signAppoint } = this.state;
	this.setState({signAppoint:null},()=>{
		this.props.dispatch({
	      type: 'appoint/appointSign',
	      payload: {
	        appointment: signAppoint,
	      }
	    });
	});  
  }
  showConfirm(info){
	  info=info||"操作"
	  this.setState({ showConfirm : true,confirmInfo:info,});
  }
  render() {
    const { history } = this.props.appoint;
    const { pageNo,pageSize} = this.state;
	let start = pageSize*(pageNo-1);
    let limit = pageSize*pageNo;
    
    return (
      (!history || history.length <= 0 ) ? ( <Empty info = '暂无预约记录' /> ):(
        <WorkSpace fullScreen = {true} style = {{paddingTop: '2rem'}} >
          <Row>
            <Col span = {4} className = {listStyles.title} >预约时间</Col>
            <Col span = {3} className = {listStyles.title + ' ' + listStyles.center} >就诊序号</Col>
            <Col span = {5} className = {listStyles.title} >预约科室</Col>
            <Col span = {4} className = {listStyles.title} >预约医生</Col>
            <Col span = {2} className = {listStyles.title + ' ' + listStyles.center} >状态</Col>
            <Col span = {3} className = {listStyles.title + ' ' + listStyles.center} >取消</Col>
            <Col span = {3} className = {listStyles.title + ' ' + listStyles.center} >签到</Col>
          </Row>
          <Card radius = {false} className = {styles.rows} >
            {this.renderItems()}
          </Card>
          {
        	history.length > pageSize ? (
	        	<Row style = {{padding : config.navBar.padding + 'rem'}} >
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
         </WorkSpace>
      )
    );
  }

  renderItems () {
	const scope =this;
	const { history } = this.props.appoint;
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
        <div key = {index} className = {styles.row} >
          <Row type="flex" align="middle" style = {rowStyle} >
            <Col span = {4} className = {listStyles.item} >
              {moment(row.appointmentTime).format('Y年M月D日')}<br/> {row.clinicDurationName}&nbsp;{moment(row.appointmentTime).format('HH:mm:SS')}
            </Col>
            <Col span = {3} className = {listStyles.item + ' ' + listStyles.center} >
              {row.appointmentNo}
            </Col>
	        <Col span = {5} className = {listStyles.item} >
	          {row.deptName}
	        </Col>
	        <Col span = {4} className = {listStyles.item} >
	          {row.doctorName}<br/><font style = {{fontSize: '1.8rem'}} >{row.doctorTypeName}</font>
	        </Col>
            <Col span = {2} className = {listStyles.item + ' ' + listStyles.center + ' ' + listStyles.nowrap} >
              {scope.status[row.appointmentState]||''}
            </Col>
            <Col span = {3} className = {listStyles.item + ' ' + listStyles.center} >
            	<Button text = "取消" disabled ={!canCancle} style = {{fontSize: '2.5rem'}} onClick = {() => scope.showCancelConfirm(row)} />
            </Col>
            <Col span = {3} className = {listStyles.item + ' ' + listStyles.center} >
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
	      <div style = {{padding: config.navBar.padding + 'rem'}} >
	        <Card style = {{padding: '2rem'}} >
	          <Row>
	            <Col span = {8} className = {styles.label} >预约科室：</Col>
	            <Col span = {16} className = {styles.text} >{appointment.deptName}</Col>
	          </Row>
	          <Row>
	            <Col span = {8} className = {styles.label} >预约医生：</Col>
	            <Col span = {16} className = {styles.text} >{appointment.doctorName}</Col>
	          </Row>
	          <Row>
	            <Col span = {8} className = {styles.label} >预约时间：</Col>
	            <Col span = {16} className = {styles.text} >
	              {moment(appointment.appointmentTime).format('Y年M月D日')}&nbsp;
	              {appointment.clinicDurationName}&nbsp;
	              {moment(appointment.appointmentTime).format('HH:mm:SS')}
	            </Col>
	          </Row>
	          <Row>
	            <Col span = {8} className = {styles.label} >就诊序号：</Col>
	            <Col span = {16} className = {styles.text} ><font>{appointment.appointmentNo}</font></Col>
	          </Row>
	          <Row>
	            <Col span = {8} className = {styles.label} >就诊地址：</Col>
	            <Col span = {16} className = {styles.text} >{appointment.hospitalDistrictName}</Col>
	          </Row>
	          <Row>
	            <Col span = {8} className = {styles.label} >挂号费：</Col>
	            <Col span = {16} className = {styles.text} ><font>{appointment.amt||0}</font>&nbsp;元</Col>
	          </Row>
	          {/*<Button text = '确定' style = {btnStyle} onClick = {this.ok} />*/}
	        </Card>
	      </div>
	    );
	  }
}
  

export default connect(({appoint,patient}) => ({appoint,patient}))(AppointHistory);