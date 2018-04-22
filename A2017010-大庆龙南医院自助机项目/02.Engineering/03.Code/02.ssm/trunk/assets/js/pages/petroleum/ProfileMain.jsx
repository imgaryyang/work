"use strict";

import { Component, PropTypes } from 'react';
import Confirm from '../../components/Confirm.jsx';
import PrintWin from '../../components/PrintWin.jsx';
import baseUtil from '../../utils/baseUtil.jsx';
import logUtil,{ log } from '../../utils/logUtil.jsx';
import lightUtil from '../../utils/lightUtil.jsx';
import cardPrinter from '../../utils/cardPrinterUtil.jsx';
import ReadMiCard from './ReadMiCard.jsx';
import CheckPhone from './CheckPhone.jsx';
import PayCardFee from './PayCardFee.jsx';
import ProfileDone from './ProfileDone.jsx';
import polyfill from 'babel-polyfill';
import socket from '../../utils/socket.jsx';
import TimerModule from '../../TimerModule.jsx';
/**
 * 医保建档流程
 * 读取社保卡信息，构建查询条件
 * 根据查询条件查询档案信息（查询医保档关联自费档）
 * 如果有档无卡
 * 如果无档案，选择职业，建档
 * 如果有档案有卡 ，提示已经办理过
 * 
 */
class Page extends TimerModule {
	constructor (props) {
		super(props);
		const { type } = props.params||{};
		this.next = this.bind(this.next,this);
		this.previous = this.bind(this.previous,this);
		this.afterMiCardRead = this.bind(this.afterMiCardRead,this);
		this.afterVerfied = this.bind(this.afterVerfied,this);
		this.cancelVerfied = this.bind(this.cancelVerfied,this);
		this.createProfile = this.bind(this.createProfile,this);
		this.createIssueOrder = this.bind(this.createIssueOrder,this);
		this.afterConsume = this.bind(this.afterConsume,this);
		this.cancelConsume = this.bind(this.cancelConsume,this);
		this.printCard = this.bind(this.printCard,this);
		this.bindMiCard = this.bind(this.bindMiCard,this);
		this.loadPatientInfo = this.bind(this.loadPatientInfo,this);
		this.error=this.bind(this.error,this);
		this.state = {
		  step:1,
		  profile:{},
		  consumeOrder:{amt:0},
		  rechargeOrder:{amt:0},
		  printMsg:'',
		  showPrintWin:'',
		  miPatientNo:'',
		  miCardType:'01',//01油田医保（管局） 02 市政医保
		  type,
		  knsj:'',
		  showMask:false,
		  miProfile:{},
		}
	}
	next(){
		var current = this.state.step;
		if(current<4){
			this.setState({step:current+1,showMask:false});
		}else{
			baseUtil.goHome('miNext');
		}
	}
	go(step){
	  this.setState({step:step});
	}
	previous(){
		var current = this.state.step;
		if(current>1){
			this.setState({step:current-1});
		}else{
			baseUtil.goHome('miPre');
		}
	}
	afterMiCardRead(profile){
		const { miPatientNo,knsj } = profile;
		this.setState({profile,miPatientNo,knsj},()=>{
			this.next();
		})
	}
	error(msg){
		this.setState({showMask:false},()=>{
			baseUtil.error(msg);
		});
	}
	afterVerfied(mobile,verfied){
		log('mi建档-手机号校验完毕');
		var { profile,type } = this.state;
		profile = {...profile,mobile,telephone:mobile};
		this.setState({profile,showMask:true},()=>{
			if( type == 'reissue'){
				this.createReIssueOrder();
			}else{
				if(profile.no)this.createIssueOrder();
				else this.createProfile(profile);
			}
		})
	}
	createProfile(profile){
		log('mi建档-创建医保关联自费档',profile);
    	let fetch = Ajax.post("/api/ssm/treat/patient/profile/create",profile,{catch: 3600});
		fetch.then(res => {
			log('mi建档-创建医保关联自费档返回 ',res);
			if(res && res.success){
				var patient = res.result||{};
				var newProfile = {...profile,...patient};
				//绑定
				this.bindMiCard(newProfile);
			}else if( res && res.msg ){
				this.error(res.msg);
	    	}else{
	    		this.error("创建档案失败");
	    	}
		}).catch((ex) =>{
			this.error("创建档案失败");
		})
    }
	bindMiCard(profile) {
		log('mi建档-自费档绑定医保卡',profile);
		const machine = baseUtil.getMachineInfo();
		const hisUser = machine.hisUser;
		const { miCardType }  = this.state;
		const { medicalCardNo,grbh,dwdm,sfzh,relationCard,relationType,knsj } = profile;
		try{
			log('mi建档-绑定医保卡,医保卡类型'+miCardType);
			if(relationCard && relationType == '01' ){
				log('mi建档-已经绑定过，不再绑定');//
				this.setState({profile},()=>{
					this.createIssueOrder();
				})				
				return;
			}
			//1 自费卡号 2 操作者id 3 医保卡内数据 4 医保个人编号 5 医保单位代码 6 身份证号
			var req = "G|"+ medicalCardNo+"|"+ hisUser+"|"+ knsj+"|"+  grbh+"|"+ dwdm+"|"+sfzh+"|"+miCardType+'|';
			var { data:bind } =  socket.SEND(req);
			log('mi建档-调用绑卡返回',bind);
			
			if(bind && bind.resultCode == 0){
				var result = bind.recMsg||{};
				if(result.state != '0'){
					if(result.cwxx){
						this.error(result.cwxx); 
						return;
					}else{
						this.error("无法绑定医保卡"); 
						return;
					}
				}
				this.loadPatientInfo(profile);
			}
		}catch(e){
			log('绑定医保卡异常',e);
			this.error("绑定医保卡失败"); 
		}
	}
	loadPatientInfo(profile){
		log('mi建档-重新加载绑定后的档案信息',profile);
		let fetch = Ajax.get("/api/ssm/treat/patient/info",profile,{catch: 3600});
		fetch.then(res => {
			log('mi建档-重新加载绑定后的档案信息返回',res);
			if(res && res.success){
				var patient = res.result||{};
				var newProfile  = {...profile,...patient,miPatientNo:profile.grbh};
				this.setState({profile:newProfile},()=>{
					this.createIssueOrder();
				})
			}else if( res && res.msg ){
				this.error(res.msg);
	    	}else{
	    		this.error("查询档案失败");
	    	}
		}).catch((ex) =>{
			this.error("查询档案失败");
		})
    }
	createIssueOrder(){
		var { profile } = this.state;
		log('mi建档-创建绑卡订单',profile);
		let fetch = Ajax.post("/api/ssm/treat/patient/card/order",profile,{catch: 3600});
		fetch.then(res => {
			log('mi建档-创建绑卡订单返回',res);
			if(res && res.success){
				var orders = res.result||{};
				var consumeOrder = orders.consume||{amt:0};
				var rechargeOrder = orders.recharge||{amt:0};
				this.setState({consumeOrder,rechargeOrder,showMask:false},()=>{
					this.loadMiInfo({no:profile.miPatientNo});
				});
			}else if( res && res.msg ){
				this.error(res.msg);
	    	}else{
	    		this.error("创建订单失败");
	    	}
		}).catch((ex) =>{
			this.error("无法创建订单");
		})
	}
	createReIssueOrder(){
		var { profile } = this.state;
		log('mi建档-创建补卡订单',profile);
		let fetch = Ajax.post("/api/ssm/treat/patient/card/order/reissue",{...profile,no:profile.miPatientNo},{catch: 3600});
		fetch.then(res => {
			log('mi建档-创建补卡订单返回',res);
			if(res && res.success){
				var orders = res.result||{};
				var consumeOrder = orders.consume||{amt:0};
				var rechargeOrder = orders.recharge||{amt:0};
				//log('mi建档-补卡订单创建成功 消费：', consumeOrder.id,'充值', rechargeOrder.id);
				this.setState({consumeOrder,rechargeOrder,showMask:false},()=>{
					this.loadMiInfo({no:profile.miPatientNo});
				});
			}else if( res && res.msg ){
				this.error(res.msg);
	    	}else{
	    		this.error("创建订单失败");
	    	}
		}).catch((ex) =>{
			this.error("无法创建订单");
		})
	}
	loadMiInfo(profile){
		log('mi建档-重新加载医保档案信息',profile);
		let fetch = Ajax.get("/api/ssm/treat/patient/info",profile,{catch: 3600});
		fetch.then(res => {
			log('mi建档-重新加载医保档案信息返回',res);
			if(res && res.success){
				var patient = res.result||{};
				var newProfile  = {...profile,...patient};
				this.setState({miProfile:newProfile},()=>{
					this.go(3);
				})
			}else if( res && res.msg ){
				this.error(res.msg);
	    	}else{
	    		this.error("查询档案失败");
	    	}
		}).catch((ex) =>{
			this.error("查询档案失败");
		})
    }
	cancelVerfied(){
		this.setState({profile:{}},()=>{
			this.go(1);
		});
	}
	afterConsume(rechargeOrder,consumeOrder){
		log('mi建档-支付完毕,准备制卡');
		this.setState({showPrintWin:true,rechargeOrder:rechargeOrder,consumeOrder:consumeOrder,printMsg:'正在制卡，请勿离开'},()=>{
			setTimeout(()=>{
				this.issueCard(false);
			},200);
		});
	}
	cardErrorHandler(retry,msg){
		if(retry){
			baseUtil.error(msg);
			try{
				lightUtil.cardPrinter.turnOff();
			}catch(e){
				log('mi建档-关灯失败')
			}
			this.setState({showPrintWin:false,printMsg:''});
		}else{
			this.setState({showPrintWin:true,printMsg:'尝试重新制卡，请耐心等待'},()=>{
				setTimeout(()=>{
					this.issueCard(true);
				},200);
			});
		}
	}
	issueCard(retry){//async
		const patient = this.state.profile;
		const { miPatientNo } = this.state;
		log('mi建档-发卡 ，医保编号['+miPatientNo+']' , patient);
		try{
			lightUtil.cardPrinter.blink();
			//await baseUtil.sleep(100);
		}catch(e){
			log('mi建档-闪灯异常');
		}
		if(retry){
			// 尝试排卡
			try{
				cardPrinter.moveToBasket();
			}catch(e){
				this.cardErrorHandler(true,'无法排卡，请联系运维人员');
				return;
			}
			// 尝试重启
			try{
				cardPrinter.reset();
			}catch(e){
				this.cardErrorHandler(true,'无法重启打印机，请联系运维人员');
				return;
			}
		}
    	try{
    		const state  = cardPrinter.checkPrinterStatus();
    		if(state == 0){
    			log('mi建档-当前状态'+state);
	    	}else{
	    		log('mi建档-证卡打印机状态异常');
	    		this.cardErrorHandler(retry,'打印机状态错误，请联系运维人员');// 1 状态错误 重新制卡
	    		return;
	    	}
		}catch(e){
			log('mi建档-无法读取打印机状态');
			this.cardErrorHandler(retry,'无法读取打印机状态，请联系运维人员');// 1 状态错误 重新制卡
    		return;
		} 
    	try{
    		cardPrinter.moveToReader();
    		log('mi建档-移动至非接读卡区成功');
		}catch(e){
			log('mi建档-移动至非接读卡区异常');
			this.cardErrorHandler(retry,'进卡失败,可能卡已用尽,联系管理人员');// 2 移动至非接错误 重新制卡
			return;
		} 
		var medicalCardNo = null;
		try{
    		medicalCardNo  = cardPrinter.readCardNo();
    		log('mi建档-读取卡号成功：'+medicalCardNo);
		}catch(e){
			log('mi建档-读取卡号异常',e);
			this.cardErrorHandler(retry,'读取卡号异常,请更换自助机');// 3 读卡错误  重新制卡
			return;
		}
		if(!medicalCardNo){
			lightUtil.cardPrinter.turnOff();
			this.cardErrorHandler(retry,'无效卡片,请更换自助机');// 4 卡号错误  重新制卡
			return;
		}
		try{
			cardPrinter.setStandbyParameter();
			log('mi建档-设置基本参数成功');
		}catch(e){
			log('mi建档-设置基本参数异常');
			this.cardErrorHandler(retry,'设置基本参数异常,请更换自助机');// 5 设置参数错误  重新制卡
			return;
		}
		log('mi建档-准备绑卡，卡号： ',medicalCardNo);
		let fetch = Ajax.post("/api/ssm/treat/patient/card/issue",{...patient,medicalCardNo},{catch: 3600});
		fetch.then(res => {
			if(res && res.success){
				var baseInfo = res.result||{};
				log('mi建档-绑卡完毕');
				this.printCard(baseInfo,miPatientNo);
				try{
					baseUtil.speak('card_tackMdeicalCard');// 
					lightUtil.cardPrinter.turnOff();
				}catch(e){
					log('mi建档-关灯失败');
				}
				this.setState({showPrintWin:false,printMsg:''},()=>{
					this.go(4);
				});
			}else if( res && res.msg ){
				this.cardErrorHandler(retry,res.msg);
	    	}else{
	    		this.cardErrorHandler(retry,'绑定卡异常,请更换自助机');//  6  可能卡号被占用 重新制卡
	    	}
		}).catch((ex) =>{
			this.cardErrorHandler(retry,'绑定卡异常,请更换自助机');//  6  可能卡号被占用 重新制卡
		})
	}
	printCard(baseInfo,miPatientNo){
		try{//如果有关联医保卡号，打医保卡号
			// var type = miPatientNo?"医保":'自费';
			//const { miCardType } = this.state;
			// var type = (miCardType == '01')?' 管局':'市政';
			var { miCardType,knsj } = this.state;
			var cType = knsj.substring(0,2);
			var type = (miCardType == '01')?' 管局医保':'市政医保';
			if(cType == '02')type = '市政医保';
			if(cType == '01')type = '管局医保';
			log('mi建档-打印卡类型','miCardType='+miCardType,'knsj='+knsj,'cType = '+cType,'type = '+type);
			cardPrinter.printCard(baseInfo.name,miPatientNo || baseInfo.no,type);
		}catch(e){
			log('mi建档-发送打印指令异常',e);
			this.cardErrorHandler(true,'发送打印指令异常,请更换自助机');// 6 发送打印指令异常  不重新制卡
			return;
		}
		baseUtil.speak('card_tackMdeicalCard');// 
		try{
			lightUtil.cardPrinter.turnOn();
		}catch(e){
			log('mi建档-开灯异常');
		} 
		this.setState({profile:baseInfo},()=>{
			this.go(4);
		});			
		try{
			lightUtil.cardPrinter.turnOff();
		}catch(e){
			log('mi建档-关灯异常');
		} 
	}
	cancelConsume(){
		this.go(2);
	}
	render () { 
		const { step,type,showMask ,miCardType} = this.state;
		var loadingDisplay = showMask?'':'none' ;
		return (
		  <div>
		  {
		  	step == 1?(
		  	  <ReadMiCard 
		  	    type = {type}
		  	  	miCardType = {miCardType}
		  	  	afterMiCardRead={this.afterMiCardRead}/>
		  	):null	
		  }
		  {
		  	step == 2?(
		  	  <CheckPhone 
		  	  	profile ={this.state.profile} 
		  	  	afterVerfied={this.afterVerfied} 
		  	  	cancelVerfied={this.cancelVerfied}/>
		  	):null	
		  }
		  {
		  	step == 3?(
		  	  <PayCardFee 
		  	    patient={this.state.miProfile} 
		  	  	consumeOrder={this.state.consumeOrder}
		  	  	rechargeOrder={this.state.rechargeOrder}
		  	  	afterPay={this.afterConsume} 
		  	  	cancelPay={this.cancelConsume} />	
		  	):null	
		  }
		  {
		  	step == 4?(
		  	  <ProfileDone type = { type} profile = {this.state.profile} order={this.state.consumeOrder}/>
		  	):null	
		  }
		  <PrintWin msg={this.state.printMsg} visible={this.state.showPrintWin} />
		  <div className='fm_modal' style={{display:loadingDisplay,backgroundImage:"url('./images/loading06.gif')"}}></div>
		  </div>
	    );
	}
}

module.exports = Page;