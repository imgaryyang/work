"use strict";

import { Component, PropTypes } from 'react';
import baseUtil from '../../utils/baseUtil.jsx';
import printUtil from '../../utils/printUtil.jsx';
import { Row, Col,  Modal, Icon }    from 'antd';
import NavContainer from '../../components/NavContainer.jsx';
import Steps from '../../components/Steps.jsx';
import Card from '../../components/Card.jsx';
import BackTimer from '../../components/BackTimer.jsx';
import styls from './CardDone.css';
class Page extends Component {
	constructor (props) {
		super(props);
		this.onBack = this.onBack.bind(this);
		this.onHome = this.onHome.bind(this);
		this.state = {
			steps : ['读取身份证', '校验手机号', '收费','发卡'],
		}
	}
	componentWillMount () {
		var machine = baseUtil.getMachineInfo();
		var  { profile,order,type } = this.props;
		try{
			if(type == 'reissue'){
				console.info("打印补卡凭条");
				printUtil.printMakeUpCardFees(order,profile,machine);
			}else{
				console.info("打印办卡凭条");
				printUtil.printDoCardFees(order,profile,machine);
			}
		}catch(e){
			console.info(e);
			baseUtil.error("打印机异常，打印办卡凭证失败"); 
		}
	}
	onBack(){
		 baseUtil.goHome('cardDoneBack'); 
	}
	onHome(){
		 baseUtil.goHome('cardDoneHome'); 
	}
	render () { 
		var  width = document.body.clientWidth - 48;
		var  careerWidth = width - 36;
		var  modalWinTop  = 13;
		return (
		  <NavContainer title='发卡' onBack={this.onBack} onHome={this.onHome} >
		      <Steps steps = {this.state.steps} current = {4} />
			  <div className = 'card_done_guideTextContainer' >
		        <font className = 'card_done_guideText' >请取卡</font><br/>
		        <font style = {{fontSize: '3rem'}} >请在就诊卡发卡口领取您的就诊卡并妥善保管</font>
		      </div>
		      <BackTimer style = {{marginTop: '2rem'}} />
		      <div style = {{height: '30rem', width: '25rem', margin: '3rem auto'}} >
		        <img alt = "请在就诊卡发卡口领取您的就诊卡并妥善保管" src = './images/guide/med-card-issue.gif' className = 'card_done_guidePic' />
		      </div>
		  </NavContainer>
	    );
	}
}

module.exports = Page;