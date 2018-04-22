"use strict";

import { Component, PropTypes } from 'react';
import { Row, Col,  Modal, Icon }    from 'antd';

import baseUtil from '../../utils/baseUtil.jsx';
import logUtil,{ log } from '../../utils/logUtil.jsx';
import idCardUtil from '../../utils/idCardUtil.jsx';

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
		this.onBack = this.onBack.bind(this);
		this.onHome = this.onHome.bind(this);
		this.startIdCard = this.startIdCard.bind(this);
		this.onIdCardReaded = this.onIdCardReaded.bind(this);
		this.afterIdCardRead = this.afterIdCardRead.bind(this);
		this.state = {
		  showCareerModal:false,
		  infoConfirm:false,
		  steps : ['读取身份证', '校验手机号', '收费','发卡'],
		  profile:{},
		}
	}
	componentDidMount () {
		this.startIdCard() ;
	}
	onBack(){
	  baseUtil.goHome('idCardBack'); 
	}
	onHome(){
	  baseUtil.goHome('idCardHome'); 
	}
	startIdCard(){
		log("办卡-开启身份证读卡器");
		baseUtil.speak('card_putIdCard');// 播放语音：请将您的身份证放置到身份证读卡器
		idCardUtil.listenCard(this.onIdCardReaded);
	}
	onIdCardReaded(idCardInfo){
		this.setState({idCardInfo},()=>{
			this.afterIdCardRead(idCardInfo);
		});
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
		  </NavContainer>
	    );
	}
}

Page.propTypes = {
  children: PropTypes.any
}

module.exports = Page;