import dva from 'dva';
//import { loadOrderList, prepaidCash, prepaid, inpatientPrepaid, paid, loadNeedPay, miPreSettlement, miSettlement, goToPay, accountPay } from '../services/OrderService';
import {prepaidCash} from '../services/PrepaidService';
import moment from 'moment';
import baseUtil from '../utils/baseUtil';
import cashBoxUtil  from '../utils/cashBoxUtil';
import unionPayUtil from '../utils/unionPayUtil';
export default {

	namespace: 'payment',

	state: {
		order      : {
			
		},
		settlement : {
			amt:0
		},
		unionpay   : {
			inited:false,
			cardReaded:false,
			pinReaded:false,
			payed:false,
			password:"",
		},
		alipay     : {
			
		},
		wxpay      : {
			
		},
	},

	//订阅
	subscriptions: {
		cashBoxEvent({dispatch, history }) { 
			cashBoxUtil.on("cashPushed",function(eventKey,amt){ 
				console.info('cashPushed : '+ amt);
				//cashBox.stopListenCash();
				//setTimeout(cashBox.listenCash(),15000);
				dispatch({type: 'cashPay',payload:{amt:amt}});
			});
		},
		unpionPayEvent({dispatch, history }) {//订阅银联外设事件
			unionPayUtil.on("cardPushed",function(eventKey,cardInfo){
				dispatch({type: 'unionPayCardPushed',payload:{cardInfo:cardInfo}});//插入卡后读卡
			});
			unionPayUtil.on("pinCountChange",function(eventKey,{pinCount}){
				var value="",i=0;
				for(i=0;i<pinCount;i++){value+="*"}console.info(value);
				dispatch({ type: 'setUnionpay', payload:{password:value,}});
			});
			unionPayUtil.on("pinReaded",function(eventKey){
				dispatch({type: 'unionPay'});//读取密码结束，进行交易
			});
			unionPayUtil.on("pinTimeOut",function(eventKey){
			});	
		}
	},

	//远程请求
	effects: {
		*listenCashBox({ payload }, { select, call, put }) {
			baseUtil.speak('pay_pushCash');// 播放语音
			try{
				cashBoxUtil.listenCash();
			}catch(e){
				console.info(e);
			}
			console.info('listenCashBox');
		},
		*initUnionPay({ payload }, { select, call, put }) {
			baseUtil.speak('unionpay_checkEnv');// 播放语音 ,
			yield baseUtil.sleep(3500);
			try{
				var result = yield call(unionPayUtil.initEnv);//初始化
				yield put({type: 'setUnionpay',payload: {inited:true,}})
				
		    	if(!(result && result.cardExist)){//卡不存在,语音提示
		    		baseUtil.speak('unionpay_insertCard');
		    		yield baseUtil.sleep(3500);
		    	}
		    	yield call(unionPayUtil.listenCard);//开始监听
			}catch(e){
				console.info(e);
			}
			console.info('listenUnionPayCard');
		},
		*unionPayCardPushed({ payload }, { select, call, put }) {
			yield put({type: 'setUnionpay',payload: {inited:true,cardReaded:true}});
			baseUtil.speak('unionpay_enterPass');// 播放语音
			yield baseUtil.sleep(2500);
			try{
				unionPayUtil.listenPin();
			}catch(e){
				console.info(e);
			}
			console.info('listenUnionPayPin');
		},
		*unionPay({ payload }, { select, call, put }) {
			baseUtil.speak('unionpay_paying');// 播放语音
			yield put({type: 'setUnionpay',payload: {pinReaded:true,}});
			yield baseUtil.sleep(2500);
			try{
				unionPayUtil.pay();
			}catch(e){
				console.info(e);
			}
			//TODO  调用后台
			baseUtil.speak('unionpay_payAndTakeCard');// 播放语音
			yield put({type: 'setUnionpay',payload: {payed:true,}});
			try{
				unionPayUtil.safeClose();
			}catch(e){
				console.info(e);
			}
			console.info('unionPay');
		},
		*cashPay({ payload }, { select, call, put }){
			var amt = payload.amt;
			yield call(cashBox.pause);
			var {data} = yield call(prepaidCash,{amt:amt});
			if (data && data.success ) {
	    		yield put({
		  			type: 'setState',
		  			payload: {
		  				settlement:data.result,
		  			},
		  		})
	    	}
			console.info(data);
  			yield call(cashBox.stopPause);
		},
		*balancePay(){
			
		},
		*weixinPay(){
			
		},
		*aliPay(){
			
		},
		*waitingForResult(){
			
		}
	},

	//处理state
	reducers: {
		chooseChannel(state, {payload}){
			let settlement = {...state.settlement,payChannelCode:payload.channelCode} ;
			return {...state, settlement:settlement};
		},
		setUnionpay (state, {payload}) {
			let unionpay = {...state.unionpay,...payload};
			return {...state, unionpay:unionpay};
		},
		setState (state, {payload}) {
			return {...state, ...payload};
		},
	},
};




