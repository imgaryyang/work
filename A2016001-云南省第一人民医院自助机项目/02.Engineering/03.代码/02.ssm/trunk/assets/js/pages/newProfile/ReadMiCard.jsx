"use strict";

import { Component, PropTypes } from 'react';
import { Row, Col,  Modal, Icon }    from 'antd';
import styls from './ReadMiCard.css';

import baseUtil from '../../utils/baseUtil.jsx';
import logUtil,{ log } from '../../utils/logUtil.jsx';
import miCardUtil from '../../utils/miCardUtil.jsx';

import NavContainer from '../../components/NavContainer.jsx';
import Steps from '../../components/Steps.jsx';
import MiType from '../../components/MiType.jsx';

class Page extends Component {
	constructor (props) {
		super(props);
		this.startMiCard = this.startMiCard.bind(this);
		this.onMiCardPushed = this.onMiCardPushed.bind(this);
		this.onSelectMiType = this.onSelectMiType.bind(this);
		this.afterMiCardRead = this.afterMiCardRead.bind(this);
		this.onBack = this.onBack.bind(this);
		this.onHome = this.onHome.bind(this);
		this.state = {
		  miTypeModal : false,
		  steps : ['读取医保卡', '校验手机号', '收费','发卡'],
		  miCardInfo:{},
		}
	}
	componentDidMount () {
		baseUtil.speak('card_pushMiCard');// 播放语音：请插入您的医保卡
		this.startMiCard();//开启就诊卡监听
	}
	onBack(){
	  baseUtil.goHome('miCardBack'); 
	}
	onHome(){
	  baseUtil.goHome('miCardHome'); 
	}
	startMiCard(){
		log('建档-监听医保卡状态 ');
		miCardUtil.listenCard(this.onMiCardPushed);
	}
	onMiCardPushed(){
		this.setState({miTypeModal:true});
	}
	onSelectMiType(type){
		log('mi建档-选择医保卡类型 ',type);
		this.setState({  miTypeModal:false },()=>{
			setTimeout(()=>{ 
				this.readMiCard(type.code)
			},300 )
		})
	}
	readMiCard(type){
		var machine = baseUtil.getMachineInfo();
		var miCardInfo = miCardUtil.readCard( type , machine.hisUser );
		if(!miCardInfo  || !miCardInfo.knsj){
			if(miCardInfo && miCardInfo.cwxx)baseUtil.error(miCardInfo.cwxx);
			else baseUtil.error('无法读取社保信息');
			return;
		}
		miCardInfo.miCardNo = miCardInfo.knsj;
		log('建档-读取医保卡信息 ',miCardInfo);
		this.setState({miCardInfo},()=>{
			this.afterMiCardRead(miCardInfo);
		});
	}
	afterMiCardRead(miCardInfo){
		if(this.props.afterMiCardRead){
			this.props.afterMiCardRead(miCardInfo);
		}
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
			<Modal visible = {this.state.miTypeModal} closable = {false} footer = {null} width = {(careerWidth/2) + 'px'} style = {{top: (modalWinTop+8) + 'rem'}} >
			  <div style = {{margin: '-16px'}}>
			 	  <MiType width = {careerWidth/2} onSelectMiType={this.onSelectMiType} />
			  </div>
			</Modal>
		  </NavContainer>
	    );
	}
}
module.exports = Page;