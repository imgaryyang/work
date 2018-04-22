import dva from 'dva';
import { loadAcctInfo,patientLogin,createProfile,openDeposit } from '../services/PatientService';
import {sendAuthCode,verifyAuthCode} from '../services/SMSService';
import baseUtil from '../utils/baseUtil';
import medicalCard  from '../utils/medicalCardUtil';
import miCard  from '../utils/miCardUtil';
import idCard  from '../utils/idCardUtil';
export default {

	namespace: 'patient',

	state: {
		baseInfo : {},
		account : {},
		idCardInfo : {},
		medicalCardInfo : {},
		miCardInfo : {},
	},

	subscriptions: {
		miCardEvent({dispatch, history }) {//社保卡事件监听
			miCard.on("cardPushed",function(eventKey,cardInfo){//监听插卡事件
				console.info('miCardPushed');
				dispatch({type: 'setState',
					payload:{miCardInfo:cardInfo}
				});
			});
			miCard.on("cardPoped",function(eventKey,cardInfo){//监听弹卡事件
				dispatch({type: 'setState',
					payload:{miCardInfo:{}}
				});
			});
		},
		medicalCardEvent({dispatch, history }) {//就诊卡事件监听
			medicalCard.on("cardPushed",function(eventKey,cardInfo){//监听插卡事件
				console.info('medicalCardPushed');
				dispatch({type: 'setState',
					payload:{medicalCardInfo:cardInfo}
				});
			});
			medicalCard.on("cardPoped",function(eventKey,cardInfo){//监听弹卡事件
				dispatch({type: 'setState',
					payload:{medicalCardInfo:{}}
				});
			});
		},
		idCardEvent({dispatch, history }) {// 身份证事件监听
			idCard.on("cardPuted",function(eventKey,cardInfo){//监听插卡事件
				dispatch({type: 'setState',
					payload:{idCardInfo:cardInfo}
				});
			});
		}
	},
	effects: {
		*listenLoginCard({ payload }, { select, call, put }) {
			baseUtil.speak('card_pushMiOrMCard');// 播放语音：请插入您的医保卡或社保卡
			try{
				medicalCard.listenCard();//开始监听就诊卡
			}catch(e){
				console.info(e);
			}
			try{
				miCard.listenCard();//开始监听医保卡
			}catch(e){
				console.info(e);
			}
			console.info('listenLoginCard');
		},
		*listenMiCard({ payload }, { select, call, put }) {
			//获取卡类型
			if(payload.cardType == 'siCard'){//社保卡
				baseUtil.speak('card_pushMiCard');// 播放语音：请插入您的社保卡
			}
			if(payload.cardType == 'healthCard'){//就诊卡
				baseUtil.speak('card_pushMiOrMCard');// 播放语音：请插入您的就诊卡
			}
			
			try{
				miCard.listenCard();//开始监听就诊卡
			}catch(e){
				console.info(e);
			}
//			console.info('listenMiCard');
		},
		*listenIdCard({ payload }, { select, call, put }) {
			yield put({type: 'setState',payload: {//重新读取，清空身份证信息
  				idCardInfo:{}
  			}});
			baseUtil.speak('card_putIdCard');// 播放语音：请将您的身份证放置到身份证读卡器
			try{
				idCard.listenCard();//开始监听身份证
			}catch(e){
				console.info(e);
			}
		},
		*sendAuthCode({ payload }, { select, call, put }) {
			 var {data} = yield call(sendAuthCode,payload.mobile);
			 var sended =(data && data.success )?true:false;
			 if(sended && payload.callback){
				 payload.callback();
			 }
		},
		*checkAuthCode({ payload }, { select, call, put }) {
			var {data} = yield call(verifyAuthCode,payload);
			var verified =(data && data.success );
			if(verified && payload.callback){
				payload.callback();
			 }
		},
		*createProfile({ payload }, { select, call, put }) {
			var {data} = yield call(createProfile,payload.baseInfo);
			if(data && data.success && data.result ){
				yield put({type: 'setState',payload: {
					baseInfo: data.result
		  		}})
			}
		},
	    *loadAcctInfo ({ payload }, { select, call, put }) {//载入账户基本信息
	    	const {data} = yield call(loadAcctInfo);
	    	if (data && data.success ) {
	    		yield put({
		  			type: 'setState',
		  			payload: {
		  				account: data.result
		  			},
		  		})
	    	}
	    },
	    *login ({ payload }, { select, call, put }) {//患者登录获取基本信息，包含账户信息
	    	const myState = yield select(state => state.patient);
	    	const {medicalCardInfo,miCardInfo} = myState;
	    	
	    	const medicalCardNo = medicalCardInfo.cardNo;
	    	const miCardNo = miCardInfo.cardNo;
	    	let   medium = 'other';
	    	
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
	    		console.info('社保卡登录');
	    		medium = 'miCard';//medicalCard.stopListenCard();//停止监听诊疗卡
	    		miCard.listenCardLeave();//重启社保卡监听，如果中途取走卡片，停止业务跳转首页
	    	}}catch(e){console.info(e)}
	    	
	    	const {data} = yield call(patientLogin,loginInfo);
	    	if (data && data.success ) {
	    		let account = data.result?data.result.account:{};
	    		let baseInfo = {...data.result,medium:medium};
	    		yield put({
		  			type: 'setState',
		  			payload: {
		  				baseInfo : baseInfo,
		  				account : account,
		  			},
		  		})
	    	}
	    },
	    *logout ({ payload }, { select, call, put }) {//退出
	    	console.info('退出登录');
	    	try{
	    		medicalCard.safeClose();//关闭设备
	    		miCard.safeClose();//关闭设备
	    		yield put({type: 'setState',payload: {
		  				baseInfo:{},
		  				account: {},
		  				idCardInfo : {},
		  				medicalCardInfo : {},
		  				miCardInfo : {},
	    		}})
	    	}catch(e){
	    		console.info(e);
	    	}
	    },
	    
	    *openDeposit ({ payload }, { select, call, put }) {//开通预存
	    	const {data} = yield call(openDeposit);
	    	if (data && data.success ) {
	    		yield put({
		  			type: 'setState',
		  			payload: {
		  				account: data.result
		  			},
		  		})
	    	}
	    },
	},

	//处理state
	reducers: {
		setState (state, {payload}) {console.info('setState : ',payload);
			return { ...state, ...payload,};
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