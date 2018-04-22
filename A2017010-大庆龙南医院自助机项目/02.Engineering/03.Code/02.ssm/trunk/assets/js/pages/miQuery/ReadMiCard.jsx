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
		this.onEnterPass =  this.bind(this.onEnterPass,this);
		this.readMiCard =  this.bind(this.readMiCard,this);
		this.state = {
			step:1,
			miCardType:props.miCardType	
		}
	}
	componentDidMount () {
		this.startMiCard();//开启就诊卡监听
	}
	startMiCard(){
		miCardUtil.listenCard(this.onMiCardPushed);
	}
	onMiCardPushed(cardInfo){
		if(cardInfo.state == 32796){
			baseUtil.error("无法识别的接触卡类型,请检查插卡方向或是否接触不良");
			return;
		}
		const { miCardType }  = this.state;
		//如果有地址，则取得地址，如果没有，则需要刷身份证取得地址
		this.setState({step:2,medium:cardInfo.medium,address:cardInfo.Address||cardInfo.dw},()=>{
			if(miCardType == '02') {
				log('市政-输入默认密码000000');
				this.onEnterPass('000000');//市政不需要输入密码 // miCardType,//01油田医保（管局） 02 市政医保
			}
		});
	}
	onEnterPass(pwd){
		this.setState({password:pwd},()=>{
			baseUtil.mask('socket-readMiCard');
			setTimeout(()=>{ 
				this.readMiCard(1);//选择一个默认类型
			},300);
		});
	}
	readMiCard(type){
		var machine = baseUtil.getMachineInfo();
		var { medium,password } = this.state;
		var { miCardType } = this.props;// 01 油田，02 社保 
		//1交易码 2医保类型3是否是身份证 4社保卡类型 5社保卡密码	6操作员	7是否是自助机
		var cardInfo = {type,medium,password,miCardType};//
		var miCardInfo = {};
		try{
			miCardInfo = miCardUtil.readCard( cardInfo , machine.hisUser );
		}catch(e){
			baseUtil.unmask('socket-readMiCard');
			baseUtil.error('socket通信异常，请联系运维人员');
			return;
		}
		baseUtil.unmask('socket-readMiCard');
		
//		miCardInfo = {
//			"state":"0",
//			"knsj":"02^00^588392958",
//			"grbh":"1001346282","xm":"方安","xb":"女",
//			"csrq":"1982-08-17 00:00:00",
//			"sfzh":"230202198208175540",
//			"cbsf":"","age":"35","ye":"48.62","bz":"",
//			"dw":"在校生",
//			"rqlb":"3A","cwxx":"",
//			"dwdm":'NB71',
//		}
		this.afterMiCardRead(miCardInfo);
	}
	onBack(){
	  baseUtil.goHome('miCardBack'); 
	}
	onHome(){
	  baseUtil.goHome('miCardHome'); 
	}
	afterMiCardRead(miCardInfo){
		if(this.props.afterMiCardRead)this.props.afterMiCardRead(miCardInfo);
	}
	render () { 
		var  width = document.body.clientWidth - 48;
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

