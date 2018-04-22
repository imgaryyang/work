"use strict";

import { Component, PropTypes } from 'react';
import { Row, Col,  Modal, Icon }    from 'antd';
import polyfill from 'babel-polyfill';
import socket from '../../utils/socket.jsx';
import Confirm from '../../components/Confirm.jsx';
import PrintWin from '../../components/PrintWin.jsx';
import Career from '../../components/Career.jsx';

import baseUtil from '../../utils/baseUtil.jsx';
import logUtil,{ log } from '../../utils/logUtil.jsx';
import lightUtil from '../../utils/lightUtil.jsx';
import cardPrinter from '../../utils/cardPrinterUtil.jsx';

import ReadMedium from './ReadMedium.jsx';
import SelectCard from './SelectCard.jsx';
import CheckPhone from './CheckPhone.jsx';
import PayCardFee from './PayCardFee.jsx';
import ProfileDone from './ProfileDone.jsx';
/**
 * 建档流程
 * 
 */
class Page extends Component {
	constructor (props) {
		super(props);
		
		
		this.getInitState = this.getInitState.bind(this);
		this.isHasCard = this.isHasCard.bind(this);
		this.afterReadMedium = this.afterReadMedium.bind(this);
		this.showCardType = this.showCardType.bind(this);
		this.onSelectCardType = this.onSelectCardType.bind(this);

		this.queryPatientInfo = this.queryPatientInfo.bind(this);
		this.getCurrentOptProfile = this.getCurrentOptProfile.bind(this);
		this.checkOperation = this.checkOperation.bind(this);
		this.selectCareer = this.selectCareer.bind(this);
		this.onSelectCareer = this.onSelectCareer.bind(this);	
		this.afterVerfiedPhone = this.afterVerfiedPhone.bind(this);
		this.cancelVerfied = this.cancelVerfied.bind(this);
		this.buildProfile = this.buildProfile.bind(this);
		this.buildProfileByMi = this.buildProfileByMi.bind(this);
		this.buildProfileById = this.buildProfileById.bind(this);
		
		this.createProfile = this.createProfile.bind(this);
		this.bindProfile = this.bindProfile.bind(this);
		this.checkIssueFeed = this.checkIssueFeed.bind(this);
		this.checkReIssueFeed = this.checkReIssueFeed.bind(this);
		
		this.createOrder = this.createOrder.bind(this);
		this.createIssueOrder = this.createIssueOrder.bind(this);
		this.createReIssueOrder = this.createReIssueOrder.bind(this);
		this.afterConsume = this.afterConsume.bind(this);
		this.cancelConsume = this.cancelConsume.bind(this);
		
		this.cardErrorHandler = this.cardErrorHandler.bind(this);
		this.issueCard = this.issueCard.bind(this);
		this.printCard = this.printCard.bind(this);
		
		this.state = this.getInitState(props);
	}
	getInitState(props){
		const { type } = props.params||{};
		const initialState = {
				step : 1,
				type : type ,
				mediumInfo:{},
				career:{},
				idProfile:null,//自费档
				miProfile:null,//医保档
				relaProfile:null,//关联档
				profile:null,//当前操作的档案
				orderProfile:null,
				mobile:'',
			    printMsg:'',
			    showCareerModal:false,
			    showPrintWin:false,
		};
		if('issueByMI' == type ){
			log("建档-操作类型",'社保发卡');
			return {operation:'issue',medium:'mi',cardType:'mi',...initialState};
		}else if('reissueByMI' == type ){
			log("建档-操作类型",'社保补卡');
			return {operation:'reissue',medium:'mi',cardType:'mi',...initialState};
		}else if('issueByID' == type ){
			log("建档-操作类型",'身份证发卡');
			return {operation:'issue',medium:'id',cardType:'id',...initialState};
		}else if('reissueByID' == type ){
			log("建档-操作类型",'身份证补卡');
			return {operation:'reissue',medium:'id',cardType:'id',...initialState};
		}else if('binding' == type ){
			log("建档-操作类型",'绑定社保卡');
			return {operation:'binding',medium:'mi',cardType:'mi',...initialState};
		}
		baseUtil.error('不支持的操作类型');
		return {operation:'unknown',medium:'unknown',cardType:'unknown',...initialState};
	}
	isHasCard(profile){
		return profile && profile.no != profile.medicalCardNo && profile.medicalCardNo.length == 20;
	}
	afterReadMedium(mediumInfo){
		this.setState({mediumInfo},()=>{
			this.queryPatientInfo(()=>{this.showCardType()});
		});
	}
	showCardType(){
		const {idProfile,relaProfile,miProfile,medium,operation} = this.state;
		var profile;
		if(idProfile && miProfile && operation=='reissue'){//两个档案均存在，根据菜单操作
			this.setState({step:2});
		}else{
			this.checkOperation()
		}
		
	}
	onSelectCardType(type){
		this.setState({cardType:type},()=>{//选择希望补卡的类型相当于重置了介质类型
			this.checkOperation()
		})
	}
	queryPatientInfo( callback ){//查询
		const { mediumInfo } = this.state;
		var { idNo,miCardNo,sfzh } =  mediumInfo;
		log("建档-档案信息查询",{idNo,miCardNo});
		let fetch = Ajax.get("/api/ssm/treat/patient/list",{idNo:idNo||sfzh,miCardNo},{catch: 3600});
		fetch.then(res => {
			log("建档-档案信息查询返回",res);
			if(res && res.success){
				var profiles = res.result||[];
				var miProfile,idProfile,relaProfile;
				for(var profile of profiles){
					const {unitCode,relationCard,relationType } = profile;
					if(unitCode == '0000'){
						if( relationCard && relationType == '01'){ //自费关联档
							relaProfile = profile;
						}else{//自费档
							idProfile = profile;
						}
					}else{//医保档
						miProfile=profile;//医保档
					}
				}
				log("建档-查询idProfile ", idProfile);
				log("建档-查询relaProfile ", relaProfile);
				log("建档-查询miProfile ", miProfile);
				this.setState({miProfile,idProfile,relaProfile},()=>{
					if(callback)callback();
				});
			}else if( res && res.msg ){
				baseUtil.error(res.msg);
	    	}else{
	    		baseUtil.error("查询档案失败");
	    	}
		}).catch((ex) =>{
			baseUtil.error("查询档案失败");
		})
	}
	getCurrentOptProfile(){
		const {idProfile,relaProfile,miProfile,medium,operation,cardType} = this.state;
		log("建档-当前发卡类型",cardType);
		var profile;
		if(idProfile && !miProfile){//只有自费档，操作自费档
			profile = idProfile;
		}else if( miProfile && !idProfile ){//只有医保档，操作关联档
			profile = relaProfile;
		}else {//两个档案均存在，根据补卡类型菜单操作
			profile = (cardType == 'mi')?relaProfile:idProfile;
		}
		return profile;
	}
	checkOperation(){
		const {idProfile,relaProfile,miProfile,medium,operation,cardType} = this.state;
		var profile = this.getCurrentOptProfile();
		
		var isRela =  profile&& profile.relationCard && profile.relationType == '01';
		var cardName = isRela ?'医保关联卡':'自费卡';
		var hasCard = this.isHasCard(profile);
		
		log("建档-当前档案",(isRela?'医保关联档':'自费档'),profile);
		log("建档-当前卡"+''+(hasCard?'存在':'不存在'));

		if(operation == 'binding' && miProfile  ){
			baseUtil.error('您已经绑定过'+cardName+'，如果您的卡丢失，请到补卡菜单操作');
		}
		if(hasCard && operation == 'issue'){//
			if(isRela && cardType=='mi'){
				baseUtil.error('您已经办理过'+cardName+'，如果您的卡丢失，请到补卡菜单操作');
				return;
			}else if(!isRela && cardType=='id'){
				baseUtil.error('您已经办理过'+cardName+'，如果您的卡丢失，请到补卡菜单操作');
				return;
			}
		}
		
		if(!hasCard && operation == 'reissue'){//有卡
			if(isRela && cardType=='mi'){
				baseUtil.error('您还未办理过'+cardName+'，请到办卡菜单操作');
				return;
			}else if(!isRela && cardType=='id'){
				baseUtil.error('您还未办理过'+cardName+'，请到办卡菜单操作');
				return;
			}
		}
		this.setState({profile},this.selectCareer)
	}
	selectCareer(){
		const { profile } = this.state;
		if(profile){//档案存在 不选择职业
			this.onSelectCareer({});
		}else{
			this.setState({showCareerModal:true});
		}
	}
	onSelectCareer(career){
		this.setState({career,step:3,showCareerModal:false});
	}
	afterVerfiedPhone(mobile,verfied){
		log('建档-手机号校验完毕');
		const { profile } = this.state;
		this.setState({mobile},()=>{
			if(!profile)this.createProfile();//档案不存在则创建自费档
			else this.bindProfile();//进行绑定操作
		})
	}
	cancelVerfied(mobile,verfied){
		baseUtil.goHome('profile cancelVerfied phone');
	}
	buildProfile(){
		const { medium,mobile,career } = this.state;
		var profile;
		if( medium == 'mi')profile = this.buildProfileByMi();
		if( medium == 'id')profile = this.buildProfileById();
		const p = {
			...profile,
			mobile,
			telephone:mobile,
			careerName:career.name,
			careerCode:career.code, 
		};
		log("建档-构建档案信息完毕",p);
		return p;
	}
	buildProfileByMi(){
	  const { mediumInfo } = this.state;
	  const { knsj, grbh, xm, xb, csrq, sfzh, cbsf, age, ye, bz, dw, rqlb,dwdm} = mediumInfo;
	  var gender = '3';
	  if('男' == xb)gender = '1';
	  if('女' == xb)gender = '2';
	  const profile={
		  miPatientNo:grbh,idNo:sfzh,
		  name:xm,gender:gender,sfzh,birthday:csrq, // idNo:sfzh,
		  address:dw,unitCode:'0000',medicalCardNo:'',miCardNo:knsj ,opentype:'1',
		  grbh,dwdm,knsj,
	  };
	  log("建档-根据医保卡构建档案信息");
	  return profile;
    }
	buildProfileById(){
	  const { mediumInfo } = this.state;
	  const {userName, sex, nation,birthday} = mediumInfo;
	  const {address,idNo,issuer,effectiveDate} = mediumInfo;
	  var gender = '3';
	  if('男' == sex)gender = '1';
	  if('女' == sex)gender = '2';
	  const profile={
	    name:userName,gender:gender,idNo:idNo,birthday:birthday,
	    address:address,unitCode:'0000',medicalCardNo:'',opentype:'1'
	    //nationality marriage nativePlace nation
      };
	  log("建档-根据身份证构建档案信息");
	  return profile;
    }
	createProfile(){
		var tempProfile = this.buildProfile();
		log('建档-创建空的自费档');
    	let fetch = Ajax.post("/api/ssm/treat/patient/profile/create",tempProfile,{catch: 3600});
		fetch.then(res => {
			log('mi建档-创建自费档返回 ',res);
			if(res && res.success){
				var profile = res.result||{};
				this.setState({profile},()=>{
					this.bindProfile();
				})
			}else if( res && res.msg ){
				baseUtil.error(res.msg);
	    	}else{
	    		baseUtil.error("创建档案失败");
	    	}
		}).catch((ex) =>{
			baseUtil.error("创建档案失败");
		})
    }
	bindProfile(){//绑定档案,绑定后可能病人换号更换 则需要重新查询档案信息
		const { profile,miProfile,medium,cardType } = this.state;
		const { relationCard,relationType } = profile;
		if(relationCard && relationType == '01'){//医保关联档 
			log('mi建档-存在医保关联档 ，不执行绑卡');
			this.queryPatientInfo(()=>{this.createOrder()});
		}else if(cardType == 'mi'){
			//完全信任前面的校验 如果操作介质是医保但是关联档不存在，则
			// 1 profile 为 自费档存在 绑定医保档 
			// 2 profile 为 新建自费档 医保档存在
			log('mi建档-不存在医保关联档，希望补社保关联下，需要绑卡');
			this.doBindProfile(()=>{
				this.queryPatientInfo(()=>{this.createOrder()});
			});
		}else{
			log('mi建档-不存在医保关联档，使用身份证介质，不绑卡');
			this.queryPatientInfo(()=>{this.createOrder()});
		}
		//重新查询信息
		
	}
	doBindProfile(callback){//方法是同步的
		const { profile,miProfile,mediumInfo } = this.state;
		const machine = baseUtil.getMachineInfo();
		const hisUser = machine.hisUser;
		const { medicalCardNo,relationCard,relationType } = profile;
		//如果医保档不存在，1 新建医保档 2 关联自费档  3 交换病人编号
		//如果医保档存在 1关联自费档 
		try{
			log('建档-绑定医保卡');
			if(relationCard && relationType == '01' ){
				log('建档-已经绑定过，不再绑定');//
				this.setState({profile},()=>{
					this.createIssueOrder();
				})				
				return;
			}
			const { grbh,dwdm,sfzh,knsj }  = mediumInfo;
			//1 自费卡号 2 操作者id 3 医保卡内数据 4 医保个人编号 5 医保单位代码 6 身份证号
			var req = "G^"+ medicalCardNo+"^"+ hisUser+"^"+ knsj+"^"+  grbh+"^"+ dwdm+"^"+sfzh+"^";
			var { data:bind } =  socket.SEND(req);
			log('mi建档-调用绑卡返回',bind);
			
			if(bind && bind.resultCode == 0){
				var result = bind.recMsg||{};
				if(result.state != '0'){
					if(result.cwxx){
						baseUtil.error(result.cwxx); 
						return;
					}else{
						baseUtil.error("无法绑定医保卡"); 
						return;
					}
				}
				if(callback)callback();
			}else{
				baseUtil.error("无法绑定医保卡"); 
			}
		}catch(e){
			log('绑定医保卡异常',e);
			baseUtil.error("绑定医保卡失败"); 
		}
	}
	createOrder(){
		const {idProfile,miProfile,relaProfile,operation,medium } = this.state;
		const profile = this.getCurrentOptProfile();
		
		const hasIdCard = this.isHasCard(idProfile);
		const hasRelaCard = this.isHasCard(relaProfile);
		
		const { relationCard,relationType } = profile||{};
		const orderProfile = (relationCard && relationType == '01')?miProfile:idProfile;
		console.info('createOrder ',orderProfile);
		this.setState({profile,orderProfile},()=>{
			if(operation == 'issue'){
				if(hasIdCard && !hasRelaCard){//已有自费，发医保卡
					this.checkIssueFeed();
				}else if(!hasIdCard && hasRelaCard){//绑卡不收费，跳到办理成功页面
					this.setState({step:5});
				}else if(hasIdCard && hasRelaCard){
					baseUtil.error('您已经办理过就诊卡，如果您的卡片丢失，请到补卡菜单操作');
				}else{
					this.checkIssueFeed();
				}
			}else if(operation == 'reissue'){
				this.createReIssueOrder(orderProfile);
			}
		})
	}
	checkIssueFeed(){
		/*if(this.checkIssueFeed){
			this.afterConsume();
		}else{
			this.createIssueOrder(orderProfile);
		}*/
		const { orderProfile } = this.state;
		this.createIssueOrder(orderProfile);
	}
	checkReIssueFeed(){
		/*if(this.checkReIssueFeed){
			this.afterConsume();
		}else{
			this.createReIssueOrder(orderProfile);
		}*/
		const { orderProfile } = this.state;
		this.createReIssueOrder(orderProfile);
	}
	createIssueOrder(orderProfile){
		log('建档-创建建档费订单',orderProfile);
		let fetch = Ajax.post("/api/ssm/treat/patient/card/order",orderProfile,{catch: 3600});
		fetch.then(res => {
			log('mi建档-创建建档费订单返回',res);
			if(res && res.success){
				var orders = res.result||{};
				var consumeOrder = orders.consume||{amt:0};
				var rechargeOrder = orders.recharge||{amt:0};
				log('mi建档-消费订单','id',consumeOrder.id,'orderNo',consumeOrder.orderNo,'amt',consumeOrder.amt);
				log('mi建档-充值订单','id',rechargeOrder.id,'orderNo',rechargeOrder.orderNo,'amt',rechargeOrder.amt);
				this.setState({consumeOrder,rechargeOrder,step:4});
			}else if( res && res.msg ){
				baseUtil.error(res.msg);
	    	}else{
	    		baseUtil.error("创建建档费订单失败");
	    	}
		}).catch((ex) =>{
			baseUtil.error("无法创建档卡费订单");
		})
	}
	createReIssueOrder(orderProfile){
		log('建档-创建补卡费订单',orderProfile);
		let fetch = Ajax.post("/api/ssm/treat/patient/card/order/reissue",orderProfile,{catch: 3600});
		fetch.then(res => {
			log('建档-创建补卡费订单返回',res);
			if(res && res.success){
				var orders = res.result||{};
				var consumeOrder = orders.consume||{amt:0};
				var rechargeOrder = orders.recharge||{amt:0};
				log('mi建档-消费订单','id',consumeOrder.id,'orderNo',consumeOrder.orderNo,'amt',consumeOrder.amt);
				log('mi建档-充值订单','id',rechargeOrder.id,'orderNo',rechargeOrder.orderNo,'amt',rechargeOrder.amt);
				this.setState({consumeOrder,rechargeOrder,step:4});
			}else if( res && res.msg ){
				baseUtil.error(res.msg);
	    	}else{
	    		baseUtil.error("创建补卡费订单失败");
	    	}
		}).catch((ex) =>{
			baseUtil.error("无法创建补卡费订单");
		})
	}
	cancelConsume(){
		baseUtil.goHome('profile cancelConsume');
	}
	afterConsume(rechargeOrder,consumeOrder){
		log('建档-支付完毕,准备制卡');
		const { profile,orderProfile,operation } = this.state;
		const hasCard = this.isHasCard(profile);
		
		log('建档--重新加载收费档案信息',orderProfile);
		let fetch = Ajax.post("/api/ssm/treat/patient/login", orderProfile, {catch: 3600});
		fetch.then(res => {
			let patient = res.result||{};
	    	return patient;
		}).then((patient)=>{
			log('建档--重新加载患者信息结果',patient);
			if(hasCard && operation=='issue'){
				this.setState({orderProfile:patient,step:5,rechargeOrder,consumeOrder});
			}else{
				this.setState({orderProfile:patient,rechargeOrder,consumeOrder,showPrintWin:true,printMsg:'正在制卡，请勿离开'},()=>{
					setTimeout(()=>{
						this.issueCard(false);
					},200);
				});
			}
		}).catch((ex) =>{
			log('frame-重新加载患者信息异常!',ex); 
			baseUtil.error('加载患者信息异常!');
			return;
		})
	}
	cardErrorHandler(retry,msg){
		if(retry){
			baseUtil.error(msg);
			try{
				lightUtil.cardPrinter.turnOff();
			}catch(e){
				log('建档-关灯失败')
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
		const { profile } = this.state;
		try{
			lightUtil.cardPrinter.blink();
		}catch(e){
			log('建档-闪灯异常');
		}
		if(retry){// 尝试排卡
			try{
				cardPrinter.moveToBasket();
			}catch(e){
				this.cardErrorHandler(true,'无法排卡，请联系运维人员');
				return;
			}
			try{// 尝试重启
				cardPrinter.reset();
			}catch(e){
				this.cardErrorHandler(true,'无法重启打印机，请联系运维人员');
				return;
			}
		}
    	try{
    		const state  = cardPrinter.checkPrinterStatus();
    		if(state == 0){
    			log('建档-当前状态'+state);
	    	}else{
	    		log('建档-证卡打印机状态异常');
	    		this.cardErrorHandler(retry,'打印机状态错误，请联系运维人员');// 1 状态错误 重新制卡
	    		return;
	    	}
		}catch(e){
			log('建档-无法读取打印机状态');
			this.cardErrorHandler(retry,'无法读取打印机状态，请联系运维人员');// 1 状态错误 重新制卡
    		return;
		} 
    	try{
    		cardPrinter.moveToReader();
    		log('建档-移动至非接读卡区成功');
		}catch(e){
			log('建档-移动至非接读卡区异常');
			this.cardErrorHandler(retry,'移动至非接读卡区异常,请更换自助机');// 2 移动至非接错误 重新制卡
			return;
		} 
		var medicalCardNo = null;
		try{
    		medicalCardNo  = cardPrinter.readCardNo();
    		log('建档-读取卡号成功：'+medicalCardNo);
		}catch(e){
			log('建档-读取卡号异常');
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
			log('建档-设置基本参数成功');
		}catch(e){
			log('建档-设置基本参数异常');
			this.cardErrorHandler(retry,'设置基本参数异常,请更换自助机');// 5 设置参数错误  重新制卡
			return;
		}
		log('建档-准备绑卡，卡号： ',medicalCardNo);
		let fetch = Ajax.post("/api/ssm/treat/patient/card/issue",{...profile,medicalCardNo},{catch: 3600});
		fetch.then(res => {
			if(res && res.success){
				var bindedProfile = res.result||{};
				log('建档-绑卡完毕');
				this.printCard(bindedProfile);
				try{
					baseUtil.speak('card_tackMdeicalCard');// 
					lightUtil.cardPrinter.turnOff();
				}catch(e){
					log('建档-关灯失败');
				}
				this.setState({showPrintWin:false,printMsg:'',step:5});
			}else if( res && res.msg ){
				this.cardErrorHandler(retry,res.msg);
	    	}else{
	    		this.cardErrorHandler(retry,'绑定卡异常,请更换自助机');//  6  可能卡号被占用 重新制卡
	    	}
		}).catch((ex) =>{
			this.cardErrorHandler(retry,'绑定卡异常,请更换自助机');//  6  可能卡号被占用 重新制卡
		})
	}
	printCard(profile){
		try{//如果有关联医保卡号，打医保卡号
			const {idProfile,miProfile} = this.state;
			const {relationCard,relationType,name,no} = profile;
			
			var type='',patientNo = no ;
			if(idProfile && miProfile){
				type = (relationCard && relationType == '01')?"医保":'自费';
				patientNo = miProfile.no;//历史数据 获取医保档病人办好，其他数据则为绑定，绑定后的病人编号为准
			}
			cardPrinter.printCard(name,patientNo,type);
		}catch(e){
			log('建档-发送打印指令异常',e);
			this.cardErrorHandler(true,'发送打印指令异常,请更换自助机');// 6 发送打印指令异常  不重新制卡
			return;
		}
		baseUtil.speak('card_tackMdeicalCard');// 
		try{
			lightUtil.cardPrinter.turnOn();
		}catch(e){
			log('建档-开灯异常');
		} 
		try{
			lightUtil.cardPrinter.turnOff();
		}catch(e){
			log('建档-关灯异常');
		} 
	}
	render () { 
		var  width = document.body.clientWidth - 48;
		var  careerWidth = width - 36;
		var  modalWinTop  = 13;
		const { step,medium,operation,profile,career,mediumInfo,orderProfile } = this.state;
		return (
		  <div>
		  {
		  	step == 1?(//1 读取介质
		  	  <ReadMedium  medium={medium} afterRead={this.afterReadMedium}/>
		  	):null	
		  }
		  {
		  	step == 2?(//1 读取介质
		  	  <SelectCard onSelect={this.onSelectCardType}/>
		  	):null	
		  }
		  {
		  	step == 3?(//校验手机号码
  			  <CheckPhone 
		  	  	profile ={profile}
  			  	career={career}
  			  	mediumInfo = {mediumInfo}
		  	  	type={operation == 'issue'?'REG':'REP'}
		  	  	afterVerfied={this.afterVerfiedPhone} 
		  	  	cancelVerfied={this.cancelVerfied}/>
		  	):null	
		  }
		  {
		  	step == 4?(//收费
  			  <PayCardFee 
		  	  	patient={this.state.orderProfile} 
  			  	rechargeOrder={this.state.rechargeOrder}
  			  	consumeOrder={this.state.consumeOrder}
		  	  	afterPay={this.afterConsume} 
		  	  	cancelPay={this.cancelConsume} />	
		  	):null	
		  }
		  {
		  	step == 5?(//发卡完毕需要打印缴费明细 
		  		<ProfileDone 
		  			type = {operation} 
		  			profile = {orderProfile} 
		  			consumeOrder={this.state.consumeOrder}
		  			rechargeOrder={this.state.rechargeOrder}
		  			/>
		  	):null	
		  }
		  <Modal visible = {this.state.showCareerModal} closable = {false} footer = {null} width = {careerWidth + 'px'} style = {{top: modalWinTop + 'rem'}} >
		    <div>
			  <Career width = {careerWidth - 32} onSelectCareer={this.onSelectCareer} />
		    </div>
		  </Modal>
		  <PrintWin msg={this.state.printMsg} visible={this.state.showPrintWin} />
		  </div>
	    );
	}
}

module.exports = Page;