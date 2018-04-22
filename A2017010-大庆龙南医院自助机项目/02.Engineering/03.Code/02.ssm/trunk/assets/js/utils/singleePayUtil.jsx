
import eventUtil from './eventUtil.jsx';
import baseUtil from './baseUtil.jsx';
import moment from 'moment';
import lightUtil from './lightUtil.jsx';
import logUtil,{ log } from  "./logUtil.jsx";

const Light = lightUtil.bankCard;
const PinLight = lightUtil.pin;

const DEVICE_ID="SingleePayActiveX",
	eventFlag = "unionpay",
	dev_mode = false;//baseUtil.dev_mode;;
let DEVICE,DEVICE_Handle=null;

/***以下是开发模式***/
const emptyF = function(){};
const DEVICE_dev = {
		SINGLEE_Card_Trans:function(req,callback){
			var code = req.substr(0,2) ;
			if(code == '01'){//交易
				
			}else if(code == '27'){
				
			}else if(code == '90'){
				
			}
		}
}


function addListener(event,func){
	eventUtil.addListener(eventFlag,event,func);
}
function removeListener(event,index){
	eventUtil.removeListener(eventFlag,event,index);
}
function fireEvents(event,arg){
	eventUtil.fireEvents(eventFlag,event,arg);
}
function decode(s) {
	log('s',s);
	var ss = s.replace(/\\(u[0-9a-fA-F]{4})/gm, '%$1');
	log('ss ',ss);
	var us  = unescape(ss);
	log('us ',us);
    return us;
}
function cutString(str,start,len){  
    if(!str) return "";  
    if(len<= 0) return "";  
    var templen=0;  
    for(var i=0;i<str.length;i++){  
        if(str.charCodeAt(i)>255){  
            templen+=2;  
        }else{  
            templen++  
        }  
        if(templen == len){  
            return str.substring(start,i+1);  
        }else if(templen >len){  
            return str.substring(start,i);  
        }  
    }  
        return str;  
}  

/******************************Ocx 内置函数封装 **********/
function cardTrans(tradeCode,msg,pinCallback,tranCallback){
	var defPinCB = function(ascKey){
		var key = String.fromCharCode(ascKey);
		log('新利-默认密码回调 ',key,ascKey);
	}
	var defTranCB = function(){
		console.info('新利-默认交易回调 ');
		console.info(arguments);
	}
//	pinCallback = pinCallback || defPinCB;
//	tranCallback = tranCallback || defTranCB;
// 	var res = DEVICE.SINGLEE_Card_Trans_Async(tradeCode+msg,defPinCB,defTranCB);//不传回调函数模式 _NO_CB
	var req = tradeCode+msg;
	log('新利-req',req);
	var res = DEVICE.SINGLEE_Card_Trans_NO_CB(tradeCode+msg);//不传回调函数模式 
	log('新利-SINGLEE_Card_Trans_NO_CB',res);
	var result = decode(res);//转义unicode字符
	log('新利-decode',result);
	return result;
}
function readCard(){
	log('新利-readCard');
	return cardTrans('27',"".leftPad(423," "));
}
function pay(msg,callback){
	log('新利-pay');
	return cardTrans('01',msg||'',callback);
}
function popCard(msg){
	log('新利-popCard');
	return cardTrans('90',msg||''.leftPad(423," "));
}
/*****************************支付流程 **********/
/**
 * 初始化交易、打开读卡器
 */
function init(){log('新利-init ocx');
	if(dev_mode)DEVICE = DEVICE_dev;
	if(!DEVICE) DEVICE = document.getElementById(DEVICE_ID);
	if(!DEVICE)throw new Error("找不到ocx控件");
}
function initEnv(callback){log('新利-环境初始化');
	if(!DEVICE)init();
	if(callback)callback();
}
function listenCard(callback){
	log('新利-listenCard');
	var json = readCard();//直接读卡，这是个同步动作
	log('新利-listenCard-json',json);
	var obj ={};
	try{
		obj = JSON.parse(json);
	}catch(e){
		log('新利-listenCard-解析返回异常',e);
		callback({retCode:'-1',retMsg:'解析卡号失败'}) ;
		return;
	}
	if(obj.stateCode != 0 ){
		log('新利-listenCard-异常读卡后弹出当前卡');
		popCard();
	}else{
		var responseText = obj.responseText;
		log('新利-listenCard-返回报文',responseText);
		var retCode =cutString(responseText,0,6);// responseText.substr(0,6) ;
		
		var retMsg = cutString(responseText,6,40);//responseText.substr(6,40) ;
		var cardNo = cutString(responseText,64,19);//responseText.substr(64,19) ;
		var retObj = {retCode,retMsg,cardNo};
		log('新利-listenCard-解析返回',retObj);
		
		if('000000' == retCode){
			callback(retObj) ;
		}else if('C40001' == retCode){//读卡器打开失败
			// throw new Error("读卡器打开失败");
			callback(retObj) ;
		}else if('C40004' == retCode){//取消读卡
			// throw new Error("取消读卡");
			callback(retObj) ;
		}else if('C98088' == retCode){//交易处理失败
			// throw new Error("读卡器打开失败");
			callback(retObj) ;
		}else if('C40002' == retCode){//超时
			// throw new Error("读卡器打开失败");
			callback(retObj) ;
		}else{
			baseUtil.speak('unionpay_checkBankcard');// 播放语音
			popCard();
			listenCard(callback);
		}
	}
	
}
function startTran(req,config){
	const {
		onStart,
		onChange,
		onTimeout,
		onCancel,
		onEnter,
		onError,
	} = config;//密码键盘事件
	var pin=0;
	log('新利-支付请求报文('+req.length+') ',req);
	var result = pay(req,(ascKey)=>{
		var key = String.fromCharCode(ascKey);
		log('新利-密码键盘回调 ',key,ascKey);
		if('C' == key ){//取消支付
			if(onCancel)onCancel();
		}else if('B' == key ){//更正 删除
			if(pin > 0)pin = pin-1;
			if(onChange)onChange(pin);
		}else if('E' == key ){//确认确定
			if(onEnter)onEnter();
		}else if('*' == key ){//*
			pin++;
			if(onChange)onChange(pin);
		}else if('S' == key ){//开启密码键盘
			log('新利-开始监听密码键盘');
			PinLight.blink();
			if(onStart)onStart();
		}else if('O' == key ){//密码超时
			if(onTimeout)onTimeout();
		}
	})
	var resp =  JSON.parse(result);
	if(resp.stateCode == '0'){//TODO 可以不用解析
		var responseText = resp.responseText;
		log('新利-支付-解析返回字符串'+responseText.length);
		var strRespCode = responseText.substring(0,6);//2	应答码
		log('新利-支付-应答码['+strRespCode+'] ',strRespCode.length+'位');
		var result =  {
			strRespCode : strRespCode, 
			responseText:responseText,
		}
		log('新利-支付-解析结果',result);
		return {stateCode:resp.stateCode,result:result}
	}else{
		log('新利-支付-交易异常');
		throw new Error("交易异常");
	}
}

function safeClose(){log('新利-弹出卡并关闭读卡器');
	if(!DEVICE)init();
	popCard();
}
const UP={
	initEnv : initEnv,
	listenCard:listenCard,//监听到卡返回卡信息并停止监听
	startTran:startTran,
	safeClose:safeClose,
	on:addListener,
	un:removeListener,
}
module.exports = UP;