import React,{ Component } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Card,Row,Col,Modal } from 'antd';
import WorkSpace from '../../components/WorkSpace';
import styles from './Step1.css';
import idcard from '../../assets/guide/idcard-read.gif';
import siCard from '../../assets/guide/si-card-read.gif';
import Confirm from '../../components/Confirm';
import config from '../../config';
import MiType from '../../components/MiType';
class Step1 extends Component {
  constructor (props) {
    super(props);
    this.next = this.next.bind(this);
    this.checkPatientExist = this.checkPatientExist.bind(this);
    this.showMiConfirm = this.showMiConfirm.bind(this);
    this.onSelectMiType  = this.onSelectMiType.bind(this);
    this.readMiCard  = this.readMiCard.bind(this);
  }
  state = {showConfirm: false,showMiConfirm:false,} ; 
  componentDidMount() {
	const { idCardInfo } = this.props.patient;
	const { miCardInfo } = this.props.patient;
	if(miCardInfo.state == 'in' ){//插入社保卡
  		this.showMiConfirm();
  		return;
  	}
	if(idCardInfo.username  ){
		var profile = this.buildProfileById(idCardInfo);
		this.checkPatientExist(profile);
		return;
	}
	if(miCardInfo.knsj  ){
		var profile = this.buildProfileByMi(miCardInfo);
		this.checkPatientExist(profile);
		return;
	}
    this.props.dispatch({
      type: 'patient/listenMiOrIdCard',
    });   
  }
  componentWillReceiveProps(nextProps){
  	const { idCardInfo:oldId } = this.props.patient;
  	const { idCardInfo:nowId } = nextProps.patient;
  	const { miCardInfo:oldMi } = this.props.patient;
  	const { miCardInfo:nowMi } = nextProps.patient;
  	if( oldMi.state != 'in'  && nowMi.state == 'in' ){//插入社保卡
  		this.showMiConfirm();
  		return;
  	}
	if(!oldId.userName && nowId.userName ) {
		var profile = this.buildProfileById(nowId);
		this.checkPatientExist(profile);
		return;
	}
	if(!oldMi.knsj && nowMi.knsj ){
		var profile = this.buildProfileByMi(nowMi);
		this.checkPatientExist(profile);
		return;
	}
  }
  buildProfileByMi(miCardInfo){
	  console.info("根据社保卡构建档案信息",miCardInfo);
	  const { knsj, grbh, xm, xb, csrq, sfzh, cbsf, age, ye, bz, dw, rqlb} = miCardInfo;
	  var gender = '3';
	  if('男' == xb)gender = '1';
	  if('女' == xb)gender = '2';
	  const profile={
		  name:xm,gender:gender,idNo:sfzh,birthday:csrq,
		  address:dw, unitCode:'0000', medicalCardNo:'', miCardNo:knsj , opentype:'1'
	  };
	  return profile;
  }
  buildProfileById(idCardInfo){
	console.info("根据身份证构建档案信息",idCardInfo);
	const {userName, sex, nation,birthday} = idCardInfo;
	const {address,idNo,issuer,effectiveDate} = idCardInfo;
	var gender = '3';
	if('男' == sex)gender = '1';
	if('女' == sex)gender = '2';
	const profile={
	  name:userName,gender:gender,idNo:idNo,birthday:birthday,
	  address:address,unitCode:'0000',medicalCardNo:'',opentype:'1'
    };
	return profile;
  }
  checkPatientExist(profile){
	var closeDivice = 'miCard';
	if(profile.miCardNo) closeDivice = 'idCard'; 
	console.info('读取外设完毕，关闭无用的设备：', closeDivice);
	this.props.dispatch({
		 type: 'patient/closeDevice',
		 payload:{device:closeDivice}
	});
	this.props.dispatch({
		type: 'patient/loadPatientInfo',
		payload:{patient:profile},
		callback:(p)=>{
			console.info("Step1.loadPatientInfo", p)
		  if(p.no && p.medicalCardNo != p.no ){//卡号已经存在
			 console.info('卡号已经存在 医保编号：',p.miPatientNo);
			 this.next();
		  }else{
			 console.info('卡号不存在');
			 this.showConfirm();
		  }
		}
	});
  }
  showConfirm(){
	  this.setState({showConfirm:true});
  }
  showMiConfirm(){
	  this.setState({showMiConfirm:true});
  }
  onSelectMiType(type){
	  this.setState({  showMiConfirm:false },()=>{
		  setTimeout(
				 ()=>{ this.readMiCard(type)}
		  ,500 )
	  })
  }
  readMiCard(type){
	  this.props.dispatch({
		  type: 'patient/readMiCard',
		  payload:{type:type.code}
	  });
  }
  next(){
    if(this.props.onNext)this.props.onNext();
  }
  render () {
	  var  careerWidth = config.getWS().width - config.navBar.padding * 2 * config.remSize;
		var  modalWinTop  = config.navBar.height + config.navBar.padding * 2 + 5;
    return (
    	<WorkSpace width = '100%' height = '50rem' >
    		<div className = {styles.guideTextContainer} >
    			<font className = {styles.guideText} >请放置您的身份证或插入社保卡</font>
    		</div>
			<Row>
			 <Col span={4}></Col>
		      <Col span={8}>
		      	<div style = {{height: '30rem', width: '30rem', margin: '3rem auto'}} >
	      			<img alt = "" src = {idcard} className = {styles.guidePic} />
	      		</div>
		      </Col>
		      <Col span={8}>
		      	<div style = {{height: '30rem', width: '30rem', margin: '3rem auto',backgroundColor:'#f5f5f5'}} >
	      		  <img alt = "" src = {siCard} className = {styles.guidePic} />
	      		</div>
		      </Col>
		      <Col span={4}></Col>
	        </Row>
	        <Modal visible = {this.state.showMiConfirm} closable = {false} footer = {null} width = {(careerWidth/2) + 'px'} style = {{top: (modalWinTop+8) + 'rem'}} >
			  <div style = {{margin: '-16px'}}>
			 	  <MiType width = {careerWidth/2} onSelectMiType={this.onSelectMiType} />
			  </div>
			 </Modal>
    		<Confirm info = '您还未办理过就诊卡，请到"办理就诊卡"菜单进行操作!' visible = {this.state.showConfirm} 
                buttons = {[{text: '确定', onClick: () =>{
               	 this.setState({showConfirm: false});
               	 this.props.dispatch(routerRedux.push('/homepage'));
                }},]}
               />
    	</WorkSpace>
    );	
  }
}  

export default  connect(({patient}) => ({patient}))(Step1);