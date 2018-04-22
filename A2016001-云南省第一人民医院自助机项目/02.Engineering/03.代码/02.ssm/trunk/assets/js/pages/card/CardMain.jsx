"use strict";

import { Component, PropTypes } from 'react';
import Confirm from '../../components/Confirm.jsx';
import PrintWin from '../../components/PrintWin.jsx';
import baseUtil from '../../utils/baseUtil.jsx';
import logUtil,{ log } from '../../utils/logUtil.jsx';
import lightUtil from '../../utils/lightUtil.jsx';
import cardPrinter from '../../utils/cardPrinterUtil.jsx';
import ReadIdCard from './ReadIdCard.jsx';
import CheckPhone from './CheckPhone.jsx';
import PayCardFee from './PayCardFee.jsx';
import CardDone from './CardDone.jsx';
import polyfill from 'babel-polyfill';

/**
 * 发卡流程
 * --刷身份证，根据身份证信息构建查询条件
 * --根据查询条件查询是否有档案（查询未关联过医保档的身份证号码符合的自费档案）
 * ----无档案，选择职业
 * ----有档案，无卡号,根据返回更新档案信息
 * ----有档案有卡号，提示已办理
 * --校验手机号，根据手机号完善档案信息，无档案创建档案。
 * --创建收费订单和预存订单
 * //TODO 完成预存 加载个人信息
 * --支付收费订单,支付完毕发卡
 * --发卡完毕进入结束页面，打印凭条
 */
class Page extends Component {
	constructor (props) {
		super(props);
		const { type } = props.params||{};
		this.go = this.go.bind(this);
		this.afterIdCardRead = this.afterIdCardRead.bind(this);
		this.afterVerfied = this.afterVerfied.bind(this);
		this.cancelVerfied = this.cancelVerfied.bind(this);
		this.createProfile = this.createProfile.bind(this);
		this.createIssueOrder = this.createIssueOrder.bind(this);
		this.createReIssueOrder = this.createReIssueOrder.bind(this);
		this.afterConsume = this.afterConsume.bind(this);
		this.cancelConsume = this.cancelConsume.bind(this);
		this.printCard = this.printCard.bind(this);
		this.error = this.error.bind(this);
		this.state = {
		  step:1,
		  profile:{},
		  consumeOrder:{amt:0},
		  rechargeOrder:{amt:0},
		  printMsg:'',
		  showPrintWin:'',
		  type,
		  showMask:false,
		}
	}
	go(step){
		this.setState({step,showMask:false});
	}
	afterIdCardRead(profile){
		log("办卡-身份证处理完毕",profile);
		this.setState({profile},()=>{
			this.go(2);
		})
	}
	error(msg){
		this.setState({showMask:false},()=>{
			baseUtil.error(msg);
		});
	}
	afterVerfied(mobile,verfied){
		var { profile,type } = this.state;
		log("办卡-手机号校验完毕",{mobile,verfied,profile,type});
		profile = {...profile,mobile,telephone:mobile};
		this.setState({profile,showMask:true},()=>{
			if(type == 'reissue'){
				this.createReIssueOrder();
			}else{
				if(profile.no)this.createIssueOrder();
				else this.createProfile(profile);
			}
		})
	}
	createProfile(profile){
		log("办卡-创建档案信息",profile);
    	let fetch = Ajax.post("/api/ssm/treat/patient/profile/create",profile,{catch: 3600});
		fetch.then(res => {
			log("办卡-创建档案信息返回",res);
			if(res && res.success){
				var patient = res.result||{};
				var newProfile = {...profile,...patient};
				this.setState({profile:newProfile},()=>{
					this.createIssueOrder();
				})
			}else if( res && res.msg ){
				this.error(res.msg);
	    	}else{
	    		this.error("创建档案失败");
	    	}
		}).catch((ex) =>{
			this.error("创建档案失败");
		})
    }
	createIssueOrder(){
		log("办卡-创建办卡订单");
		var { profile } = this.state;
		let fetch = Ajax.post("/api/ssm/treat/patient/card/order",profile,{catch: 3600});
		fetch.then(res => {
			log("办卡-创建办卡订单返回",res);
			if(res && res.success){
				var orders = res.result||{};
				var consumeOrder = orders.consume||{amt:0};
				var rechargeOrder = orders.recharge||{amt:0};
				console.info('办卡订单创建成功 消费：', consumeOrder.id,'充值', rechargeOrder.id);
				this.setState({consumeOrder,rechargeOrder},()=>{
					this.go(3);
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
		log("办卡-创建补卡订单");
		var { profile } = this.state;
		let fetch = Ajax.post("/api/ssm/treat/patient/card/order/reissue",profile,{catch: 3600});
		fetch.then(res => {
			log("办卡-创建补卡订单返回",res);
			if(res && res.success){
				var orders = res.result||{};
				var consumeOrder = orders.consume||{amt:0};
				var rechargeOrder = orders.recharge||{amt:0};
				//console.info('补卡订单创建成功 消费：', consumeOrder.id,'充值', rechargeOrder.id);
				this.setState({consumeOrder,rechargeOrder},()=>{
					this.go(3);
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
	cancelVerfied(){
		this.setState({profile:{}},()=>{
			this.go(1);
		});
	}
	afterConsume(order){//TODO 加载账户余额
		log("办卡-支付完毕");
		this.setState({showPrintWin:true,consumeOrder:order,printMsg:'正在制卡，请勿离开'},()=>{
			setTimeout(()=>{
				this.issueCard(false);
			},200);
		});
	}
	cardErrorHandler(retry,msg){
		log("办卡-制卡错误,是否重试["+retry+"]",msg);
		if(retry){
			baseUtil.error(msg);
			try{
				lightUtil.cardPrinter.turnOff();
			}catch(e){
				console.info('关灯失败')
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
		const { miPatientNo } = patient;
		console.info('发卡 ： ' , patient);
		try{
			lightUtil.cardPrinter.blink();
			//await baseUtil.sleep(100);
		}catch(e){
			console.info('闪灯异常');
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
    			console.info('当前状态'+state);
	    	}else{
	    		console.info('证卡打印机状态异常');
	    		var msg = cardPrinter.getErrorMsg(state);
	    		this.cardErrorHandler(retry,msg);// 1 状态错误 重新制卡
	    		return;
	    	}
		}catch(e){
			console.info('无法读取打印机状态');
			this.cardErrorHandler(retry,'无法读取打印机状态，请联系运维人员');// 1 状态错误 重新制卡
    		return;
		} 
    	try{
    		cardPrinter.moveToReader();
    		console.info('移动至非接读卡区成功');
		}catch(e){
			console.info('移动至非接读卡区异常');
			this.cardErrorHandler(retry,'卡箱内无卡，请联系管理人员');// 2 移动至非接错误 重新制卡
			return;
		} 
		var medicalCardNo = null;
		try{
    		medicalCardNo  = cardPrinter.readCardNo();
    		console.info('读取卡号成功：'+medicalCardNo);
		}catch(e){
			console.info('读取卡号异常');
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
			console.info('设置基本参数成功');
		}catch(e){
			console.info('设置基本参数异常');
			this.cardErrorHandler(retry,'设置基本参数异常,请更换自助机');// 5 设置参数错误  重新制卡
			return;
		}
		log("办卡-准备绑卡，卡号： ",medicalCardNo);
		let fetch = Ajax.post("/api/ssm/treat/patient/card/issue",{...patient,medicalCardNo},{catch: 3600});
		fetch.then(res => {
			log("办卡-绑卡返回： ",res);
			if(res && res.success){
				var baseInfo = res.result||{};
				this.printCard(baseInfo,miPatientNo);
				try{
					baseUtil.speak('card_tackMdeicalCard');// 
					lightUtil.cardPrinter.turnOff();
				}catch(e){
					console.info('关灯失败')
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
			var type = miPatientNo?"医保":'自费';
			cardPrinter.printCard(baseInfo.name,miPatientNo || baseInfo.no,type);
		}catch(e){
			console.info(e);
			this.cardErrorHandler(true,'发送打印指令异常,请更换自助机');// 6 发送打印指令异常  不重新制卡
			return;
		}
		baseUtil.speak('card_tackMdeicalCard');// 
		try{
			lightUtil.cardPrinter.turnOn();
		}catch(e){
			console.info('开灯异常');
		} 
		this.setState({profile:baseInfo},()=>{
			this.go(4);
		});			
		try{
			lightUtil.cardPrinter.turnOff();
		}catch(e){
			console.info('关灯异常');
		} 
	}
	cancelConsume(){
		this.go(2);
	}
	render () { 
		const { step,type } = this.state;
		
		return (
		  <div>
		  {
		  	step == 1?(
		  	  <ReadIdCard 
		  	  	type = {type}
		  	  	afterIdCardRead={this.afterIdCardRead}/>
		  	):null	
		  }
		  {
		  	step == 2?(
		  	  <CheckPhone 
		  	  	profile ={this.state.profile} 
		  	  	type={type == 'issue'?'REG':'REP'}
		  	  	afterVerfied={this.afterVerfied} 
		  	  	cancelVerfied={this.cancelVerfied}/>
		  	):null	
		  }
		  {
		  	step == 3?(
		  	  <PayCardFee 
		  	  	patient={this.state.profile} 
		  	  	order={this.state.consumeOrder}
		  	  	afterPay={this.afterConsume} 
		  	  	cancelPay={this.cancelConsume} />	
		  	):null	
		  }
		  {
		  	step == 4?(
		  	  <CardDone type = {type} profile={this.state.profile} order={this.state.consumeOrder}/>
		  	):null	
		  }
		  <PrintWin msg={this.state.printMsg} visible={this.state.showPrintWin} />
		  </div>
	    );
	}
}

Page.propTypes = {
  children: PropTypes.any
}

module.exports = Page;