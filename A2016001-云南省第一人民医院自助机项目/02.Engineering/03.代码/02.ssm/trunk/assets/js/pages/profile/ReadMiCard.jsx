"use strict";

import { Component, PropTypes } from 'react';
import baseUtil from '../../utils/baseUtil.jsx';
import logUtil,{ log } from '../../utils/logUtil.jsx';
import miCardUtil from '../../utils/miCardUtil.jsx';
import { Row, Col,  Modal, Icon }    from 'antd';
import styls from './ReadMiCard.css';
import NavContainer from '../../components/NavContainer.jsx';
import Career from '../../components/Career.jsx';
import Steps from '../../components/Steps.jsx';
import MiType from '../../components/MiType.jsx';
class Page extends Component {
	constructor (props) {
		super(props);
		this.startMiCard = this.startMiCard.bind(this);
		this.onMiCardPushed = this.onMiCardPushed.bind(this);
		this.onSelectMiType = this.onSelectMiType.bind(this);
		this.buildProfileByMi = this.buildProfileByMi.bind(this);
		this.loadPatientInfo = this.loadPatientInfo.bind(this);
		this.afterMiCardRead = this.afterMiCardRead.bind(this);
		this.onSelectCareer = this.onSelectCareer.bind(this);
		
		this.issue = this.issue.bind(this);
		this.reIssue = this.reIssue.bind(this);
		
		this.state = {
		  showCareerModal:false,
		  showMiConfirm:false,
		  steps : ['读取医保卡', '校验手机号', '收费','发卡'],
		  profile:{},
		}
	}
	componentDidMount () {
		baseUtil.speak('card_pushMiCard');// 播放语音：请插入您的医保卡
		this.startMiCard();//开启就诊卡监听
	}
	startMiCard(){
		miCardUtil.listenCard(this.onMiCardPushed);
	}
	onMiCardPushed(){
		this.setState({showMiConfirm:true});
	}
	onSelectMiType(type){
		log('mi建档-选择医保卡类型 ',type);
		this.setState({  showMiConfirm:false },()=>{
			setTimeout(()=>{ 
				this.readMiCard(type.code)
			},300 )
		})
	}
	readMiCard(type){
		var machine = baseUtil.getMachineInfo();
		var miCardInfo = miCardUtil.readCard( type , machine.hisUser );
		if(miCardInfo && miCardInfo.knsj){
			var profile = this.buildProfileByMi(miCardInfo);
			this.loadPatientInfo(profile)	
		}
	}
	buildProfileByMi(miCardInfo){
	  log("mi建档-根据医保卡构建档案信息",miCardInfo);
	  const { knsj, grbh, xm, xb, csrq, sfzh, cbsf, age, ye, bz, dw, rqlb,dwdm} = miCardInfo;
	  var gender = '3';
	  if('男' == xb)gender = '1';
	  if('女' == xb)gender = '2';
	  const profile={
		  miPatientNo:grbh,
		  name:xm,gender:gender,sfzh,birthday:csrq, // idNo:sfzh,
		  address:dw,unitCode:'0000',medicalCardNo:'',miCardNo:knsj ,opentype:'1',
		  grbh,dwdm,knsj,
	  };
	  return profile;
    }
    loadPatientInfo(profile){
    	log("mi建档-档案信息查询",profile);
    	const { type } = this.props;
		let fetch = Ajax.get("/api/ssm/treat/patient/info",profile,{catch: 3600});
		fetch.then(res => {
			log("mi建档-档案信息查询返回",res);
			if(res && res.success){
				var patient = res.result||{};
				if(type == 'reissue'){
					this.reIssue({...profile,...patient});
				}else{
					this.issue({...profile,...patient});
				}
			}else if( res && res.msg ){
				baseUtil.error(res.msg);
	    	}else{
	    		baseUtil.error("查询档案失败");
	    	}
		}).catch((ex) =>{
			baseUtil.error("查询档案失败");
		})
    }
    issue(patient){
    	const {relationCard, relationType} = patient;
    	log('mi建档-办卡模式，根据医保卡加载用户自费档信息完毕',patient);
		if( relationCard && relationType == '01' && patient.no != patient.medicalCardNo){
			baseUtil.error('您已经办理过医保关联就诊卡');
			return;
		}else{//如果自费档案卡号不存在，则允许第二次办卡
			if(patient.no){
				log('mi建档-患者档案存在',patient);
				this.afterMiCardRead(patient)
			}else {
				log('mi建档-患者档案不存在');
				this.setState({showCareerModal:true,profile:patient})
			}
		}
    }
    reIssue(patient){
    	const {relationCard, relationType} = patient;
    	log('mi建档-补卡卡模式，根据医保卡加载用户信息完毕',patient);
		if( relationCard && relationType == '01' && patient.no != patient.medicalCardNo){//自费档存在且卡号存在
			log('mi建档-自费档存在且卡号存在');
			this.afterMiCardRead(patient)
		}else{
			baseUtil.error('您还未办理过医保关联就诊卡');
		}
    }
	onSelectCareer(career){
	  const { profile } = this.state;
	  this.setState({
		 showCareerModal:false,
		 career:career||{}
	  },()=>{
		 this.afterMiCardRead({
			 ...profile,
			 careerName:career.name,
			 careerCode:career.code,
			 occupationnum:career.code,
		})
	  });
    }
	onBack(){
	  baseUtil.goHome('miCardBack'); 
	}
	onHome(){
	  baseUtil.goHome('miCardHome'); 
	}
	afterMiCardRead(profile){
		if(this.props.afterMiCardRead)this.props.afterMiCardRead(profile);
	}
	render () { 
		var  width = document.body.clientWidth - 48;
		var  careerWidth = width - 36;
		var  modalWinTop  = 13;
		
		return (
	      <NavContainer title='读取医保卡' onBack={this.onBack} onHome={this.onHome} >
	      	<Steps steps = {this.state.steps} current = {1} />
		    <div className = 'profile_mic_guideTextContainer' >
	          <font className = 'profile_mic_guideText' >请插入医保卡</font>
	        </div>
	        <div style = {{height: '34rem', width: '30rem', margin: '3rem auto',backgroundColor:'#f5f5f5'}} >
	  		  <img alt = "" src = './images/guide/si-card-read.gif' className = 'profile_mic_guidePic' />
	  		</div>
			<Modal visible = {this.state.showMiConfirm} closable = {false} footer = {null} width = {(careerWidth/2) + 'px'} style = {{top: (modalWinTop+8) + 'rem'}} >
			  <div style = {{margin: '-16px'}}>
			 	  <MiType width = {careerWidth/2} onSelectMiType={this.onSelectMiType} />
			  </div>
			</Modal>
	  		<Modal visible = {this.state.showCareerModal} closable = {false} footer = {null} width = {careerWidth + 'px'} style = {{top: modalWinTop + 'rem'}} >
	 		    <div>
	 			  <Career width = {careerWidth - 32} onSelectCareer={this.onSelectCareer} />
	 		    </div>
	 		 </Modal>	
		  </NavContainer>
	    );
	}
}
module.exports = Page;