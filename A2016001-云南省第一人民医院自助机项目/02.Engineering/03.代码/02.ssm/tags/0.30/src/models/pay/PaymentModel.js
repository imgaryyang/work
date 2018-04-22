import dva from 'dva';
import { preCreate, unionPayCallback,cashPayCallback,balancePayCallback,showQrCode,getSettlement} from '../../services/PaymentService';
import { cashRecharge } from '../../services/DepositService';
import moment from 'moment';
import baseUtil from '../../utils/baseUtil';
import cashBoxUtil  from '../../utils/cashBoxUtil';
import unionPayUtil from '../../utils/unionPayUtil';
import lightUtil from '../../utils/lightUtil';
import eventUtil from '../../utils/eventUtil';
export default {

	namespace: 'payment',

	state: {
		order: {
			amt:0
		},
		settlement : {
			amt:0
		},
		payChannel:null,
		payType:null,
		unionpay   : {
			inited:false,
			cardReaded:false,
			pinReaded:false,
			payed:false,
			closed:false,
			password:"",
		},
		alipay     : {
			
		},
		cash     : {
			busy : false,
			error:false,
		},
		wxpay      : {
			
		},
		limit:0,
	},

	//订阅
	subscriptions: {
		cashBoxEvent({dispatch, history }) { 
			cashBoxUtil.on("cashPushed",function(eventKey,amt){ 
				console.info('cashPushed : '+ amt);
				dispatch({type: 'cashPay', payload:{amt:amt}});
			});
			cashBoxUtil.on("cashError",function(msg){ 
				//baseUtil.notice('钱箱异常:'+msg);// 播放语音 ,
				dispatch({type: 'setCash', payload:{error:true}});
			});
			cashBoxUtil.on("retry",function(eventKey,amt){ 
				dispatch({type: 'setCash', payload:{busy:false}});
			});
			cashBoxUtil.on("accept",function(eventKey,amt){ 
				dispatch({type: 'setCash', payload:{busy:true}});
			});
		},
		unpionPayEvent({dispatch, history }) {//订阅银联外设事件
			unionPayUtil.on("cardPushed",function(eventKey,cardInfo){
				dispatch({type: 'unionPayCardPushed',payload:{cardInfo:cardInfo}});//插入卡后读卡
			});
			unionPayUtil.on("cardClosed",function(eventKey,cardInfo){//关闭卡
				dispatch({ type: 'setUnionpay', payload:{closed:true}});
			});
			unionPayUtil.on("pinCountChange",function(eventKey,{pinCount}){
				var value="",i=0;
				for(i=0;i<pinCount;i++){value+="*"}
				dispatch({ type: 'setUnionpay', payload:{password:value,}});
			});
			unionPayUtil.on("pinReaded",function(eventKey){
				dispatch({type: 'unionPay'});//读取密码结束，进行交易
			});
			unionPayUtil.on("pinTimeOut",function(eventKey){
				dispatch({type: 'setUnionpay', payload:{pinTimeOut:true,}});
			});	
		}
	},

	//远程请求
	effects: {
		*listenCashBox({ payload,callback }, { select, call, put }) {
			console.info('start listenCashBox ');
			try{
				baseUtil.speak('pay_pushCash');// 播放语音
				lightUtil.cash.blink();
			}catch(e){
				console.info(e);
			}
			try{
				cashBoxUtil.listenCash();
				if(callback)callback();
			}catch(e){
				console.info(e);
				baseUtil.error('钱箱错误，请更换自助机');
			}
			console.info('listenCashBox');
		},
		*initUnionPay({ payload }, { select, call, put }) {
			baseUtil.speak('unionpay_checkEnv');// 播放语音 ,
			yield put({//初始化状态
				type: 'setUnionpay',
				payload: {
				  inited:false,
				  cardReaded:false,
				  pinReaded:false,
				  pinTimeOut:false,
				  payed:false,
				  password:"",
				}
			})
			
			yield baseUtil.sleep(1500);
			try{
				var result = yield call(unionPayUtil.initEnv);//初始化
				yield put({type: 'setUnionpay',payload: {inited:true,}})
				
		    	if(!(result && result.cardExist)){//卡不存在,语音提示
		    		baseUtil.speak('unionpay_insertCard');
		    		lightUtil.bankCard.blink();
		    		yield baseUtil.sleep(3500);
		    	}
		    	yield call(unionPayUtil.listenCard);//开始监听
			}catch(e){
				unionPayUtil.safeClose();
				console.info(e);
			}
			console.info('listenUnionPayCard');
		},
		*unionPayCardPushed({ payload }, { select, call, put }) {
			yield put({type: 'setUnionpay',payload: {inited:true,cardReaded:true}});
			baseUtil.speak('unionpay_enterPass');// 播放语音
			try{
				unionPayUtil.listenPin();
			}catch(e){
				unionPayUtil.safeClose();
				console.info(e);
			}
			console.info('listenUnionPayPin');
		},
		*unionPay({ payload }, { select, call, put }) {
			baseUtil.speak('unionpay_paying');// 播放语音
			yield put({type: 'setUnionpay',payload: {pinReaded:true,}});
			yield baseUtil.sleep(2500);
			var settlement = yield select(state => state.payment.settlement);
			
			var strCounterId = "12345678".leftPad(8,"0");// 	8	款台号
			console.info('unionpay.req.款台号['+strCounterId+'] ',strCounterId.length+'位');
			var strOperId	= "12345678".leftPad(8,"0");//8	操作员号
			console.info('unionpay.req.操作员号['+strOperId+'] ',strOperId.length+'位');//01，0000
			var strTransType ="00".leftPad(2,"0");//2	交易编号 传统类交易：00:消费 POS通：01：消费
			console.info('unionpay.req.交易编号['+strTransType+'] ',strTransType.length+'位');
			var strAmount = (""+(settlement.amt*100)).leftPad(12,"0");//	12	金额
			console.info('unionpay.req.金额['+strAmount+'] ',strAmount.length+'位');
			var strOldTrace = "".leftPad(6,"0");	//6	原流水号
			console.info('unionpay.req.原流水号['+strOldTrace+'] ',strOldTrace.length+'位');
			var strOldDate = "".leftPad(8,"0");	//8	原交易日期YYYYMMDD
			console.info('unionpay.req.原交易日期['+strOldDate+'] ',strOldDate.length+'位');
			var strOldRef = "".leftPad(12,"0");	//12	原系统参考号
			console.info('unionpay.req.原系统参考号['+strOldRef+'] ',strOldRef.length+'位');
			var strOldAuth = "".leftPad(6,"0");	//6	原授权号
			console.info('unionpay.req.原授权号['+strOldAuth+'] ',strOldAuth.length+'位');
			var strOldBatch = "".leftPad(6,"0");//6	原批次号
			console.info('unionpay.req.原批次号['+strOldBatch+'] ',strOldBatch.length+'位');
			var strMemo = "".leftPad(1024,"20");//1024	见第4章说明
			console.info('unionpay.req.1024[] ',strMemo.length+'位');
			var strLrc = "123"	;//3	3个校验字符
			console.info('unionpay.req.校验字符['+strLrc+'] ',strLrc.length+'位');
			var req = strCounterId+strOperId+strTransType+strAmount+strOldTrace+strOldDate+strOldRef+strOldAuth+strOldBatch+strMemo+strLrc;
			console.info('unionpay.req  ',req.length+'位');
			try{
				var payResp = unionPayUtil.pay(req);
				settlement = {...settlement,respText : payResp.result.responseText,}
			}catch(e){
				console.info(e);
				unionPayUtil.safeClose();
				settlement = {...settlement,respText : "" }
			}
			console.info('unionPayCallback ',settlement);
			// 调用后台
			var {data} = yield call(unionPayCallback,settlement);
			
			if (data && data.success && data ) {
				var settle = data.result;
				if(!settle || !settle.order){
					baseUtil.error("支付失败，请稍后再试");
					baseUtil.speak('unionpay_payFailure');
		    		return;
				}else{
					var order = settle.order;
					if(order.status ==  'A'){
						baseUtil.error(settle.tradeRspMsg || "支付失败，请稍后再试");
						baseUtil.speak('unionpay_payFailure');
			    		return;
					}else if(order.status ==  '1' || order.status ==  'B' ||order.status ==  '3' || order.status !=  '0'){
						baseUtil.error(settle.tradeRspMsg || "充值失败，请联系工作人员!");
						baseUtil.speak('unionpay_payFailure');
			    		return;
					}else{
						yield put({
				  			type: 'setState',
				  			payload: {
				  				settlement:data.result,
				  				order:order
				  			},
				  		})
						if(order.bizType = '04' ){
							eventUtil.fireEvents("model","afterForegift");
						}else{
							eventUtil.fireEvents("model","afterPay");
						}
						unionPayUtil.safeClose();
					}
				}
				baseUtil.speak('unionpay_payAndTakeCard');// 播放语音
	    	}else{
	    		baseUtil.error("支付失败，请稍后再试");
	    		baseUtil.speak('unionpay_payFailure');
	    		return;
	    	}
			
			yield put({type: 'setUnionpay',payload: {payed:true,}});
			try{
				unionPayUtil.safeClose();
			}catch(e){
				console.info(e);
			}
			console.info('unionPay');
		},
		*cashPay({ payload }, { select, call, put }){console.info("提交现金结算单");
			try{
				yield call(cashBoxUtil.pause);
			}catch(e){
				console.info(e);
				try{
					yield call(cashBoxUtil.safeClose);
				}catch(e1){
					console.info(e1)
				}
				//暂停拉钞如果出错，不关闭程序，否则会影响结算单生成
				//yield put({type: 'setCash',payload: {busy:false,error:true} });
				//baseUtil.warning('钱箱暂停异常，系统将提交您已经存入的金额');
			}
		
			const amt = payload.amt;
			const baseInfo = yield select(state => state.patient.baseInfo);
			const order = yield select(state => state.payment.order);
			
			const orderParam = {
				...order,
				patientNo:baseInfo.no,//病人姓名
				patientName:baseInfo.name,//病人姓名	
				patientIdNo:baseInfo.idNo,//病人身份证号
				patientCardNo:baseInfo.medicalCardNo,//病人卡号	
				patientCardType:baseInfo.cardType,//就诊卡类型 TODO 就诊卡
			};
			console.info("提交现金结算单。订单：",order.id,"结算单金额：",amt);
			const settlement = {
				amt,
				order:orderParam,
				payChannelCode:'0000',
				payTypeCode:'cash',
			};
			try {
				//清空结算单 重新生成
				//yield put({type: 'setState',payload: { settlement :{amt:0}} })
				var {data} = yield yield call(preCreate, settlement);
				if(!( data && data.success && data.result )){
					console.info('PaymentModel preCreate 结算单创建失败'); 
					baseUtil.warning("无法创建现金结算单,系统将提交您已经存入的金额");
					yield put({type: 'setCash',payload: {busy:false,error:true} });
					return;
				}
				const result = data.result||{amt:0};
				const newOrder = result.order||order;
				console.info('预支付，生成结算单  ',result.id,"订单",newOrder.id,'金额',result.amt,'状态',result.status);
				console.info(result);
				if(result.payChannelCode != '0000' && result.status != 'A'){ //预结算状态非初始化状态
					console.info('PaymentModel preCreate 结算单创建失败'); 
					baseUtil.warning("不正确的非现金结算单");
					yield put({type: 'setCash',payload: {busy:false,error:true} });
					return;
				} else if(result.payChannelCode == '0000' && result.status != '0'){
					console.info('PaymentModel preCreate 结算单创建失败'); 
					baseUtil.warning("结算单状态有误,系统将提交您已经存入的金额");
					yield put({type: 'setCash',payload: {busy:false,error:true} });
					return;
				}
				
				yield put({
				  type: 'changeState',
			      payload: {
	  				settlement : result,
	  				order: newOrder,
	  			  },
		  		})
			} catch (e) {
				console.info("现金预结算失败");
				baseUtil.warning("无法预结算，系统将提交您已经存入的金额");
				try{ 
					yield call(cashBoxUtil.safeClose);
				}catch(e2){
					console.info(e2);
				}
				yield put({type: 'setCash',payload: {busy:false,error:true} });
				return;
			}
			try{
				yield put({type: 'setCash',payload: {busy:false} });
				yield call(cashBoxUtil.stopPause);
			}catch(e){
				console.info(e);
				try{ 
					yield call(cashBoxUtil.safeClose);
				}catch(e2){
					console.info(e2);
				}
				baseUtil.warning("取消钱箱暂停异常，系统将提交您已经存入的金额");
				yield put({type: 'setCash',payload: {busy:false,error:true} });
			}
		},
		*submitCashOrder({ payload,callback }, { select, call, put }){
			try{
				lightUtil.cash.turnOff();
			}catch(e){
				console.info(e);
			}
			// const order = yield select(state => state.payment.order);
			// const settlement = yield select(state => state.payment.settlement);
			const {settlement} = payload;
			var {data} = yield call(cashPayCallback,settlement);
			
			if (data && data.success && data ) {
				var settle = data.result;
				if(!settle || !settle.order){
					baseUtil.error("支付失败，请稍后再试");
				}else{
					var order = settle.order;
					if(order.status ==  'A'){
						baseUtil.error("支付失败，请稍后再试");
						if(callback)callback(false);
					}else if(order.status ==  '1' || order.status ==  'B' || order.status !=  '0'){
						baseUtil.error("充值失败，请联系管理人员");
						if(callback)callback(false);
					}else{
						yield put({
				  			type: 'setState',
				  			payload: {
				  				settlement:settle,
				  				order:order
				  			},
				  		})
						if(callback)callback(true);
						eventUtil.fireEvents("model","afterPay");
					}
				}
	    	}else if(data && data.msg ){
	    		baseUtil.error(data.msg );
	    		if(callback)callback(false);
	    	}else{
	    		baseUtil.error('支付回调失败，请联系业务人员');
	    		if(callback)callback(false);
	    	}
		},
		*submitBalanceOrder({ payload,callback }, { select, call, put }){
			// const order = yield select(state => state.payment.order);
			const settlement = yield select(state => state.payment.settlement);
			console.info('提交余额订单（回调）',order);
			var {data} = yield call(balancePayCallback,settlement);
			if (data && data.success && data ) {
				var settle = data.result;
				if(!settle || !settle.order){
					baseUtil.error("支付失败，请稍后再试");
				}else{
					var order = settle.order;
					if(order.status ==  'A'){
						baseUtil.error("支付失败，请稍后再试");
						if(callback)callback(false);
					}else if(order.status ==  '1' || order.status ==  'B' || order.status !=  '0'){
						baseUtil.error("充值失败，请联系管理人员");
						if(callback)callback(false);
					}else{
						yield put({
				  			type: 'setState',
				  			payload: {
				  				settlement:settle,
				  				order:order
				  			},
				  		})
						eventUtil.fireEvents("model","afterForegift");
						eventUtil.fireEvents("model","afterConsume");
						if(callback)callback(true);
					}
				}
	    	}else{
	    		baseUtil.error('支付回调失败，请联系业务人员');
	    		if(callback)callback(false);
	    	}
		},
		*closeCashBox({ payload }, { select, call, put }){
			try{
				yield call(cashBoxUtil.safeClose);
			}catch(e){
				console.info(e);
				baseUtil.error('钱箱错误，请更换自助机');
			}
		},
		*querySettlement({ payload }, { select, call, put }){
			var settlement = yield select(state => state.payment.settlement);
			var {data} = yield call(getSettlement,settlement.id);
			if (data && data.success ) {
	    		yield put({
		  			type: 'setState',
		  			payload: {
		  				settlement:data.result,
		  			},
		  		})
	    	}
		},
		*balancePay({ payload }, { select, call, put }){//消费接口
			// 通过socket 支付 支付成功
		},
		*weixinPay(){
			
		},
		*aliPay(){
			
		},
		*waitingForResult(){
			
		},
		*preCreate({ payload,callback }, { select, call, put }){
			//清空结算单 重新生成
			yield put({type: 'setState',payload: { settlement :{amt:0}} })
			const { settlement } = payload;
			var {data} = yield yield call(preCreate, settlement);
			if(!( data && data.success && data.result )){
				console.info('PaymentModel preCreate 结算单创建失败'); 
				baseUtil.error("系统无法支付，请联系业务人员或更换自助机");
				return;
			}
			
			const result = data.result||{amt:0};
			const order = yield select(state => state.payment.order);
			const newOrder = result.order||order;
			console.info('预支付，生成结算单  ',result.id,"订单",newOrder.id,'金额',result.amt,'状态',result.status);
			console.info(result);
			if(result.payChannelCode != '0000' && result.status != 'A'){ //预结算状态非初始化状态
				console.info('PaymentModel preCreate 结算单创建失败'); 
				baseUtil.error("系统无法支付，请联系业务人员或更换自助机");
				return;
			} else if(result.payChannelCode == '0000' && result.status != '0'){
				console.info('PaymentModel preCreate 结算单创建失败'); 
				baseUtil.error("系统无法支付，请联系业务人员或更换自助机");
				return;
			}
			yield put({
	  			type: 'setState',
	  			payload: {
	  				settlement : result,
	  				order: newOrder,
	  			},
	  		})
			
			if(callback)callback();
		},
		*setState({ payload,callback }, { select, call, put }) {
			yield put({
	  			type: 'changeState',
	  			payload:payload
	  		})
			if(callback)callback();
		},
		*reset({ payload }, { select, call, put }) {
			try{
		    	cashBoxUtil.safeClose();
		    	unionPayUtil.safeClose();
		    	lightUtil.pin.turnOff();
			}catch(e){
				console.info(e);
				console.info('外设关闭出错！');
			}

	    	var dft = {
				order: {
					amt:0
				},
				settlement : {
					amt:0
				},
				payChannel:null,
				payType:null,
				unionpay   : {
					inited:false,
					cardReaded:false,
					pinReaded:false,
					payed:false,
					closed:false,
					password:"",
				},
				alipay: {},
				cash :{
					busy:false,
					error:false,
				},
				wxpay: {},
				limit:0,
			}
	    	yield put({
	  			type: 'changeState',
	  			payload: dft,
	  		})
		}
	},

	//处理state
	reducers: {
		setUnionpay (state, {payload}) {
			let unionpay = {...state.unionpay,...payload};
			return {...state, unionpay:unionpay};
		},
		setCash (state, {payload}) {
			let cash = {...state.cash,...payload};
			return {...state, cash:cash};
		},
		changeState (state, {payload}) {
			return {...state, ...payload};
		},
	},
};




