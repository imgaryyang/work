import dva from 'dva';
import { patientInfo,patientLogin,profileCreate,openDeposit,cardIssue,bindMiCard,patientLoginInfo } from '../../services/PatientService';
import {sendAuthCode,verifyAuthCode} from '../../services/SMSService';
import printUtil from '../../utils/printUtil';
import baseUtil from '../../utils/baseUtil';
import medicalCard  from '../../utils/newMedicalCardUtil';
import miCard  from '../../utils/miCardUtil';
import idCard  from '../../utils/idCardUtil';
import cardPrinter  from '../../utils/cardPrinterUtil';
import lightUtil from '../../utils/lightUtil';
import eventUtil from '../../utils/eventUtil';
export default {

	namespace: 'patient',

	state: {
		baseInfo : {},
		idCardInfo : {},
		medicalCardInfo : {},
		miCardInfo : {},
		msg:{},
		profile:{},
//		cardPrinterStatus:'closed',
	},

	subscriptions: {
		payEvent({dispatch, history }) {//支付事件监听
			eventUtil.addListener("model","afterPay",function(){
				console.info('支付完成触发事件 ');
				dispatch({type: 'reloadPatientInfo'});
			});
			eventUtil.addListener("model","afterConsume",function(){
				console.info('扣款完成触发事件 ');
				dispatch({type: 'reloadPatientInfo'});
			});
		},
		miCardEvent({dispatch, history }) {//社保卡事件监听
			miCard.on("cardPushed",function(eventKey,cardInfo){//监听插卡事件
				console.info('miCardPushed',cardInfo);
				dispatch({type: 'changeState',
					payload:{miCardInfo:{state:'in'}}
				});
			});
			miCard.on("cardReaded",function(eventKey,cardInfo){//监听插卡事件
				console.info('cardReaded',cardInfo);
				dispatch({type: 'changeState',
					payload:{miCardInfo:{...cardInfo,state:'in'}}
				});
			});
			miCard.on("cardPoped",function(eventKey,cardInfo){//监听弹卡事件
				dispatch({type: 'changeState',
					payload:{miCardInfo:{}}
				});
			});
		},
		medicalCardEvent({dispatch, history }) {//就诊卡事件监听
			medicalCard.on("cardPushed",function(eventKey,cardInfo){//监听插卡事件
				// cardInfo = {cardNo : '00010061489567064610'}//TODO 
				console.info('medicalCardPushed');
				dispatch({type: 'setState',
					payload:{medicalCardInfo:cardInfo},
					callback:()=>{
						dispatch({type: 'login'});
					}
				});
			});
			medicalCard.on("cardPoped",function(eventKey,cardInfo){//监听弹卡事件
				dispatch({type: 'changeState',
					payload:{medicalCardInfo:{}}
				});
			});
			medicalCard.listenCard();
		},
		idCardEvent({dispatch, history }) {// 身份证事件监听
			idCard.on("cardPuted",function(eventKey,cardInfo){//监听插卡事件
				console.info('idCardEvent',cardInfo);
				dispatch({type: 'changeState',
					payload:{idCardInfo:cardInfo}
				});
			});
		},
		closeCardPrinter({dispatch, history }) {// 关闭证卡打印机后端吸卡
			 cardPrinter.closeCardBackIn();  
		},
	},
	effects: {
		*listenLoginCard({ payload }, { select, call, put }) {
			const baseInfo = yield select(state => state.patient.baseInfo);
			if(!baseInfo.cardNo){
				baseUtil.speak('card_insertMedicalCard');// 播放语音：请插入您的医保卡或社保卡
				medicalCard.open();
			}
		},
		*listenMiCard({ payload }, { select, call, put }) {
			baseUtil.speak('card_pushMiCard');// 播放语音：请插入您的社保卡
			yield baseUtil.sleep(2500);
			try{
				miCard.listenCard();//开始监听社保卡
			}catch(e){
				console.info(e);
			}
			console.info('listenMiCard');
		},
		*readMiCard({ payload }, { select, call, put }) {
			const { type } = payload;
			const machine = yield select(state => state.frame.machine);
			try{
				miCard.readCard( type , machine.hisUser );//开始监听社保卡
			}catch(e){
				console.info(e);
			}
		},
		*listenAndReadMiCard({ payload }, { select, call, put }) {
			baseUtil.speak('card_pushMiCard');// 播放语音：请插入您的社保卡
			yield baseUtil.sleep(2500);
			try{
				miCard.listenAndReadCard();//开始监听社保卡
			}catch(e){
				console.info(e);
			}
			console.info('listenMiCard');
		},
		*listenMiOrIdCard({ payload }, { select, call, put }) {
			yield put({type: 'changeState',payload: {//重新读取，清空身份证信息
  				idCardInfo:{},
  				miCardInfo:{}
  			}});
			baseUtil.speak('card_putIdCardOrMiCard');// TODO 
			try{
				idCard.listenCard();//开始监听身份证
			}catch(e){
				console.info(e);
			};
			try{
				miCard.listenCard();//开始监听社保卡
			}catch(e){
				console.info(e);
			}
		},
		*listenIdCard({ payload }, { select, call, put }) {
			yield put({type: 'changeState',payload: {//重新读取，清空身份证信息
  				idCardInfo:{}
  			}});
			baseUtil.speak('card_putIdCard');// 播放语音：请将您的身份证放置到身份证读卡器
			try{
				idCard.listenCard();//开始监听身份证
			}catch(e){
				console.info(e);
			}
		},
		*listenAccountByIdCard({ payload }, { select, call, put }) {
			yield put({type: 'changeState',payload: {//重新读取，清空身份证信息
  				idCardInfo:{}
  			}});
			baseUtil.speak('card_putAcctHolder');// 播放语音：请将您的身份证放置到身份证读卡器
			try{
				idCard.listenCard();//开始监听身份证
			}catch(e){
				console.info(e);
			}
		},
		*sendAuthCode({ payload }, { select, call, put }) {
			 var {data} = yield call(sendAuthCode,payload.msg);
			 var sended =(data && data.success )?true:false;
			 if(sended){
				 yield put({ type: 'changeState', payload: { msg : data.result,},});
				 // baseUtil.notice( data.result.code);//TODO 
			 }else{
				 var msg = "无法发送校验码，请检查您的手机号";// data.msg||
				 baseUtil.error(msg); 
			 }
			 if( payload.callback)payload.callback(sended);
		},
		*checkAuthCode({ payload }, { select, call, put }) {
			var {data} = yield call(verifyAuthCode,payload.msg);
			var verified =(data && data.success );
			if(!verified){
				 var msg = "校验码错误";//data.msg||
				 baseUtil.notice(msg); 
			}
			if(payload.callback){
				payload.callback(verified);
			 }
		},
		*createProfile({ payload,callback }, { select, call, put }) {
			const { profile } = payload;console.info('createProfile ',profile);
			const { miPatientNo } = profile;
			var {data} = yield call(profileCreate,profile);
			if(!( data && data.success )){
				baseUtil.error("创建患者档案失败"); 
				return;
			}
			console.info('建档成功 ',data.result);
			var result = data.result||{};
			if(!result.miPatientNo)result.miPatientNo = miPatientNo;
			yield put({
	  			type: 'changeState',
	  			payload: {
	  				baseInfo : result,
	  			},
	  		})
			if(callback)callback(result);
		},
		*bindMiCard({ payload,callback }, { select, call, put }) {
			const baseInfo = yield select(state => state.patient.baseInfo);
			const miCardInfo = yield select(state => state.patient.miCardInfo);
			const machine = yield select(state => state.frame.machine);
			var param = {
			  medicalCardNo :baseInfo.medicalCardNo,
			  hisUser:machine.hisUser,
			  knsj:miCardInfo.knsj,
			  grbh:miCardInfo.grbh,
			  dwdm:miCardInfo.dwdm,
			  relationCard:baseInfo.relationCard,
			  relationType:baseInfo.relationType,
			  sfzh:miCardInfo.sfzh,
			}
			try{
				console.info('调用绑卡函数',bindMiCard,param);
				const {data:bind} = bindMiCard(param);
				console.info('调用绑卡返回',bind);
				if(bind && bind.resultCode == 0){
					var result = bind.recMsg||{};
					if(result.state =! '0'){
						if(result.cwxx){
							baseUtil.error(result.cwxx); 
							return;
						}else{
							baseUtil.error("无法绑定医保卡"); 
							return;
						}
					}
					console.info('绑卡完毕重新加载   ',baseInfo);
					const {data} = yield call(patientInfo,baseInfo);
			    	console.info('绑卡完毕重新加载patient  ',data);
			    	if (data && data.success && data.result ) {
			    		var info = data.result||{};
			    		if(!info.miPatientNo)info.miPatientNo= baseInfo.miPatientNo;
			    		yield put({
				  			type: 'setState',
				  			payload: {
				  				baseInfo : info,
				  			},
				  		});
			    		if(callback)callback(data.result);
			    	}
				}
			}catch(e){
				console.info(e);
				baseUtil.error("绑定医保卡失败"); 
			}
		},
		//查询证卡打印机是否有卡
		*cardPrinterState({ payload,callback }, { select, call, put }) {
			yield call(baseUtil.sleep,500);
			var state  = cardPrinter.checkPrinterStatus();
			console.info('证卡打印机当前状态'+state);
			if(state == '0'){
				if(callback)callback(true);
				return;
			}
			console.info('证卡打印机尝试重启');
			yield call(cardPrinter.reset);
			console.info('证卡打印机重启成功');
			state  = cardPrinter.checkPrinterStatus();
			console.info('证卡打印机重启状态'+state);
			if(state == '0'){
				if(callback)callback(true);
				return;
			}
			if(callback)callback(false);
			baseUtil.error("发卡机异常,请联系工作人员或更换自助机");
		},
		*prepareCardPrinter({ payload,callback }, { select, call, put }){
			yield call(cardPrinter.moveToReader);
			var medicalCardNo  = yield call(cardPrinter.readCardNo);
			yield call(cardPrinter.setStandbyParameter);
		},
		*printCard({ payload,callback }, { select, call, put }){
			const { patient } = payload;
			yield call(cardPrinter.printCard,patient.name,patient.no);
			yield call(cardPrinter.moveToEntrance);
		},
		*issueCard({ payload,callback }, { select, call, put }) {
			const { patient } = payload;
			const { miPatientNo } = patient;
			console.info('打印 ： ' , patient);
			try{
				lightUtil.cardPrinter.blink();
				yield call(baseUtil.sleep,500);
			}catch(e){
				console.info('闪灯异常');
			} 
	    	try{
	    		const state  = yield call(cardPrinter.checkPrinterStatus);
	    		if(state == 0){
	    			console.info('当前状态'+state);
	    			yield call(baseUtil.sleep,500);
		    	}else{
		    		console.info('证卡打印机状态异常');
		    		if(callback)callback(false,true);// 1 状态错误 重新制卡
		    		return;
		    	}
			}catch(e){
				console.info('无法读取打印机状态');
	    		if(callback)callback(false,true);// 1 状态错误 重新制卡
	    		return;
			} 
	    	try{
	    		yield call(cardPrinter.moveToReader);
	    		console.info('移动至非接读卡区成功');
	    		yield call(baseUtil.sleep,500);
			}catch(e){
				console.info('移动至非接读卡区异常');
				if(callback)callback(false,true);// 2 移动至非接错误 重新制卡
				return;
			} 
			var medicalCardNo = null;
			try{
	    		medicalCardNo  = yield call(cardPrinter.readCardNo);
	    		console.info('读取卡号成功：'+medicalCardNo);
	    		yield call(baseUtil.sleep,500);
			}catch(e){
				console.info('读取卡号异常');
				if(callback)callback(false,true);// 3 读卡错误  重新制卡
				return;
			}
			if(!medicalCardNo){
				lightUtil.cardPrinter.turnOff();
				if(callback)callback(false,true);// 4 卡号错误  重新制卡
				return;
			}
			try{
				yield call(cardPrinter.setStandbyParameter);
				console.info('设置基本参数成功');
				yield call(baseUtil.sleep,500);
			}catch(e){
				console.info('设置基本参数异常');
				if(callback)callback(false,true);// 5 设置参数错误  重新制卡
				return;
			}
			console.info("准备绑卡，卡号： ",medicalCardNo);
			var {data} = yield call(cardIssue,{...patient,medicalCardNo});
			if(!( data && data.success )){ 
				baseUtil.error("绑定卡异常,请更换自助机");
				lightUtil.cardPrinter.turnOff();
				if(callback)callback(false,true);//  6  可能卡号被占用 重新制卡
				return;
			}
			console.info("绑卡完毕");
			var baseInfo = data.result;
			
			try{//如果有关联医保卡号，打医保卡号
				var type = miPatientNo?"医保":'自费';
				yield call(cardPrinter.printCard,baseInfo.name,miPatientNo || baseInfo.no,type);
			}catch(e){
				console.info(e);
				baseUtil.error('无法打印,请联系工作人员');
				if(callback)callback(false,false);// 6 发送打印指令异常  不重新制卡
				return;
			}
			//console.info('发送打印指令成功，沉睡2s');
			//yield call(baseUtil.sleep,2000);
			baseUtil.speak('card_tackMdeicalCard');// 
			try{
				lightUtil.cardPrinter.turnOn();
			}catch(e){
				console.info('开灯异常');
			} 
			yield put({
	  			type: 'changeState',
	  			payload: {
	  				baseInfo : patient,
	  			},
	  		});			
			try{
				lightUtil.cardPrinter.turnOff();
			}catch(e){
				console.info('关灯异常');
			} 
			if(callback)callback(true);
		},
		*reIssueCard({ payload,callback,retry }, { select, call, put }) {
			const { patient } = payload;
			const { miPatientNo } = patient;
			console.info('打印 ： ' , patient);
			try{
				lightUtil.cardPrinter.blink();
				yield call(baseUtil.sleep,500);
			}catch(e){
				console.info('闪灯异常');
			} 
			
			// 尝试排卡
			try{
				yield call(cardPrinter.moveToBasket);
			}catch(e){
				baseUtil.error('无法排卡，请联系运维人员');
				if(callback)callback(false);
				return;
			}
			// 尝试重启
			try{
				yield call(cardPrinter.reset);
			}catch(e){
				baseUtil.error('无法重启打印机，请联系运维人员');
				if(callback)callback(false);
				return;
			}
	    	try{
	    		const state  = yield call(cardPrinter.checkPrinterStatus);
	    		if(state == 0){
	    			console.info('当前状态'+state);
	    			yield call(baseUtil.sleep,500);
		    	}else{
		    		baseUtil.error('打印机状态错误，请联系运维人员');
		    		if(callback)callback(false);
		    		return;
		    	}
			}catch(e){
				baseUtil.error('无法读取打印机状态，请联系运维人员');
				if(callback)callback(false);
	    		return;
			} 
	    	try{
	    		yield call(cardPrinter.moveToReader);
	    		console.info('移动至非接读卡区成功');
	    		yield call(baseUtil.sleep,500);
			}catch(e){
				baseUtil.error('移动至非接读卡区异常,请更换自助机');
				if(callback)callback(false);
				return;
			} 
			var medicalCardNo = null;
			try{
	    		medicalCardNo  = yield call(cardPrinter.readCardNo);
	    		console.info('读取卡号成功：'+medicalCardNo);
	    		yield call(baseUtil.sleep,500);
			}catch(e){
				baseUtil.error('读取卡号异常,请更换自助机');
				if(callback)callback(false);
				return;
			}
			if(!medicalCardNo){
				baseUtil.error("无效卡片,请更换自助机");
				lightUtil.cardPrinter.turnOff();
				if(callback)callback(false);
				return;
			}
			try{
				yield call(cardPrinter.setStandbyParameter);
				console.info('设置基本参数成功');
				yield call(baseUtil.sleep,500);
			}catch(e){
				baseUtil.error('设置基本参数异常,请更换自助机');
				if(callback)callback(false);
				return;
			}
			
			console.info("准备绑卡，卡号： ",medicalCardNo);
			var {data} = yield call(cardIssue,{...patient,medicalCardNo});
			if(!( data && data.success )){ 
				baseUtil.error("绑定卡异常,请更换自助机");
				lightUtil.cardPrinter.turnOff();
				if(callback)callback(false);
				return;
			}
			var baseInfo = data.result;
			
			try{//如果有关联医保卡号，打医保卡号
				var type = miPatientNo?"医保":'自费';
				yield call(cardPrinter.printCard,baseInfo.name,miPatientNo || baseInfo.no,type);
			}catch(e){
				baseUtil.error('发送打印指令异常,请更换自助机');
				if(callback)callback(false);
				return;
			}
			console.info('发送打印指令成功，沉睡3.5s');
			yield call(baseUtil.sleep,3500);
			baseUtil.speak('card_tackMdeicalCard');// 
			try{
				lightUtil.cardPrinter.turnOn();
			}catch(e){
				console.info('开灯异常');
			} 
			yield put({
	  			type: 'changeState',
	  			payload: {
	  				baseInfo : patient,
	  			},
	  		});			
			try{
				lightUtil.cardPrinter.turnOff();
			}catch(e){
				console.info('关灯异常');
			} 
			if(callback)callback(true);
		},
		*printDoCardFees({ payload,callback }, { select, call, put }){
			//打印办卡凭条
			try{
				const { consume,baseInfo,machine } = payload;
				console.info("consume=",consume);
				console.info("baseInfo=",baseInfo);
				console.info("machine=",machine);
				printUtil.printDoCardFees(consume.order,baseInfo,machine);
			}catch(e){
				console.info(e);
				baseUtil.error("打印机异常，打印办卡凭证失败"); 
			}
		},
		*printMakeUpCardFees({ payload,callback }, { select, call, put }){
			//打印补卡凭条
			try{
				const { consume,baseInfo,machine } = payload;
				console.info("打印补卡凭条,consume : ",consume);
				console.info("打印补卡凭条,baseInfo : ",baseInfo);
				console.info("打印补卡凭条,machine : ",machine);
				printUtil.printMakeUpCardFees(consume.order,baseInfo,machine);
			}catch(e){
				console.info(e);
				baseUtil.error("打印机异常，打印补卡凭证失败"); 
			}
		},
	    *loadPatientInfo ({ payload,callback }, { select, call, put }) {//载入基本信息
			var { miPatientNo } = payload.patient;
			console.info('loadPatientInfo : ',miPatientNo)
	    	const {data} = yield call(patientInfo,payload.patient);
	    	if (data && data.success) {
	    		var result = data.result || {}; 
	    		console.info('loadPatientInfo : ',result.miPatientNo)
	    		if(!result.miPatientNo)result.miPatientNo = miPatientNo;
	    		yield put({
		  			type: 'changeState',
		  			payload: {
		  				baseInfo : result,
		  			},
		  		});
	    		if(callback)callback(result);
	    	}else if( data && data.msg ){
	    		baseUtil.error(data.msg +',请到窗口查询!'); 
	    	}else{
	    		baseUtil.error('查询患者信息失败'); 
	    	}
	    },
	    *reloadPatientInfo ({ payload,callback }, { select, call, put }) {//载入基本信息
	    	const baseInfo = yield select(state => state.patient.baseInfo);
	    	var { miPatientNo } = baseInfo; 
	    	
	    	var f = baseInfo.unitCode == '0000'?patientInfo:patientLoginInfo;
	    	const {data} = yield call(f,baseInfo);
	    	if (data && data.success && data.result ) {
	    		var result = data.result ||{};
	    		if(!result.miPatientNo)result.miPatientNo = miPatientNo;
	    		yield put({
		  			type: 'changeState',
		  			payload: {
		  				baseInfo : result,
		  			},
		  		});
	    		if(callback)callback(data.result);
	    	}else {
	    		if(callback)callback({});
	    	}
	    },
	    *checkPatientExist( payload,callback ){
	    	const {data} = yield call(patientInfo,payload.patient);
	    	if(callback)callback(data.result);
	    },
	    *login ({ payload }, { select, call, put }) {//患者登录获取基本信息，包含账户信息
	    	const myState = yield select(state => state.patient);
	    	const {medicalCardInfo,miCardInfo} = myState;
	    	
	    	const medicalCardNo = medicalCardInfo.cardNo;
	    	const miCardNo = miCardInfo.cardNo;
	    	let   medium = 'other';
	    	console.info('准备登录  ','medicalCardNo',medicalCardNo,'miCardNo',miCardNo);
	    	const loginInfo = {
	    			medicalCardNo:medicalCardNo,
	    			miCardNo:miCardNo
	    	}
	    	try{
	    	/**
	    	 * 所有外设在读取完数据后均会停止监听，无需关心循环关闭问题
	    	 */
	    	if(medicalCardNo){//就诊卡登录（吞卡式），无需继续监听
	    		console.info('就诊卡登录');
	    		medium = 'medicalCard';
	    		miCard.safeClose();//关闭社保卡读卡器  medicalCard.stopListenCard();//停止监听诊疗卡
	    	}else if(miCardNo){//社保卡登录（插卡式），继续监听社保卡，如果取走卡片，停止业务跳转首页
	    		//console.info('社保卡登录');
	    		//medium = 'miCard';//medicalCard.stopListenCard();//停止监听诊疗卡
	    		//miCard.listenCardLeave();//重启社保卡监听，如果中途取走卡片，停止业务跳转首页
	    	}}catch(e){baseUtil.error('患者身份识别失败！')}
	    	
	    	const {data} = yield call(patientLogin,loginInfo);
	    	if (data && data.success ) {
	    		let baseInfo = {...data.result,medium:medium};
	    		baseInfo.cardType = baseInfo.cardType || medium;
	    		console.info('登录 结果 ',baseInfo);
	    		yield put({
		  			type: 'changeState',
		  			payload: {
		  				baseInfo : baseInfo,
		  			},
		  		})
	    	}else{//TODO 提示登录失败 需要建档
	    		baseUtil.error('未认证患者！')
	    	}
	    },
	    *logout ({ payload }, { select, call, put }) {//退出
	    	console.info('退出登录');
	    	try{
	    		medicalCard.safeClose();//关闭设备
	    		// miCard.safeClose();//关闭设备
	    		yield put({type: 'changeState',payload: {
		  				baseInfo:{},
		  				account: {},
		  				idCardInfo : {},
		  				medicalCardInfo : {},
		  				miCardInfo : {},
		  				profile:{},
	    		}})
	    	}catch(e){
	    		console.info(e);
	    	}
	    },
	    *closeDevice ({ payload }, { select, call, put }) {//关闭设备
	    	const { device } = payload;
	    	if( device == 'idCard' ){
	    		idCard.close();
	    	}else if( device  == 'miCard' ){
	    		miCard.safeClose()
	    	}else if( device  == 'medicalCard' ){
	    		medicalCard.safeClose()
	    	}
	    },
	    *openDeposit ({ payload }, { select, call, put }) {//开通预存
	    	const {data} = yield call(openDeposit);
	    	if (data && data.success ) {
	    		yield put({
		  			type: 'changeState',
		  			payload: {
		  				account: data.result
		  			},
		  		})
	    	}
	    },
	    *reset ({ payload }, { select, call, put }) {//开通预存
	    	const myState = yield select(state => state.patient);
	    	const { baseInfo,medicalCardInfo} =  myState;
	    	idCard.close();
	    	miCard.safeClose()
	    	
	    	var dft = {
  				baseInfo : baseInfo,
				idCardInfo : {},
				medicalCardInfo : medicalCardInfo,
				miCardInfo : {},
				msg:{},
				profile:{},
  			}
	    	if(!medicalCardInfo.cardNo){//只有有就诊卡信息时才认为是登录状态
	    		medicalCard.safeClose();
	    		dft.medicalCardInfo={};
	    		dft.baseInfo={};
	    	}
	    	yield put({
	  			type: 'changeState',
	  			payload: dft,
	  		})
		},
		*setState({ payload ,callback}, { select, call, put }) {
	    	yield put({
    			type: 'changeState',
    			payload: payload
    		});
	    	if(callback)callback();
		},
	},

	//处理state
	reducers: {
		"changeState"(state,{ payload}) {
			return {...state,...payload};
		},
	},
};

//yield put({type: 'setAuthCodeInfo',payload: {
//	 sended:sended
//}});
//setAuthCodeInfo (state, {payload}) {
//	var authCodeInfo = {...state.authCodeInfo,...payload};
//	return { ...state, authCodeInfo:authCodeInfo,};
//},
//*syncReadIdCard({ payload }, { select, call, put }) {
//	baseUtil.speak('card_putIdCard');// 播放语音：请将您的身份证放置到身份证读卡器
//	try{
//		const cardInfo = yield call(idCard.syncReadAllInfo,30*1000);
//	}catch(e){
//		console.info(e);
//	}
//},