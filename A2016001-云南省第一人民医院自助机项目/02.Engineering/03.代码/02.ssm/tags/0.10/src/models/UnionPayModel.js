import dva from 'dva';
import unionPayUtil from '../utils/unionPay';
const payEvent = unionPayUtil.payEvent;
function sleep(ms) {
	  return new Promise(resolve => setTimeout(resolve, ms))
}
export default {
	namespace: 'unionPay',
	state: {
		password:{count:0,value:""},//密码键盘状态
		card:{value:"",},//银行卡状态
		step: {stepName:'init'} ,// 当前步骤//checkEnv,insertCard,enterPassword,paying,payed,error
		messages:[],
		error:null,//{type:'',msg:'',description:"",},//错误
	},
	subscriptions: {
		cardEvent({dispatch, history }) {//订阅银联外设事件
			payEvent("cardPush",function(eventKey,{cardState}){
				dispatch({type: 'readCard'});//插入卡后读卡
			});
			payEvent("pinCountChange",function(eventKey,{pinCount}){
				var value="",i=0;
				for(i=0;i<pinCount;i++){value+="*"}
				dispatch({ type: 'setPassword', password:{count:pinCount,value:value},});
			});
			payEvent("pinReaded",function(eventKey){
				dispatch({type: 'pay'});//读取密码结束，进行交易
			});
			payEvent("pinTimeOut",function(eventKey){
				dispatch({
	    			type: 'addMsg',
	    			msg:{title:'密码键盘',description:"键盘超时",type:"info"},
		        });
			});	
		}
	},
	effects: {
	    *checkEnv({ payload }, { select, call, put }) {
	    	try {
	    		yield put({
					 type:'setStep',step:{stepName:'checkEnv',stepText:"正在检查支付环境,请等待",audioKey:'checkEnv'}// 提示正在初始化
				});
	    		yield sleep(3500);
		    	var result = yield call(unionPayUtil.startPay);//初始化
		    	if(result && result.cardExist){
		    		yield put({type:'readCard'});//卡存在，直接读卡
		    	}else{
		    		
		    		yield put({type:'setStep',step:{stepName:'insertCard',stepText:"请插入银行卡",audioKey:'insertCard'}});//提示插入银行卡
		    		yield call(unionPayUtil.listenCard);//开始监听
		    	}
			} catch (e) {
				console.info('初始化环境异常',e);
				yield put({type:'setStep',step:{stepName:'error',stepText:"支付环境异常,请联系工作人员",audioKey:'error'}});//出错
			}
	    },
	    *readCard({ payload }, { select, call, put }){
	    	try {
				yield call(unionPayUtil.stopListenCard);//停止监听
		    	var {cardNo} = yield call(unionPayUtil.readCard);//读卡
		    	yield call(unionPayUtil.startAndListenPin);//打开并监听密码键盘
		    	yield put({type:'setStep',step:{stepName:'enterPassword',stepText:"请输入密码",audioKey:'enterPassword'}});//提示请输入密码
			} catch (e) {
				console.info('读卡异常',e);
				yield put({type:'setStep',step:{stepName:'error',stepText:"银行卡读取异常,请联系工作人员",audioKey:'error'}});//出错
			}
	    },
	    *pay({ payload }, { select, call, put }){
	    	yield put({type:'setStep',step:{stepName:'paying',stepText:"正在支付,请勿离开",audioKey:'paying'}});
	    	//var {order}={payload};
	    	yield sleep(3500);
	    	var order={
	    			counterId:"00000001",//收银台号
	    			operId:"00000002",//操作员号
	    			transType:"03",//交易类型
	    			amount:"000000000001",//交易金额
	    			oldTrace:"666666",//原交易凭证号
	    			oldDate:"20150805",//原交易日期
	    			oldRef:"121212121212",//原交易参考号
	    			oldAuth:"777777",//原交易授权码
	    			oldBatch:"888888",//原交易批次号
	    			LRC:"999",//交易校验值
	    			memo:"20202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020",//附加信息
	    		}
	    	var {
	    		counterId,//收银台号
    			operId,//操作员号
    			transType,//交易类型
    			amount,//交易金额
    			oldTrace,//原交易凭证号
    			oldDate,//原交易日期
    			oldRef,//原交易参考号
    			oldAuth,//原交易授权码
    			oldBatch,//原交易批次号
    			LRC,//交易校验值
    			memo,
	    	} = order;
	    	var req =counterId+operId+transType+amount+oldTrace+oldDate+oldRef+oldAuth+oldBatch+memo+LRC;
	    	var response = yield call(unionPayUtil.pay,req);//支付
	    	if(response && response.stateCode == 0 ){
	    		console.info("交易返回码 ： "+ response.stateCode);
	    		console.log(response.result);
	    		yield put({type:'popCard'});
	    	}else{
	    		yield put({type:'setStep',step:{stepName:'error',stepText:"交易返回异常",audioKey:'error'}});//出错
	    	}
	    },
	    *popCard({ payload }, { select, call, put }){
	    	try {
				yield call(unionPayUtil.popCard);//弹出卡
				yield put({type:'setStep',step:{stepName:'payedAndTakeCard',stepText:"支付完成,请取走您的银行卡",audioKey:'payedAndTakeCard'}});
			} catch (e) {
				console.info('弹卡异常',e);
				yield put({type:'setStep',step:{stepName:'error',stepText:"银行卡读取异常,请联系工作人员",audioKey:'error'}});//出错
			}
	    },
	    *'delete'(){},
	    *update(){}
	},
	reducers: {
		"addMsg"(state,{msg}) {
			state.messages.push(msg);
			return {...state};
		},
		"setState"(old,{state}) {
			return {...old,...state};
		},
		"setPassword"(state,{password}) {
			var password = {...state.password,...password}
			return {...state,password:password};
		},
		"setStep"(state,{step}) {
			var password = {...state.step,...step}
			return {...state,step:step};
		},
	},
};