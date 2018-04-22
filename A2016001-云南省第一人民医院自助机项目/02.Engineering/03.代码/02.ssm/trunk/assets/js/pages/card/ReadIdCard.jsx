"use strict";

import { Component, PropTypes } from 'react';
import baseUtil from '../../utils/baseUtil.jsx';
import logUtil,{ log } from '../../utils/logUtil.jsx';
import idCardUtil from '../../utils/idCardUtil.jsx';
import { Row, Col,  Modal, Icon }    from 'antd';
import styls from './ReadIdCard.css';
import NavContainer from '../../components/NavContainer.jsx';
import Career from '../../components/Career.jsx';
import Steps from '../../components/Steps.jsx';
import Confirm from '../../components/Confirm.jsx';
import Card from '../../components/Card.jsx';
/**
 * 读取身份证信息
 * 根据身份证信息查询档案信息（有医保卡号，优先查询医保关联的自费档，然后查询自费档）
 * 
 */
class Page extends Component {
	constructor (props) {
		super(props);
		this.startIdCard = this.startIdCard.bind(this);
		this.onIdCardReaded = this.onIdCardReaded.bind(this);
		this.buildProfileById = this.buildProfileById.bind(this);
		this.loadPatientInfo = this.loadPatientInfo.bind(this);
		this.afterIdCardRead = this.afterIdCardRead.bind(this);
		this.onSelectCareer = this.onSelectCareer.bind(this);
		this.renderInfoConfirm = this.renderInfoConfirm.bind(this);
		this.issue = this.issue.bind(this);
		this.reIssue = this.reIssue.bind(this);
		this.state = {
		  showCareerModal:false,
		  infoConfirm:false,
		  steps : ['读取身份证', '校验手机号', '收费','发卡'],
		  profile:{},
		}
	}
	componentDidMount () {
		//this.startIdCard();//开启就诊卡监听
		const { type } = this.props;
		if(type == 'reissue'){//补卡模式下不提示
			this.startIdCard() ;
		}else{
			this.setState({infoConfirm:true});
		}
	}
	startIdCard(){
		log("办卡-开启身份证读卡器");
		baseUtil.speak('card_putIdCard');// 播放语音：请将您的身份证放置到身份证读卡器
		idCardUtil.listenCard(this.onIdCardReaded);
	}
	onIdCardReaded(idCardInfo){
		log("办卡-身份证读取完毕",idCardInfo);
		var profile = this.buildProfileById(idCardInfo);
		log("办卡-根据身份证构建档案信息",profile);
		this.loadPatientInfo(profile)
	}
	buildProfileById(idCardInfo){
	  const {userName, sex, nation,birthday} = idCardInfo;
	  const {address,idNo,issuer,effectiveDate} = idCardInfo;
	  var gender = '3';
	  if('男' == sex)gender = '1';
	  if('女' == sex)gender = '2';
	  const profile={
	    name:userName,gender:gender,idNo:idNo,birthday:birthday,
	    address:address,unitCode:'0000',medicalCardNo:'',opentype:'1'
	    //nationality marriage nativePlace nation
      };
	  return profile;
    }
    loadPatientInfo(profile){
    	log("办卡-查询档案信息是否存在",profile);
    	const { type } = this.props;
		let fetch = Ajax.get("/api/ssm/treat/patient/info",profile,{catch: 3600});
		fetch.then(res => {
			log("办卡-查询档案信息是否存在返回",res);
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
    issue(patient){//发卡
    	log("办卡-发卡模式下，档案查询成功");
    	if(patient.no && patient.medicalCardNo != patient.no ){
			baseUtil.error('您已经申请过就诊卡，如果您需要挂失或者补办就诊卡，请到"就诊卡挂失补办"菜单进行操作!');
			return;
		}
		if(patient.no){
			console.info('患者已经创建过档案但未发卡',patient);
			this.afterIdCardRead(patient)
		}else {
			console.info('患者未创建过档案');
			this.setState({showCareerModal:true,profile:patient})
		}
    }
    reIssue(patient){//补卡
    	log("办卡-补卡模式下，档案查询成功");
    	if(patient.no && patient.medicalCardNo != patient.no ){
			this.afterIdCardRead(patient);
		}else{
			baseUtil.error('您未申请过自费卡，如果您需要办理自费就诊卡，请到"身份证办卡"菜单进行操作!');
			return;
		}
    }
	onSelectCareer(career){
	  log("办卡-选择职业");
	  const { profile } = this.state;
	  this.setState({
		 showCareerModal:false,
		 career:career||{}
	  },()=>{
		 this.afterIdCardRead({
			 ...profile,
			 careerName:career.name,
			 careerCode:career.code,
			 occupationnum:career.code,
		})
	  });
    }
	onBack(){
	  baseUtil.goHome('idCardBack'); 
	}
	onHome(){
	  baseUtil.goHome('idCardHome'); 
	}
	afterIdCardRead(profile){
		if(this.props.afterIdCardRead)this.props.afterIdCardRead(profile);
	}
	render () { 
		var  width = document.body.clientWidth - 48;
		var  careerWidth = width - 36;
		var  modalWinTop  = 13;
		
		return (
	      <NavContainer title='读取身份信息' onBack={this.onBack} onHome={this.onHome} >
	        <Steps steps = {this.state.steps} current = {1} />
  		    <div  style = {{ margin: '4rem auto'}}>
		      <div className = 'card_idc_guideTextContainer'>
				  <font className = 'card_idc_guideText' >请将您的身份证放置到身份证读卡器</font>
			    </div>
			    <div style = {{height: '30rem', width: '30rem', margin: '3rem auto'}} >
	  			<img alt = "" src = './images/guide/idcard-read.gif' className = 'card_idc_guidePic'/>
	  		  </div>
	        </div>  
	  	    <Modal visible = {this.state.showCareerModal} closable = {false} footer = {null} width = {careerWidth + 'px'} style = {{top: modalWinTop + 'rem'}} >
	 		    <div>
	 			  <Career width = {careerWidth - 32} onSelectCareer={this.onSelectCareer} />
	 		    </div>
	 	    </Modal>	
	 	   <Confirm   visible = {this.state.infoConfirm}   width = {document.body.clientWidth*0.95}
	        buttons = {[
	          {text: '我要办理医保关联卡', outline: true, onClick:()=>{baseUtil.goHome('cashConfirm');}},
	          {text: '确定办理自费卡', onClick: ()=>{
	        	  this.setState({infoConfirm:false},()=>{
	        	    this.startIdCard() ;
	        	  });	        	 
	          }},
	        ]}
	    info = {this.renderInfoConfirm()} />
		  </NavContainer>
	    );
	}
	renderInfoConfirm() {
	    let btnStyle = {marginTop: '2rem', /*width: '56rem',*/};
	    var txtStyle = {
	    	textAlign: 'left',
	    	paddingLeft:'2rem',
	    	fontWeight: '400',
	    	fontSize: '2.5rem',
	    	lineHeight: '7rem',
	    };
		var fontStyle={
			color: '#DB5A5A',
			fontSize: '4.5rem',
		}
	    return (
	      <div style = {{padding: '1rem',marginTop:'-3rem'}} >
	        <Card >
	          <Row>
		          <Col span = {24} style = {txtStyle} >
		            <font style={fontStyle}>如果您是医保患者，强烈建议您使用《办理医保关联卡》菜单办卡就诊，使用身份证办理的自费就诊卡将不能进行医保报销！！</font>
		          </Col>
	          </Row>
	        </Card>
	      </div>
	    );
	  } 
}

Page.propTypes = {
  children: PropTypes.any
}

module.exports = Page;