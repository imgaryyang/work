import React,{ Component } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Card,Modal } from 'antd';
import WorkSpace from '../../components/WorkSpace';
import Confirm from '../../components/Confirm';
import styles from './Step1.css';

import siCard               from '../../assets/guide/si-card-read.gif';
import config from '../../config';
import searchIcon           from '../../assets/base/search.png';
import Career from '../../components/Career';
import MiType from '../../components/MiType';
class Step1 extends Component {
  constructor (props) {
    super(props);
    this.next = this.next.bind(this);
    this.onSelectCareer = this.onSelectCareer.bind(this);
    this.showCareer = this.showCareer.bind(this);
    this.showMiConfirm = this.showMiConfirm.bind(this);
    this.onSelectMiType  = this.onSelectMiType.bind(this);
    this.readMiCard = this.readMiCard.bind(this);
    this.loadPatientCallback = this.loadPatientCallback.bind(this);
  }
  state = {showConfirm: false,showMiConfirm:false,showCareerModal:false,career:{}} ; 
  componentDidMount() {
	const { miCardInfo } = this.props.patient;
	if(miCardInfo.state == 'in' ){//插入社保卡
  		this.showMiConfirm();
  		return;
  	}
	if(miCardInfo.knsj ){
		this.buildProfile(miCardInfo);
		return;
	}
	this.props.dispatch({
	  type: 'patient/listenMiCard',
	});  
  }
  componentWillReceiveProps(nextProps){
	const { miCardInfo:oldMi } = this.props.patient;
  	const { miCardInfo:nowMi } = nextProps.patient;
  	if( oldMi.state != 'in'  && nowMi.state == 'in' ){//插入社保卡
  		this.showMiConfirm();
  	}
  	if(!oldMi.knsj  && nowMi.knsj){
		this.buildProfile(nowMi);
		return;
	}
	const { profile:old } = this.props.patient;
  	const { profile:now } = nextProps.patient;
	if(!old.name && now.name ) {
		setTimeout(()=>{
			this.loadPatientInfo(now);
		},200)
	}
  }
  next(){
    if(this.props.onNext)this.props.onNext();
  }
  goStep(n){
	  if(this.props.goStep)this.props.goStep(n);
  }
  buildProfile(miCardInfo){
	  console.info('根据社保卡构建档案基本信息');
	  const { knsj, grbh, xm, xb, csrq, sfzh, cbsf, age, ye, bz, dw, rqlb} = miCardInfo;
	  var gender = '3';
	  if('男' == xb)gender = '1';
	  if('女' == xb)gender = '2';
	  
//	  var birthday ='';
//	  if(sfzh && sfzh.length ==18){
//		  birthday = sfzh.substr(6, 4)+'-'+sfzh.substr(10, 2)+'-'+sfzh.substr(12, 2);
//		  var sexFlag =sfzh.substr(16, 1);
//		  gender = (sexFlag%2 == 0)?'2':'1';
//	  }else{
//		  var sexFlag =sfzh.substr(14, 1);
//		  gender = (sexFlag%2 == 0)?'2':'1';
//		  birthday = '19'+sfzh.substr(6, 2)+'-'+sfzh.substr(8, 2)+'-'+sfzh.substr(10, 2);
//	  }
	  const profile={
		  miPatientNo:grbh,
		  name:xm,gender:gender,sfzh,birthday:csrq, // idNo:sfzh,
		  address:dw,unitCode:'0000',medicalCardNo:'',miCardNo:knsj ,opentype:'1'
	  };
	  this.props.dispatch({
		  type: 'patient/setState',
		  payload:{profile}
	  })
	  return profile;
  }
  loadPatientInfo(profile){
	console.info('根据社保卡加载用户信息');
	this.props.dispatch({
		type: 'patient/loadPatientInfo',
		payload:{patient:profile},
		callback:(p)=>{
			this.loadPatientCallback(p);
		}
	});
  }
  loadPatientCallback(p){
	const {relationCard, relationType} = p;
	console.info('根据社保卡加载用户信息完毕,用户关联类型 ',relationType, relationCard, p);
	if( relationCard && relationType == '01' && p.no != p.medicalCardNo){//如果自费档案卡号不存在，则允许第二次办卡
		this.setState({showConfirm:true});
		return;
	}else{
		console.info('患者卡号不存在');
		if(p.no){
			console.info('患者档案存在，不能选择职业');
			this.next();
		}else {
			this.showCareer();
		}
		// this.next();
	}
  }
  showCareer(){
	  this.setState({showCareerModal:true});
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
  onSelectCareer(career){
	 const { profile } = this.props.patient;
	 this.setState({
		 showCareerModal:false,
		 career:career||{}
	 },()=>{
		 this.props.dispatch({
				type: 'patient/setState',
				payload:{
					profile:{
						careerName:career.name,
						careerCode:career.code,
						occupationnum:career.code,
						...profile
					}
				},
		 		callback:()=>{
		 			this.next(); 
		 		}
		 });
	});
  }
  render () {
	var  careerWidth = config.getWS().width - config.navBar.padding * 2 * config.remSize;
	var  modalWinTop  = config.navBar.height + config.navBar.padding * 2 + 5;
    return (
      <WorkSpace width = '100%' height = '50rem' >
        <div className = {styles.guideTextContainer} >
          <font className = {styles.guideText} >请插入社保卡</font>
        </div>
        <div style = {{height: '34rem', width: '30rem', margin: '3rem auto',backgroundColor:'#f5f5f5'}} >
  		  <img alt = "" src = {siCard} className = {styles.guidePic} />
  		</div>
  		<Modal visible = {this.state.showCareerModal} closable = {false} footer = {null} width = {careerWidth + 'px'} style = {{top: modalWinTop + 'rem'}} >
		    <div>
			  <Career width = {careerWidth - 32} onSelectCareer={this.onSelectCareer} />
		    </div>
		 </Modal>	
		 <Modal visible = {this.state.showMiConfirm} closable = {false} footer = {null} width = {(careerWidth/2) + 'px'} style = {{top: (modalWinTop+8) + 'rem'}} >
		  <div style = {{margin: '-16px'}}>
		 	  <MiType width = {careerWidth/2} onSelectMiType={this.onSelectMiType} />
		  </div>
		 </Modal>
      <Confirm info = '您已经关联过医保卡！' visible = {this.state.showConfirm} 
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