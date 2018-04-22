"use strict";
import moment from 'moment';
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
import TimerPage from '../../TimerPage.jsx';
import PinKeyboard from '../base/PinKeyboard.jsx';
import Button from '../../components/Button.jsx';
import idCardUtil from '../../utils/idCardUtil.jsx';
class Page extends TimerPage {
	constructor (props) {
		super(props);
		this.startMiCard = this.bind(this.startMiCard,this);
		this.onMiCardPushed = this.bind( this.onMiCardPushed,this);
		this.onSelectMiType =  this.bind(this.onSelectMiType,this);
		this.afterMiCardRead =  this.bind(this.afterMiCardRead,this);
		this.onEnterPass =  this.bind(this.onEnterPass,this);
		this.readMiCard =  this.bind(this.readMiCard,this);
		this.miReadSuccess = this.bind(this.miReadSuccess,this);
		this.state = {
		  password:'',
		  step:1,
		}
	}
	componentDidMount () {/*1、开启就诊卡监听*/
		this.startMiCard();
	}
	startMiCard(){/*2、开启就诊卡监听*/
		miCardUtil.listenCard(this.onMiCardPushed);
	}
	onMiCardPushed(cardInfo){/*3、插卡结束*/
		if(cardInfo.state == 32796){
			baseUtil.error("无法识别的接触卡类型,请检查插卡方向或是否接触不良");
			return;
		}
		var patient = baseUtil.getCurrentPatient();
		var { medicalCardNo } = patient;
		console.info(medicalCardNo);
		console.info(medicalCardNo.substring(0,2));
		if(medicalCardNo.substring(0,2) == '01'){//01油田医保（管局）
			this.setState({step:2});
		}else{ // 02 市政医保
			this.onEnterPass('000000');
		}
	}
	onEnterPass(password){
		this.setState({password},()=>{
			this.afterMiCardRead({password});
		});
	}
	onBack(){
	  baseUtil.goHome('miCardBack'); 
	}
	onHome(){
	  baseUtil.goHome('miCardHome'); 
	}
	afterMiCardRead(cardInfo){
		if(this.props.afterMiCardRead)this.props.afterMiCardRead(cardInfo);
	}
	render () { 
		var  width = document.body.clientWidth - 48;
		var  careerWidth = width - 36;
		var  modalWinTop  = 13;
		var { step } = this.state;
		return (
	      <NavContainer title='读取医保卡' onBack={this.onBack} onHome={this.onHome} >
	      	{
			  	step == 1?(
			  		<div>
			  			<div className = 'profile_mic_guideTextContainer' >
				          <font className = 'profile_mic_guideText' >请刷身份证或插入医保卡</font>
				        </div>
				        <Row>
				          <Col span={12}>
					        <div style = {{height: '34rem', width: '30rem', margin: '3rem auto',backgroundColor:'#f5f5f5'}} >
					  		  <img alt = "" src = './images/guide/idcard-read.gif' className = 'profile_mic_guidePic' />
					  		</div>
					  	  </Col>
					  	  <Col span={12}>
					  	  	<div style = {{height: '34rem', width: '30rem', margin: '3rem auto',backgroundColor:'#f5f5f5'}} >
					  	  		<img alt = "" src = './images/guide/si-card-read.gif' className = 'profile_mic_guidePic' />
					  	  	</div>
					  	  </Col>
				  		</Row>
				 	</div>
			  	):null	
			}
	      	{
			  	step == 2?(
			  			<PinKeyboard onSubmit={this.onEnterPass} maxLength={6}/>
			  	):null	
			}
		  </NavContainer>
	    );
	}
}
module.exports = Page;
